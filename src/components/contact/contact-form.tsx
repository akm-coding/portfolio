'use client'

import { useActionState, useEffect, useRef } from 'react'
import { submitContactForm } from '@/actions/contact'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactForm, null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.success) {
      toast.success('Message sent!')
      formRef.current?.reset()
    }
    if (state?.error) {
      toast.error(state.error)
    }
  }, [state])

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          required
          placeholder="Your name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          placeholder="your@email.com"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Your message..."
        />
      </div>
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? (
          'Sending...'
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Send Message
          </>
        )}
      </Button>
    </form>
  )
}
