import { ComponentFixture, TestBed } from '@angular/core/testing'
import { BuyMeACoffeeComponent } from './buy-me-a-coffee.component'

describe('BuyMeACoffeeComponent', () => {
  let component: BuyMeACoffeeComponent
  let fixture: ComponentFixture<BuyMeACoffeeComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuyMeACoffeeComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(BuyMeACoffeeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
