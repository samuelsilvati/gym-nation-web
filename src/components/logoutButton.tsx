'use client'
import { signOut } from 'next-auth/react'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'

function LogoutButton() {
  const router = useRouter()
  async function logout() {
    await signOut({
      redirect: false,
    })

    router.replace('/signin')
  }
  return <Button onClick={logout}>Logout</Button>
}

export default LogoutButton
