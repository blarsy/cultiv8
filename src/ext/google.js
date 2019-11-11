/* global gapi */
import Promise from 'promise'
import { error } from '../Events'
import { createElement } from './Dom'
import { GOOGLE_API_ID } from '../config'

const API_ID = GOOGLE_API_ID
const SCOPE = 'profile email'

const logout = () => {
  const auth2 = gapi.auth2.getAuthInstance()
  return auth2.signOut()
}

const getProfile = () => {
  const auth2 = gapi.auth2.getAuthInstance()
  if (auth2.isSignedIn.get()) {
    const profile = auth2.currentUser.get().getBasicProfile()
    return {
      profile: {
        id: profile.getId(),
        firstName: profile.getGivenName(),
        lastName: profile.getFamilyName(),
        picture: profile.getImageUrl(),
        email: profile.getEmail()
      },
      token: {
        expiresAt: new Date(Number(new Date()) + 30 * 60 * 1000),
        id: profile.getId(),
        provider: 'google'
      }
    }
  }
}

window.gapiPromise = new Promise((resolve, reject) => {
  window.gapiLoaded = () => {
    gapi.load('auth2', () => {
      gapi.auth2
        .init({
          client_id: API_ID
        })
        .then(() => resolve())
    })
  }
})

const getProfilePromise = () => {
  return new Promise((resolve, reject) => {
    window.gapiPromise.then(() => {
      const profile = getProfile()
      resolve(profile())
    })
  })
}

const loadSDK = () => {
  createElement(document, 'script', 'google-sdk', {
    src: `https://apis.google.com/js/platform.js?onload=gapiLoaded`,
    async: true,
    defer: true
  })
  createElement(document, 'meta', 'meta-google-sdk', {
    name: 'google-signin-client_id',
    content: API_ID
  })
  createElement(document, 'meta', 'meta-google-sdk', {
    name: 'google-signin-scope',
    content: SCOPE
  })
}

const setupSignin = (id, loggedIn) => {
  window.gapiPromise.then(() => {
    gapi.signin2.render(id, {
      scope: SCOPE,
      onsuccess: res => {
        const profile = getProfile()
        loggedIn(profile)
      },
      onfailure: err => error(err)
    })
  })
}

loadSDK()

export { setupSignin, logout, getProfilePromise }
