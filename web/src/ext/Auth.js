import { logout as logoutGoogle, getProfilePromise } from './google'
import {
  logout as logoutLinkedIn,
  getProfile as getLIProfile
} from './linkedIn'

class Auth {
  constructor() {
    this.storeToken = this.storeToken.bind(this)
    this.isAuthenticated = this.isAuthenticated.bind(this)
    this.logout = this.logout.bind(this)
    this.getRestoredSession = this.getRestoredSession.bind(this)
  }

  storeToken(token) {
    localStorage.setItem('id', token.id)
    localStorage.setItem('expires_at', token.expiresAt.getTime())
    localStorage.setItem('provider', token.provider)
  }

  logout() {
    const cleanLocalStorage = () => {
      localStorage.removeItem('id')
      localStorage.removeItem('expires_at')
      localStorage.removeItem('provider')
    }
    const provider = localStorage.getItem('provider')
    switch (provider) {
      case 'google':
        return logoutGoogle().then(cleanLocalStorage)
      case 'linkedIn':
        return logoutLinkedIn().then(cleanLocalStorage)
      default:
    }
  }

  isAuthenticated() {
    let expiresAt = new Date(parseInt(localStorage.getItem('expires_at'), 10))
    return new Date().getTime() < expiresAt
  }

  getRestoredSession() {
    const provider = localStorage.getItem('provider')
    switch (provider) {
      case 'google':
        return getProfilePromise()
      case 'linkedIn':
        return getLIProfile()
      default:
    }
  }
}

export default new Auth()
