import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-white p-24 dark:bg-black">
      <Link href="/signin" className="rounded bg-black px-6 py-2 text-white">
        Login
      </Link>
    </div>
  )
}
