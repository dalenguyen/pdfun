import { provideFileRouter } from '@analogjs/router'
import { provideHttpClient, withFetch } from '@angular/common/http'
import { ApplicationConfig } from '@angular/core'
import { initializeApp, provideFirebaseApp } from '@angular/fire/app'
import { getFirestore, provideFirestore } from '@angular/fire/firestore'
import { getStorage, provideStorage } from '@angular/fire/storage'
import { provideClientHydration } from '@angular/platform-browser'
import { provideAnimations } from '@angular/platform-browser/animations'

const firebaseConfig = JSON.parse(import.meta.env['VITE_FIREBASE_CONFIG'])
export const appConfig: ApplicationConfig = {
  providers: [
    provideFileRouter(),
    provideClientHydration(),
    provideHttpClient(withFetch()),
    provideAnimations(),

    // Firebase
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideStorage(() => getStorage()),
    provideFirestore(() => getFirestore()),
  ],
}
