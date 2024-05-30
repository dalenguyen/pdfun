import { Injectable, inject } from '@angular/core'
import { IdTokenResult, authState, idToken } from '@angular/fire/auth'
import { FIREBASE_AUTH } from '@pdfun/angular/firebase'
import { CookieService } from 'ngx-cookie-service'
import { firstValueFrom } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private cookieService = inject(CookieService)
  private auth = inject(FIREBASE_AUTH)
  idToken$ = idToken(this.auth)

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
      console.log(user)
    })
  }

  async getUserInfo(): Promise<IdTokenResult | null> {
    const token = this.getIdToken()

    console.log({ token })

    return firstValueFrom(this.idToken$)
  }

  async isLoggedIn(): Promise<boolean> {
    return !!(await this.getUserInfo())
  }
}
