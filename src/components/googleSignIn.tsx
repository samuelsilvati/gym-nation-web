'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'

function GoogleSignIn() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  async function handleAuth() {
    setIsLoading(true)

    const UserData = await signIn('google', {
      callbackUrl: '/application',
    })

    if (UserData?.error) {
      toast({
        title: 'Erro ao fazer login',
        variant: 'destructive',
      })

      setIsLoading(false)
      return
    }

    router.replace('/application')
  }
  return (
    <div className="flex w-full max-w-xs flex-col gap-6 md:max-w-sm">
      <h1 className="text-center text-2xl font-bold">Login</h1>
      <Button
        variant="outline"
        onClick={() => handleAuth()}
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="mr-2 animate-spin" size={16} />
        ) : (
          <>
            <Image
              src="/img/google-logo.svg"
              alt="Google Logo"
              className="mx-2"
              width={24}
              height={24}
            />
            Sign in with Google
          </>
        )}
      </Button>
      <div>
        Ao continuar você concorda com os nossos{' '}
        <Link
          href="/terms-of-service"
          className="text-gray-400 transition-colors hover:opacity-70"
        >
          Termos de uso e Política de privacidade
        </Link>
      </div>
    </div>
  )
}

export default GoogleSignIn
