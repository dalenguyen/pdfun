import { Injectable, inject } from '@angular/core'
import {
  collection,
  getCountFromServer,
  query,
  where,
} from '@angular/fire/firestore'
import { FIRESTORE } from '@pdfun/angular/firebase'
import type { TaskType } from '@pdfun/domain'
import { Collections } from '@pdfun/domain'

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private firestore = inject(FIRESTORE)
  protected readonly analyticsCollection = collection(
    this.firestore,
    Collections.analytics
  )

  async getCountByTaskType(type: TaskType) {
    const q = query(this.analyticsCollection, where('type', '==', type))
    const snapshot = await getCountFromServer(q)
    return snapshot.data().count
  }
}
