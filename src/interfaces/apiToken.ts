export interface ApiToken {
  name: string
  sub: string
  iat: number
  exp: number
  role?: string
}
