import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ShoutOutComponent } from './shout-out.component'

describe('ShoutOutComponent', () => {
  let component: ShoutOutComponent
  let fixture: ComponentFixture<ShoutOutComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShoutOutComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(ShoutOutComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
