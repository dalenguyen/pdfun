import {
  NO_ERRORS_SCHEMA,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { GOOGLE_LOGIN } from '@pdfun/angular/firebase'
import { LoginComponent } from './login.component'

describe('LoginComponent', () => {
  let component: LoginComponent
  let fixture: ComponentFixture<LoginComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        {
          provide: GOOGLE_LOGIN,
          useValue: {},
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents()

    fixture = TestBed.createComponent(LoginComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
