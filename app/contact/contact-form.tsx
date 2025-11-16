'use client'

import { useState } from 'react'
import { Stack } from '@/components/ui/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Text } from '@/components/ui/typography'
import { tokens } from '@/lib/design-tokens'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      // For MVP, we'll just show a success message
      // In production, this would send to an API endpoint or email service
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setStatus('success')
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      })
    } catch (error) {
      setStatus('error')
      setErrorMessage('Failed to send message. Please try WhatsApp or email instead.')
    }
  }

  if (status === 'success') {
    return (
      <Card>
        <CardContent>
          <Stack gap="lg" align="center">
            <div
              style={{
                fontSize: tokens.fontSize['5xl'],
              }}
            >
              ✅
            </div>
            <Text size="lg" align="center">
              Thank you for your message!
            </Text>
            <Text color="muted" align="center">
              We&apos;ll get back to you as soon as possible.
            </Text>
            <Button
              variant="outline"
              onClick={() => setStatus('idle')}
            >
              Send Another Message
            </Button>
          </Stack>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Stack gap="lg">
            {status === 'error' && (
              <div
                style={{
                  padding: tokens.spacing.md,
                  backgroundColor: tokens.colors.accent[500] + '20',
                  borderRadius: tokens.borderRadius.md,
                }}
              >
                <Text style={{ color: tokens.colors.accent[700] }}>
                  {errorMessage}
                </Text>
              </div>
            )}

            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Your name"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                type="text"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                placeholder="What is this about?"
                required
              />
            </div>

            <div>
              <Label htmlFor="message">Message *</Label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                placeholder="Tell us how we can help you..."
                rows={6}
                required
                style={{
                  width: '100%',
                  padding: tokens.spacing.sm,
                  borderRadius: tokens.borderRadius.md,
                  border: `1px solid ${tokens.colors.neutral[300]}`,
                  fontSize: tokens.fontSize.base,
                  fontFamily: 'inherit',
                  resize: 'vertical',
                }}
              />
            </div>

            <Button type="submit" disabled={status === 'loading'}>
              {status === 'loading' ? 'Sending...' : 'Send Message'}
            </Button>

            <Text size="sm" color="muted" align="center">
              For faster responses, message us on WhatsApp
            </Text>
          </Stack>
        </form>
      </CardContent>
    </Card>
  )
}
