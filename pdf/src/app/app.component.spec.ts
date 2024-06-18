import { TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { FIREBASE_AUTH } from '@pdfun/angular/firebase'
import { AuthService } from '@pdfun/angular/services'
import { AppComponent } from './app.component'

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {},
        },
        {
          provide: FIREBASE_AUTH,
          useValue: {},
        },
      ],
    }).compileComponents()
  })

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent)
    const app = fixture.componentInstance
    expect(app).toBeTruthy()
  })
})
