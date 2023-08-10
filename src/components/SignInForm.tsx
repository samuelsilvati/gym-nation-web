'use client'
import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Loader2 } from 'lucide-react'
import { Toaster } from '@/components/ui/toaster'
import { useToast } from '@/components/ui/use-toast'
import { signIn } from 'next-auth/react'

const createUserformSchema = z.object({
  email: z.string().nonempty('E-mail obrigatório').email('E-mail inválido'),
  password: z.string().min(4, 'A senha deve ter pelo menos 4 caracteres'),
})

type CreateUserFormData = z.infer<typeof createUserformSchema>

function SignInForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserformSchema),
  })
  async function handleAuth(data: CreateUserFormData) {
    setIsLoading(true)

    const UserData = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    if (UserData?.error) {
      toast({
        title: 'Usuário ou senha incorretos',
        variant: 'destructive',
      })

      setIsLoading(false)
      return
    }

    router.replace('/application')
  }
  return (
    <form
      onSubmit={handleSubmit(handleAuth)}
      className="flex w-full max-w-xs flex-col gap-5 text-gray-800 md:max-w-sm"
    >
      <Toaster />
      <h1 className="text-center text-2xl font-bold text-gray-400">Login</h1>
      <div>
        <Input
          type="email"
          placeholder="E-mail"
          {...register('email')}
          disabled={isLoading}
        />
        {errors.email && (
          <span className="absolute text-sm text-red-300">
            {errors.email.message}{' '}
          </span>
        )}
      </div>
      <div>
        <Input
          type="password"
          placeholder="Senha"
          {...register('password')}
          disabled={isLoading}
        />

        {errors.password && (
          <span className="absolute text-sm text-red-300">
            {errors.password.message}{' '}
          </span>
        )}
      </div>

      <Button variant="outline" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </>
        ) : (
          'Login'
        )}
      </Button>

      <div>
        <Link
          href="/signin"
          className="text-gray-400 transition-colors hover:opacity-70"
        >
          Esqueci minha senha
        </Link>

        <Link
          href="/signin"
          className="float-right text-gray-400 transition-colors hover:opacity-70"
        >
          Criar conta
        </Link>
      </div>
    </form>
  )
}

export default SignInForm
