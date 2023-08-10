import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      name: string
      sub: string
      token: string
    }
  }
}
