/* eslint-disable prettier/prettier */
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'

export const { handlers, signIn, signOut, auth } = NextAuth({
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
    async signIn({ user, account }: any) {
      console.log('SignIn callback called with:', {
        user: user ? { id: (user as any).id, email: (user as any).email, name: (user as any).name } : null,
        provider: account?.provider,
      })

      if (account?.provider === 'google') {
        try {
          const idToken = (account as any)?.id_token || (account as any)?.access_token
          console.log('Google signin: idToken present?', !!idToken)

          const googleId = (account as any)?.providerAccountId || (user as any).id
          const baseBody = {
            email: (user as any).email,
            name: (user as any).name,
            googleId,
            imageUrl: (user as any).image,
          }

          // Try sending idToken first if present, otherwise send baseBody
          const tryWithIdToken = !!idToken

          const postToBackend = async (body: any) => {
            const res = await fetch(`${process.env.API_URL}/auth/google`, {
              method: 'POST',
              body: JSON.stringify(body),
              headers: { 'Content-Type': 'application/json' },
            })
            const userData = await res.json()
            return { res, userData }
          }

          let attempt = 0
          let result: any

          if (tryWithIdToken) {
            attempt++
            console.log('Posting Google signin with idToken (attempt 1)')
            result = await postToBackend({ ...baseBody, idToken })
            if (result.res.status === 401) {
              console.warn('Backend rejected idToken; retrying without idToken')
              attempt++
              result = await postToBackend(baseBody)
            }
          } else {
            attempt++
            console.log('Posting Google signin without idToken')
            result = await postToBackend(baseBody)
          }

          const { res: finalRes, userData } = result
          console.log('Google signin final response status:', finalRes.status, 'attempts:', attempt)

          if (!finalRes.ok) {
            if (finalRes.status === 409 && userData && userData.token) {
              ; (user as any).token = userData.token
              return true
            }

            if (finalRes.status === 409 && userData && userData.message) {
              console.log('Account exists, redirecting to sign-in:', userData.message)
              return `/signin?error=account_exists`
            }

            if (finalRes.status === 401) {
              console.warn('Google signin unauthorized from backend:', userData)
              return `/signin?error=oauth_unauthorized`
            }

            console.log('Google signin API response not ok:', finalRes.status, finalRes.statusText, userData)
            return `/signin?error=oauth_error`
          }

          if (userData && userData.token) {
            ; (user as any).token = userData.token
            return true
          }

          console.log('No valid token received from Google signin')
          return `/signin?error=oauth_no_token`
        } catch (error) {
          console.error('Error in Google signin callback:', error)
          return `/signin?error=oauth_exception`
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
      if (user && 'token' in (user as any)) {
        ; (token as any).accessToken = (user as any).token
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        ; (session as any).user = {
          ...(session as any).user,
          token: typeof (token as any).accessToken === 'string' ? (token as any).accessToken : '',
        }
      }
      return session
    },
  },
})
