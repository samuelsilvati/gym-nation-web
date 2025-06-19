import NextAuthSessionProvider from '@/providers/sessionProvider'
import { getServerSession } from 'next-auth'
import { ReactNode } from 'react'
import { nextAuthOptions } from '../../api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  HomeIcon,
  Dumbbell,
  UserCircle2,
  Library,
  FolderKanban,
} from 'lucide-react'
import SignOutButton from '@/components/signoutButton'
import { ModeToggle } from '@/components/themerModeToggle'
import MenuFooter from '@/components/menuFooter'
import decode from 'jwt-decode'

interface ApiToken {
  exp: number
  role?: string
}

export default async function PrivateLayout({
  children,
}: {
  children: ReactNode
}) {
  const session = await getServerSession(nextAuthOptions)
  let userRule = 'USER'

  if (!session) {
    return redirect('/signin')
  }

  if (session) {
    const ApiToken = session?.user.token
    try {
      const Token: ApiToken = decode(ApiToken as string)
      const currentTimestampInSeconds = Math.floor(Date.now() / 1000)
      if (currentTimestampInSeconds >= Token.exp) {
        return redirect('/signout')
      }
      if (Token.role && Token.role === 'ADMIN') {
        userRule = 'ADMIN'
      }
    } catch (error) {
      console.error(error)
      return redirect('/signout')
    }
  }

  const userName = session?.user.name
  const firstName = userName.split(' ')[0]
  return (
    <>
      <header className="fixed z-50 mx-auto w-screen border-b border-border bg-background/50 py-2 backdrop-blur-md">
        <div className="container flex items-center justify-between px-3 sm:px-8">
          <div className="text-lg">
            Olá <span className="font-bold">{firstName}</span>!
          </div>
          <div className="flex gap-3">
            <div className="hidden gap-3 sm:flex">
              <Link
                href="/application"
                className="flex items-center justify-center gap-1 p-2 text-xs font-bold"
              >
                <HomeIcon />
                HOME
              </Link>
              <Link
                href="/application/workout"
                className="flex items-center justify-center gap-2 p-2 text-xs font-bold"
              >
                <Dumbbell />
                TREINOS
              </Link>
              {userRule === 'ADMIN' && (
                <Link
                  href="/application/exercisesLibrary"
                  className="flex items-center justify-center gap-2 p-2 text-xs font-bold"
                >
                  <Library />
                  BIBLIOTECA DE EXERCICIOS
                </Link>
              )}
              {userRule === 'ADMIN' && (
                <Link
                  href="/application/manager"
                  className="flex items-center justify-center gap-2 p-2 text-xs font-bold"
                >
                  <FolderKanban />
                  GERENCIAR ALUNOS
                </Link>
              )}
              <Link
                href="/application/profile"
                className="flex items-center justify-center gap-2 p-2 text-xs font-bold"
              >
                <UserCircle2 />
                PERFIL
              </Link>
            </div>
            <ModeToggle />
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="bg-white text-black dark:bg-background dark:text-slate-200">
        <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
      </main>
      <footer className="itens-center fixed bottom-0 z-40 mx-auto flex w-screen justify-evenly gap-3 border-t border-border bg-background/50 pt-2 backdrop-blur-md sm:hidden">
        <MenuFooter />
      </footer>
    </>
  )
}
