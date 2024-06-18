import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { FIREBASE_AUTH, FIRESTORE } from '@pdfun/angular/firebase'
import { AnalyticsService, AuthService } from '@pdfun/angular/services'
import { HeaderComponent } from './header.component'

describe('HeaderComponent', () => {
  let component: HeaderComponent
  let fixture: ComponentFixture<HeaderComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        provideRouter([]),
        AnalyticsService,
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
          provide: FIRESTORE,
          useValue: {},
        },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(HeaderComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
