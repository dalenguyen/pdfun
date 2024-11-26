import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { LOGOUT } from '@pdfun/angular/firebase'
import { MenuItem } from 'primeng/api'
import { AvatarModule } from 'primeng/avatar'
import { MenuModule } from 'primeng/menu'

@Component({
  selector: 'lib-profile',
  imports: [CommonModule, AvatarModule, MenuModule],
  template: `
    <p-menu #menu [model]="items" [popup]="true" />

    <p-avatar
      (click)="menu.toggle($event)"
      icon="pi pi-user"
      styleClass="cursor-pointer"
      [style]="{ 'background-color': '#dee9fc', color: '#1a2551' }"
      shape="circle"
    />
  `,
})
export class ProfileComponent {
  logout = inject(LOGOUT)

  items: MenuItem[] = [
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => {
        this.logout()
      },
    },
  ]
}
