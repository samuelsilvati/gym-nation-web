import { ModeToggle } from '@/components/themerModeToggle'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { nextAuthOptions } from './api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'

export default async function Home() {
  const session = await getServerSession(nextAuthOptions)
  if (session) {
    redirect('/application')
  }
  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-background p-24">
      <Link
        href="/signin"
        className="rounded bg-black px-6 py-2 text-white dark:bg-white dark:text-black"
      >
        Login
      </Link>
      <ModeToggle />
    </div>
  )
}
