import {
  NO_ERRORS_SCHEMA,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { LOGOUT } from '@pdfun/angular/firebase'
import { ProfileComponent } from './profile.component'

describe('ProfileComponent', () => {
  let component: ProfileComponent
  let fixture: ComponentFixture<ProfileComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileComponent],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        {
          provide: LOGOUT,
          useValue: {},
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents()

    fixture = TestBed.createComponent(ProfileComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
