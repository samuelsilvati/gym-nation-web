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
import { api } from '@/lib/api'

const createUserformSchema = z.object({
  name: z
    .string()
    .nonempty('Nome obrigatório')
    .min(4, 'A senha deve ter pelo menos 4 caracteres'),
  email: z.string().nonempty('E-mail obrigatório').email('E-mail inválido'),
  password: z.string().min(4, 'A senha deve ter pelo menos 4 caracteres'),
})

type CreateUserFormData = z.infer<typeof createUserformSchema>

function SignUpForm() {
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

    api
      .post('/signup', data)
      .then(() => {
        toast({
          title: 'Conta criada, faça login para continuar!',
          variant: 'default',
        })
        router.push('/signin')
      })
      .catch((err) => {
        setIsLoading(false)

        toast({
          title: `${err.response.data.message}`,
          variant: 'destructive',
        })
      })
  }
  return (
    <form
      onSubmit={handleSubmit(handleAuth)}
      className="flex w-full max-w-xs flex-col gap-6 md:max-w-sm"
    >
      <Toaster />
      <h1 className="text-center text-2xl font-bold">Fazer Cadastro</h1>
      <p className="text-center text-gray-400">
        Entre com seus dados abaixo para criar sua conta
      </p>
      <div>
        <Input
          type="text"
          placeholder="Nome Completo"
          {...register('name')}
          disabled={isLoading}
        />

        {errors.name && (
          <span className="absolute text-xs text-red-400">
            {errors.name.message}{' '}
          </span>
        )}
      </div>
      <div>
        <Input
          type="email"
          placeholder="E-mail"
          {...register('email')}
          disabled={isLoading}
        />
        {errors.email && (
          <span className="absolute text-xs text-red-400">
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
          <span className="absolute text-xs text-red-400">
            {errors.password.message}{' '}
          </span>
        )}
      </div>

      <Button variant="default" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Aguarde
          </>
        ) : (
          'Criar'
        )}
      </Button>

      <div>
        <span className="text-gray-400">Já tem cadastro? </span>
        <Link
          href="/signin"
          className="text-gray-400 underline transition-all hover:opacity-70"
        >
          Fazer Login
        </Link>
      </div>
    </form>
  )
}

export default SignUpForm
