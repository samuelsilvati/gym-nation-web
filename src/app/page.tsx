import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Link href="/signin" className="rounded bg-black px-6 py-2 text-white">
        Login
      </Link>
    </main>
  )
}
