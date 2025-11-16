'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { tokens } from '@/lib/design-tokens'
import toast from 'react-hot-toast'
import { updateProfile, uploadAvatar, changePassword, deleteAccount } from '@/lib/actions/profile'
import { signOut } from '@/lib/actions/auth'
import type { Profile } from '@/types'

interface SettingsFormProps {
  userId: string
  profile: Profile | null
}

/**
 * Settings form - Client component for interactivity
 */
export default function SettingsForm({ userId, profile }: SettingsFormProps) {
  const router = useRouter()

  // Profile form state
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [profileLoading, setProfileLoading] = useState(false)

  // Password form state
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)

  // Delete account state
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)

  /**
   * Handle profile update
   */
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileLoading(true)

    try {
      // Update full name if changed
      if (fullName.trim() && fullName !== profile?.full_name) {
        const { success, error } = await updateProfile(userId, {
          full_name: fullName,
        })

        if (error) {
          toast.error(error)
          setProfileLoading(false)
          return
        }
      }

      // Upload avatar if selected
      if (avatarFile) {
        const formData = new FormData()
        formData.append('avatar', avatarFile)

        const { avatarUrl, error } = await uploadAvatar(userId, formData)

        if (error) {
          toast.error(error)
          setProfileLoading(false)
          return
        }
      }

      toast.success('Profile updated successfully')
      setAvatarFile(null)
      router.refresh()
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setProfileLoading(false)
    }
  }

  /**
   * Handle password change
   */
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordLoading(true)

    try {
      // Validate passwords
      if (!oldPassword || !newPassword || !confirmPassword) {
        toast.error('Please fill in all password fields')
        setPasswordLoading(false)
        return
      }

      if (newPassword !== confirmPassword) {
        toast.error('New passwords do not match')
        setPasswordLoading(false)
        return
      }

      if (newPassword.length < 8) {
        toast.error('Password must be at least 8 characters')
        setPasswordLoading(false)
        return
      }

      const { success, error } = await changePassword(oldPassword, newPassword)

      if (error) {
        toast.error(error)
        setPasswordLoading(false)
        return
      }

      toast.success('Password changed successfully')
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      toast.error('Failed to change password')
    } finally {
      setPasswordLoading(false)
    }
  }

  /**
   * Handle account deletion
   */
  const handleAccountDelete = async (e: React.FormEvent) => {
    e.preventDefault()
    setDeleteLoading(true)

    try {
      // Validate confirmation
      if (deleteConfirm !== 'DELETE') {
        toast.error('Please type DELETE to confirm')
        setDeleteLoading(false)
        return
      }

      if (!deletePassword) {
        toast.error('Please enter your password')
        setDeleteLoading(false)
        return
      }

      const { success, error } = await deleteAccount(userId, deletePassword)

      if (error) {
        toast.error(error)
        setDeleteLoading(false)
        return
      }

      toast.success('Account deleted successfully')

      // Sign out and redirect
      await signOut()
    } catch (error) {
      toast.error('Failed to delete account')
      setDeleteLoading(false)
    }
  }

  return (
    <div
      style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: `${tokens.spacing['2xl']} ${tokens.spacing.lg}`,
      }}
    >
      <div
        style={{
          marginBottom: tokens.spacing['2xl'],
        }}
      >
        <h1
          style={{
            fontSize: tokens.fontSize['4xl'],
            fontWeight: tokens.fontWeight.bold,
            marginBottom: tokens.spacing.sm,
          }}
        >
          Account Settings
        </h1>
        <p
          style={{
            fontSize: tokens.fontSize.lg,
            color: tokens.colors.neutral[600],
          }}
        >
          Manage your account preferences and security
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gap: tokens.spacing.lg,
          maxWidth: '800px',
        }}
      >
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your personal information and avatar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileUpdate}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: tokens.spacing.lg,
                }}
              >
                <div>
                  <Label htmlFor="email">Email (read-only)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile?.email || ''}
                    disabled
                    readOnly
                    style={{
                      marginTop: tokens.spacing.xs,
                      opacity: 0.6,
                      cursor: 'not-allowed',
                    }}
                  />
                </div>

                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    style={{ marginTop: tokens.spacing.xs }}
                  />
                </div>

                <div>
                  <Label htmlFor="avatar">Avatar Image</Label>
                  <Input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                    style={{ marginTop: tokens.spacing.xs }}
                  />
                  <p
                    style={{
                      fontSize: tokens.fontSize.xs,
                      color: tokens.colors.neutral[600],
                      marginTop: tokens.spacing.xs,
                    }}
                  >
                    Maximum file size: 5MB. Supported formats: JPG, PNG, WebP
                  </p>
                </div>

                {profile?.avatar_url && (
                  <div>
                    <Label>Current Avatar</Label>
                    <div
                      style={{
                        marginTop: tokens.spacing.xs,
                        width: '80px',
                        height: '80px',
                        borderRadius: tokens.borderRadius.full,
                        overflow: 'hidden',
                        border: `2px solid ${tokens.colors.neutral[200]}`,
                      }}
                    >
                      <img
                        src={profile.avatar_url}
                        alt="Current avatar"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={profileLoading || (!fullName.trim() && !avatarFile) || (fullName === profile?.full_name && !avatarFile)}
                  style={{
                    opacity: profileLoading || (!fullName.trim() && !avatarFile) || (fullName === profile?.full_name && !avatarFile) ? 0.5 : 1,
                  }}
                >
                  {profileLoading ? 'Updating...' : 'Update Profile'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Password Change */}
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>
              Update your password to keep your account secure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: tokens.spacing.lg,
                }}
              >
                <div>
                  <Label htmlFor="oldPassword">Current Password</Label>
                  <Input
                    id="oldPassword"
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter current password"
                    style={{ marginTop: tokens.spacing.xs }}
                  />
                </div>

                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 8 characters)"
                    style={{ marginTop: tokens.spacing.xs }}
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    style={{ marginTop: tokens.spacing.xs }}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={passwordLoading}
                  style={{
                    opacity: passwordLoading ? 0.5 : 1,
                  }}
                >
                  {passwordLoading ? 'Changing...' : 'Change Password'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Danger Zone - Account Deletion */}
        <Card
          style={{
            borderColor: tokens.colors.neutral[300],
          }}
        >
          <CardHeader>
            <CardTitle style={{ color: tokens.colors.accent[700] }}>
              Danger Zone
            </CardTitle>
            <CardDescription>
              Permanently delete your account and all associated data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAccountDelete}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: tokens.spacing.lg,
                }}
              >
                <div
                  style={{
                    padding: tokens.spacing.md,
                    backgroundColor: tokens.colors.neutral[50],
                    borderRadius: tokens.borderRadius.md,
                    border: `1px solid ${tokens.colors.neutral[200]}`,
                  }}
                >
                  <p
                    style={{
                      fontSize: tokens.fontSize.sm,
                      color: tokens.colors.neutral[800],
                    }}
                  >
                    <strong>Warning:</strong> This action cannot be undone. This will permanently delete your account, orders, and all associated data.
                  </p>
                </div>

                <div>
                  <Label htmlFor="deleteConfirm">
                    Type DELETE to confirm
                  </Label>
                  <Input
                    id="deleteConfirm"
                    type="text"
                    value={deleteConfirm}
                    onChange={(e) => setDeleteConfirm(e.target.value)}
                    placeholder="DELETE"
                    style={{ marginTop: tokens.spacing.xs }}
                  />
                </div>

                <div>
                  <Label htmlFor="deletePassword">
                    Enter your password to confirm
                  </Label>
                  <Input
                    id="deletePassword"
                    type="password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    placeholder="Enter your password"
                    style={{ marginTop: tokens.spacing.xs }}
                  />
                </div>

                <Button
                  type="submit"
                  variant="destructive"
                  disabled={deleteLoading}
                  style={{
                    opacity: deleteLoading ? 0.5 : 1,
                  }}
                >
                  {deleteLoading ? 'Deleting...' : 'Delete Account'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
