import { provideFileRouter } from '@analogjs/router'
import { provideHttpClient, withFetch } from '@angular/common/http'
import {
  ApplicationConfig,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core'
import { initializeApp, provideFirebaseApp } from '@angular/fire/app'
import { getFirestore, provideFirestore } from '@angular/fire/firestore'
import { getStorage, provideStorage } from '@angular/fire/storage'
import { provideClientHydration } from '@angular/platform-browser'
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'

const firebaseConfig = JSON.parse(import.meta.env['VITE_FIREBASE_CONFIG'])
export const appConfig: ApplicationConfig = {
  providers: [
    provideFileRouter(),
    provideHttpClient(withFetch()),
    provideAnimationsAsync(),
    // If Angular hasn't start yet,
    // replay the events after hydration with withEventReplay()
    provideClientHydration(),
    // remove zone.js and only reply on
    // markForCheck, signal... for change detection
    // Sadly Angular/fire needs to be updated first
    provideExperimentalZonelessChangeDetection(),
    // Firebase
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideStorage(() => getStorage()),
    provideFirestore(() => getFirestore()),
  ],
}
