import { Component } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { Firestore } from '@angular/fire/firestore'
import { Storage } from '@angular/fire/storage'
import { FIREBASE_AUTH } from '@pdfun/angular/firebase'
import { AuthService } from '@pdfun/angular/services'
import { PdfHandlerBase } from './pdf-handler-base.directive'

@Component({
  standalone: true,
  template: '',
})
class PDFHandlerComponent extends PdfHandlerBase {}

describe('PDFHandlerComponent', () => {
  let component: PDFHandlerComponent
  let fixture: ComponentFixture<PDFHandlerComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PDFHandlerComponent],
      providers: [
        {
          provide: AuthService,
          useValue: {
            isLoggedIn: vitest.fn(),
          },
        },
        {
          provide: FIREBASE_AUTH,
          useValue: {},
        },
        {
          provide: Storage,
          useValue: {},
        },
        {
          provide: Firestore,
          useValue: {},
        },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(PDFHandlerComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
