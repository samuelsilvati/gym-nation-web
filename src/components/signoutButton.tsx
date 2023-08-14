'use client'
import { signOut } from 'next-auth/react'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

function SignOutButton() {
  const router = useRouter()
  async function logout() {
    await signOut({
      redirect: false,
    })

    router.replace('/signin')
  }
  return (
    <Button variant={'outline'} onClick={logout} title="Sair" aria-label="Sair">
      <LogOut />
    </Button>
  )
}

export default SignOutButton
