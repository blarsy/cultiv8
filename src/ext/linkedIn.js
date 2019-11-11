import Promise from 'promise'
import { createElement } from './Dom'
import { LINKEDIN_API_ID } from '../config'

window.liApiPromise = new Promise((resolve, reject) => {
  window.liApiLoaded = () => {
    resolve()
  }
})

const getProfile = () => {
  return new Promise((resolve, reject) => {
    window.liApiPromise.then(() => {
      window.IN.API
        .Raw(`/people/~:(id,picture-url,first-name,last-name,email-address)`)
        .result(r => {
          resolve({
            profile: {
              id: r.id,
              firstName: r.firstName,
              lastName: r.lastName,
              picture: r.pictureUrl,
              email: r.emailAddress
            },
            token: {
              expiresAt: new Date(Number(new Date()) + 30 * 60 * 1000),
              id: r.id,
              provider: 'linkedIn'
            }
          })
        })
    })
  })
}

const authorize = () => {
  return new Promise((resolve, reject) => {
    window.liApiPromise.then(() => {
      window.IN.User.authorize(() => {
        getProfile().then(res => resolve(res))
      })
    })
  })
}

const logout = () => {
  return new Promise((resolve, reject) => {
    window.IN.User.logout(() => resolve())
  })
}

const loadSDK = clientId => {
  createElement(document, 'script', 'linkedin-jssdk', {
    src: `https://platform.linkedin.com/in.js`,
    text: `api_key: ${clientId}
    onLoad: liApiLoaded
    authorize: true`,
    async: true,
    defer: true
  })
}

loadSDK(LINKEDIN_API_ID)

export { authorize, logout, getProfile }
