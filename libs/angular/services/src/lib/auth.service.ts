import { Injectable, inject, signal } from '@angular/core'
import { authState, idToken } from '@angular/fire/auth'
import { FIREBASE_AUTH } from '@pdfun/angular/firebase'
import { CookieService } from 'ngx-cookie-service'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private cookieService = inject(CookieService)
  private auth = inject(FIREBASE_AUTH)
  idToken$ = idToken(this.auth)

  isLoggedIn = signal(false)

  // https://firebase.google.com/docs/hosting/manage-cache
  private readonly SESSION_COOKIE_KEY = '__session'

  setIdToken(token: string) {
    this.cookieService.set(this.SESSION_COOKIE_KEY, token)
  }

  getIdToken() {
    return this.cookieService.get(this.SESSION_COOKIE_KEY)
  }

  constructor() {
    authState(this.auth).subscribe((user) => {
      if (user) {
        this.isLoggedIn.set(true)
      } else {
        this.isLoggedIn.set(false)
      }
    })

    this.idToken$.subscribe((token) => {
      if (token) {
        this.setIdToken(token)
      }
    })
  }
}
