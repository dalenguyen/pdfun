import { InjectionToken, inject } from '@angular/core'
import {
  Auth,
  GoogleAuthProvider,
  getAdditionalUserInfo,
  signInWithPopup,
  signOut,
} from '@angular/fire/auth'
import { doc, setDoc } from '@angular/fire/firestore'
import { FIRESTORE } from './firestore.tokens'

export const FIREBASE_AUTH = new InjectionToken<Auth>('firebase-auth', {
  providedIn: 'root',
  factory() {
    // This for SSR only
    // const platformID = inject(PLATFORM_ID)
    // if (isPlatformBrowser(platformID)) {
    //   return inject(Auth)
    // }

    // Apply for browser
    return inject(Auth)
  },
})

export const GOOGLE_LOGIN = new InjectionToken('LOGIN', {
  providedIn: 'root',
  factory() {
    const auth = inject(FIREBASE_AUTH)
    const firestore = inject(FIRESTORE)

    return () => {
      if (auth) {
        return signInWithPopup(auth, new GoogleAuthProvider()).then(
          async (result) => {
            const metadata = getAdditionalUserInfo(result)

            if (metadata?.isNewUser) {
              // TODO: move `users` to domain lib
              // TODO: move firestore logic to firestore.tokens.ts
              const docRef = doc(firestore, 'users', result.user.uid)
              await setDoc(
                docRef,
                {
                  email: result.user.email,
                  displayName: result.user.displayName,
                  photoURL: result.user.photoURL,
                  uid: result.user.uid,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  providerId: result.providerId,
                },
                {
                  merge: true,
                }
              )
            }
          }
        )
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
        return signOut(auth)
      }
      throw `Can't run Auth on Server`
    }
  },
})
