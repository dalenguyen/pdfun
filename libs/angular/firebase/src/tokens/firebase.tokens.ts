import { isPlatformBrowser } from '@angular/common'
import { InjectionToken, PLATFORM_ID, inject } from '@angular/core'
import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from '@angular/fire/auth'

export const FIREBASE_AUTH = new InjectionToken<Auth | null>('firebase-auth', {
  providedIn: 'root',
  factory() {
    const platformID = inject(PLATFORM_ID)
    if (isPlatformBrowser(platformID)) {
      return inject(Auth)
    }
    return null
  },
})

export const GOOGLE_LOGIN = new InjectionToken('LOGIN', {
  providedIn: 'root',
  factory() {
    const auth = inject(FIREBASE_AUTH)
    return () => {
      if (auth) {
        return signInWithPopup(auth, new GoogleAuthProvider())
      }
      throw `Can't run Auth on Server`
    }
  },
})

export const LOGOUT = new InjectionToken('LOGOUT', {
  providedIn: 'root',
  factory() {
    const auth = inject(FIREBASE_AUTH)
    return () => {
      if (auth) {
        signOut(auth)
        return
      }
      throw `Can't run Auth on Server`
    }
  },
})
