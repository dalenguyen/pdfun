import { HttpClient } from "@angular/common/http";
import { Component, inject } from "@angular/core";

@Component({
  selector: "pdf-home",
  standalone: true,
  imports: [],
  template: ` <button (click)="test()">TEST</button> `,
})
export default class HomeComponent {
  private http = inject(HttpClient);
  test() {
    this.http.get("api/v1/hello").subscribe(console.log);
  }
}
