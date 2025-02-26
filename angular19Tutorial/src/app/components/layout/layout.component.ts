import { Component, inject } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive} from '@angular/router';



@Component({
  selector: 'app-layout',
  imports: [RouterOutlet,RouterLink, RouterLinkActive],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

  router = inject(Router)
  onLogout(){
    localStorage.removeItem("angular19User");
    this.router.navigateByUrl("login")
  }

  
  logout() {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');
  }

}
