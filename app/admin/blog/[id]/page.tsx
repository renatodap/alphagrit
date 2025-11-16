import { Metadata } from 'next'
import { redirect, notFound } from 'next/navigation'
import { Container, Section } from '@/components/ui/layout'
import { createClient } from '@/lib/supabase/server'
import { getBlogPostById } from '@/lib/actions/blog'
import BlogPostEditor from './editor'

export const metadata: Metadata = {
  title: 'Edit Blog Post - Admin',
}

interface BlogPostEditorPageProps {
  params: {
    id: string
  }
}

async function checkAdminAccess() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/signin')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/')
  }

  return user
}

export default async function BlogPostEditorPage({ params }: BlogPostEditorPageProps) {
  await checkAdminAccess()

  let post = null

  // If not "new", fetch the post
  if (params.id !== 'new') {
    const { post: fetchedPost, error } = await getBlogPostById(params.id)

    if (error || !fetchedPost) {
      notFound()
    }

    post = fetchedPost
  }

  return (
    <Container>
      <Section spacing="xl">
        <BlogPostEditor post={post} />
      </Section>
    </Container>
  )
}
