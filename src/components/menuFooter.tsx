'use client'
import { cn } from '@/lib/utils'
import { HomeIcon, Dumbbell, UserCircle2 } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

function MenuFooter() {
  const pathname = usePathname()

  return (
    <>
      <Link
        href="/application"
        className={cn(
          'flex flex-col items-center justify-center gap-2 p-2 text-xs font-bold opacity-60 transition-colors hover:opacity-80',
          pathname === '/application' && 'opacity-100',
        )}
      >
        <HomeIcon />
        HOME
        <div
          className={cn(
            'invisible h-1 w-9 bg-white',
            pathname === '/application' && 'visible',
          )}
        />
      </Link>
      <Link
        href="/application/workout"
        className={cn(
          'flex flex-col items-center justify-center gap-2 p-2 text-xs font-bold opacity-60 transition-colors hover:opacity-80',
          pathname.startsWith('/application/workout') && 'opacity-100',
        )}
      >
        <Dumbbell />
        TREINOS
        <div
          className={cn(
            'invisible h-1 w-9 bg-white',

            pathname.startsWith('/application/workout') && 'visible',
          )}
        />
      </Link>
      <Link
        href="/application/profile"
        className={cn(
          'flex flex-col items-center justify-center gap-2 p-2 text-xs font-bold opacity-60 transition-colors hover:opacity-80',
          pathname === '/application/profile"' && 'opacity-100',
        )}
      >
        <UserCircle2 />
        PERFIL
        <div
          className={cn(
            'invisible h-1 w-9 bg-white',
            pathname === '/signin' && 'visible',
          )}
        />
      </Link>
    </>
  )
}

export default MenuFooter
