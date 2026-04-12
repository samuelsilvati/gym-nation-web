/* eslint-disable prettier/prettier */
import { NextAuthOptions } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'

export const nextAuthOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },

      async authorize(credentials) {
        try {
          console.log('Attempting to authorize with credentials:', {
            email: credentials?.email,
          })

          if (!credentials?.email || !credentials?.password) {
            console.log('Missing credentials')
            return null
          }

          const res = await fetch(`${process.env.API_URL}/signin`, {
            method: 'POST',
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
            headers: { 'Content-Type': 'application/json' },
          })

          console.log('API response status:', res.status)

          if (!res.ok) {
            console.log('API response not ok:', res.statusText)
            return null
          }

          const user = await res.json()
          console.log('User data received:', user)

          if (user && user.token) {
            const returnUser = {
              id: user.sub || user.id || user.email,
              email: user.email || credentials.email,
              name: user.name,
              token: user.token,
              sub: user.sub,
            }
            console.log('Returning user object:', returnUser)
            return returnUser
          }

          console.log('No valid user data received')
          return null
        } catch (error) {
          console.error('Error in authorize function:', error)
          return null
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/signin',
  },
  callbacks: {
    async signIn({ user, account }) {
      console.log('SignIn callback called with:', {
        user: user ? { id: user.id, email: user.email, name: user.name } : null,
        provider: account?.provider,
      })

      if (account?.provider === 'google') {
        try {
          const res = await fetch(`${process.env.API_URL}/auth/google`, {
            method: 'POST',
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              googleId: user.id,
              imageUrl: user.image,
              idToken: account?.id_token || account?.access_token,
            }),
            headers: { 'Content-Type': 'application/json' },
          })

          const userData = await res.json()

          if (!res.ok) {
            // Backend might return 409 when the user already exists but still provide a token
            if (res.status === 409 && userData && userData.token) {
              ; (user as any).token = userData.token
              return true
            }

            // If backend returns 409 (account exists) without a token,
            // redirect the user to the sign-in page with an informative query.
            if (res.status === 409 && userData && userData.message) {
              console.log('Account exists, redirecting to sign-in:', userData.message)
              return `/signin?error=account_exists`
            }

            console.log(
              'Google signin API response not ok:',
              res.status,
              res.statusText,
              userData,
            )
            return false
          }

          console.log('Google signin user data:', userData)

          if (userData && userData.token) {
            ; (user as any).token = userData.token
            return true
          }

          console.log('No valid token received from Google signin')
          return false
        } catch (error) {
          console.error('Error in Google signin callback:', error)
          return false
        }
      }

      if (account?.provider === 'credentials') {
        console.log('Credentials signin success')
        return true
      }

      console.log('Unknown provider or signin failed')
      return false
    },
    async jwt({ token, user }) {
      if (user && 'token' in user) {
        token.accessToken = user.token
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          token: typeof token.accessToken === 'string' ? token.accessToken : '',
        }
      }
      return session
    },
  },
}
