import { isPlatformBrowser } from '@angular/common'
import { InjectionToken, PLATFORM_ID, inject } from '@angular/core'
import { Auth } from '@angular/fire/auth'

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
