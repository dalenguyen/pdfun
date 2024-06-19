import { ComponentFixture, TestBed } from '@angular/core/testing'
import { AnalyticsService, AuthService } from '@pdfun/angular/services'
import { TaskType } from '@pdfun/domain'
import { ShoutOutComponent } from './shout-out.component'

describe('ShoutOutComponent', () => {
  let component: ShoutOutComponent
  let fixture: ComponentFixture<ShoutOutComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShoutOutComponent],
      providers: [
        {
          provide: AuthService,
          useValue: {
            isLoggedIn: vitest.fn(),
          },
        },
        {
          provide: AnalyticsService,
          useValue: {
            getCountByTaskType: vitest.fn(),
          },
        },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(ShoutOutComponent)
    component = fixture.componentInstance
    fixture.componentRef.setInput('type', TaskType.RESIZE)
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
