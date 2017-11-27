import { Injectable, EventEmitter } 		from '@angular/core';
import { MatDrawerToggleResult, MatSidenav }	from '@angular/material';

@Injectable()
export class KawaSidenavService{

  public _sidenav: MatSidenav ;

  get sidenav(): MatSidenav{
    return this._sidenav;
  }

  set sidenav(nav: MatSidenav){
    this._sidenav = nav;
  }

  check(){
    console.log("checking sidenav : "+this.sidenav);
  }

  /*setSideNav(sidenav: MdSidenav){
    this.sidenav = sidenav;
  }*/

  public toggle(isOpen?: boolean): Promise<void> {
    return this.sidenav.toggle(isOpen);
  }

}
