export interface User {
  id: string
  username: string
  fullName: string
  email: string
  mfa: {
    enabled: boolean
    email: boolean
    totp: boolean
  }
}