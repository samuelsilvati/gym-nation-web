'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { api } from '@/lib/api'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useSession } from 'next-auth/react'
import React from 'react'
import { useToast } from '@/components/ui/use-toast'
import { Toaster } from '@/components/ui/toaster'

const formSchema = z.object({
  name: z.string().min(3, {
    message: 'O nome de usuário deve ter pelo menos 3 caracteres.',
  }),
})

export default function ProfileForm() {
  const { data: session } = useSession()
  const [loading, setLoading] = React.useState(false)
  const { toast } = useToast()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: session?.user.name,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true)
      await api.put('/user', values, {
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      })
    } catch (error) {
      console.log(error)
      toast({
        title: 'Não foi possível atualizar nome de usuário',
        variant: 'destructive',
      })
      setLoading(false)
    }
  }

  return (
    <div className=" flex min-h-screen">
      <div className="container mt-16 max-w-2xl px-8 pb-28 md:px-8 md:pb-0">
        <div className="mt-5"></div>
        <Toaster />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormDescription>
                    Este é o seu nome de exibição público.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading}>
              Salvar
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
