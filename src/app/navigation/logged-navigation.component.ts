import { Component } 	from '@angular/core';
import { Router }	from '@angular/router';

@Component({
  templateUrl: './navigation.component.html'
})
export class NavigationComponent{

  constructor( private router: Router) {}

  routeTo(routePath: string) :void{
    // this.router.navigate([ 'home' , { outlets: { kawaviewarea:  [routePath] }}]);

    // test premier module :
    this.router.navigate([{ outlets: { kawaviewarea: [routePath] }}]);
  }

}
