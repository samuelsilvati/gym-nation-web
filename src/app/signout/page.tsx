'use client'
import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

function SignOut() {
  const router = useRouter()
  async function logout() {
    await signOut({
      redirect: false,
    })

    router.replace('/signin')
  }
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex max-w-xs flex-col gap-4 text-center">
        <p>Sua sessão expirou, faça login para continuar</p>
        <Button onClick={logout}>Login</Button>
      </div>
    </div>
  )
}

export default SignOut
