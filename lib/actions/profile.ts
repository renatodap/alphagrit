/**
 * Profile Management Server Actions
 * Zero hardcoding - all from database and constants
 */

'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { ROUTES, TOAST_MESSAGES, STORAGE_BUCKETS, FILE_UPLOAD_LIMITS } from '@/lib/constants'
import type { Profile } from '@/types'

/**
 * Get user profile
 */
export async function getProfile(
  userId: string
): Promise<{
  profile: Profile | null
  error: string | null
}> {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user || user.id !== userId) {
      return { profile: null, error: TOAST_MESSAGES.en.ERROR.UNAUTHORIZED }
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
      return { profile: null, error: error.message }
    }

    return { profile, error: null }
  } catch (error) {
    console.error('Unexpected error fetching profile:', error)
    return { profile: null, error: TOAST_MESSAGES.en.ERROR.GENERIC }
  }
}

/**
 * Update user profile
 */
export async function updateProfile(
  userId: string,
  data: {
    full_name?: string
    avatar_url?: string
  }
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user || user.id !== userId) {
      return { success: false, error: TOAST_MESSAGES.en.ERROR.UNAUTHORIZED }
    }

    // Update profile
    const { error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', userId)

    if (error) {
      console.error('Error updating profile:', error)
      return { success: false, error: error.message }
    }

    revalidatePath(ROUTES.ACCOUNT)
    revalidatePath(ROUTES.ACCOUNT_SETTINGS)

    return { success: true, error: null }
  } catch (error) {
    console.error('Unexpected error updating profile:', error)
    return { success: false, error: TOAST_MESSAGES.en.ERROR.GENERIC }
  }
}

/**
 * Upload avatar to Supabase Storage
 */
export async function uploadAvatar(
  userId: string,
  formData: FormData
): Promise<{
  avatarUrl: string | null
  error: string | null
}> {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user || user.id !== userId) {
      return { avatarUrl: null, error: TOAST_MESSAGES.en.ERROR.UNAUTHORIZED }
    }

    const file = formData.get('avatar') as File

    if (!file) {
      return { avatarUrl: null, error: 'No file provided' }
    }

    // Validate file type
    const allowedTypes = FILE_UPLOAD_LIMITS.ALLOWED_IMAGE_TYPES.map(ext =>
      `image/${ext.replace('.', '')}`
    )

    if (!allowedTypes.includes(file.type) && !file.type.includes('webp')) {
      return {
        avatarUrl: null,
        error: `Invalid file type. Allowed types: ${FILE_UPLOAD_LIMITS.ALLOWED_IMAGE_TYPES.join(', ')}`
      }
    }

    // Validate file size
    if (file.size > FILE_UPLOAD_LIMITS.IMAGE_MAX_SIZE) {
      return {
        avatarUrl: null,
        error: `File too large. Maximum size: ${FILE_UPLOAD_LIMITS.IMAGE_MAX_SIZE / 1024 / 1024}MB`
      }
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}-${Date.now()}.${fileExt}`
    const filePath = `avatars/${fileName}`

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKETS.SITE_ASSETS)
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type,
      })

    if (uploadError) {
      console.error('Error uploading avatar:', uploadError)
      return { avatarUrl: null, error: uploadError.message }
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(STORAGE_BUCKETS.SITE_ASSETS)
      .getPublicUrl(filePath)

    // Update profile with new avatar URL
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', userId)

    if (updateError) {
      console.error('Error updating profile with avatar:', updateError)
      return { avatarUrl: null, error: updateError.message }
    }

    revalidatePath(ROUTES.ACCOUNT)
    revalidatePath(ROUTES.ACCOUNT_SETTINGS)

    return { avatarUrl: publicUrl, error: null }
  } catch (error) {
    console.error('Unexpected error uploading avatar:', error)
    return { avatarUrl: null, error: TOAST_MESSAGES.en.ERROR.GENERIC }
  }
}

/**
 * Change user password
 */
export async function changePassword(
  oldPassword: string,
  newPassword: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !user.email) {
      return { success: false, error: TOAST_MESSAGES.en.ERROR.UNAUTHORIZED }
    }

    // Verify old password by attempting to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: oldPassword,
    })

    if (signInError) {
      return { success: false, error: 'Current password is incorrect' }
    }

    // Update password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (updateError) {
      console.error('Error updating password:', updateError)
      return { success: false, error: updateError.message }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error('Unexpected error changing password:', error)
    return { success: false, error: TOAST_MESSAGES.en.ERROR.GENERIC }
  }
}

/**
 * Delete user account
 */
export async function deleteAccount(
  userId: string,
  password: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user || user.id !== userId || !user.email) {
      return { success: false, error: TOAST_MESSAGES.en.ERROR.UNAUTHORIZED }
    }

    // Verify password
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password,
    })

    if (signInError) {
      return { success: false, error: 'Password is incorrect' }
    }

    // Delete user profile (this will cascade to other tables)
    const { error: deleteProfileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId)

    if (deleteProfileError) {
      console.error('Error deleting profile:', deleteProfileError)
      return { success: false, error: deleteProfileError.message }
    }

    // Delete auth user
    const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(userId)

    if (deleteAuthError) {
      console.error('Error deleting auth user:', deleteAuthError)
      // Profile is already deleted, so we continue
    }

    return { success: true, error: null }
  } catch (error) {
    console.error('Unexpected error deleting account:', error)
    return { success: false, error: TOAST_MESSAGES.en.ERROR.GENERIC }
  }
}
