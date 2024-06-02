import { InjectionToken, inject } from '@angular/core'
import { Firestore } from '@angular/fire/firestore'

export const FIRESTORE = new InjectionToken<Firestore>('firestore', {
  providedIn: 'root',
  factory() {
    return inject(Firestore)
  },
})
