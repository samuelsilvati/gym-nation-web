'use client'
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
  return logout()
}

export default SignOut
