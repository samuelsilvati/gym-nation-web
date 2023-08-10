import { getServerSession } from 'next-auth'
import { nextAuthOptions } from '../../api/auth/[...nextauth]/route'
import LogoutButton from '@/components/logoutButton'

export default async function Home() {
  const session = await getServerSession(nextAuthOptions)

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>Olá {session?.user.name}, Welcome!</div>

      <LogoutButton />
    </div>
  )
}
