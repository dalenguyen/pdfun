import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { FIREBASE_AUTH } from '@pdfun/angular/firebase'
import { AuthService } from '@pdfun/angular/services'
import { DisclaimerComponent } from './disclaimer.component'

describe('DisclaimerComponent', () => {
  let component: DisclaimerComponent
  let fixture: ComponentFixture<DisclaimerComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisclaimerComponent],
      providers: [
        provideRouter([]),
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
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(DisclaimerComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
