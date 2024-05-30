import { RouteMeta } from '@analogjs/router'
import { canActivate, redirectLoggedInTo } from '@angular/fire/auth-guard'
import { CanActivateFn } from '@angular/router'
import { LoginComponent } from '@pdfun/ui/auth'

const redirectLoggedInToHome = () => redirectLoggedInTo(['/'])

export const routeMeta: RouteMeta = {
  title: 'Login',
  // The type should be fix in the next version
  ...(canActivate(redirectLoggedInToHome) as unknown as CanActivateFn),
}
export default LoginComponent
