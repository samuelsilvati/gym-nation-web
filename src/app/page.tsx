import { ModeToggle } from '@/components/themerModeToggle'
import Link from 'next/link'

export default function Home() {
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
