import { ThemeProvider } from '@/providers/themeProvider'
import NextAuthSessionProvider from '@/providers/sessionProvider'
import '@/styles/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ReactNode } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Gym Nation',
  description: 'Manage Your Workouts',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className={inter.className}>
        <NextAuthSessionProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <main>{children}</main>
          </ThemeProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  )
}
