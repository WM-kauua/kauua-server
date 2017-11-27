import { Injectable }			from '@angular/core';
import { KawaModuleStackElement } 	from './models/kawa-module-stack-element';
import { Router }			from '@angular/router';

@Injectable()
export class KawaModuleStackService {

  
  public actual: number = 0;
  public stack: KawaModuleStackElement[] = [
    new KawaModuleStackElement( 'areaLoggedRoute', 'navigationLoggedRoute','kawamenuload' )
    ] ;

  constructor(private router: Router) {}

  switch(): void {
    console.log('switch called');
    if(this.stack.length!=1){
      this.router.navigate([ { outlets: { kawaviewarea: [this.stack[this.actual].mainRoute],
                                          kawanavi: [this.stack[this.actual].naviRoute],
                                          kawamenu: [this.stack[this.actual].sideRoute] } }]);
      if(this.actual==0){
        this.actual = 1;
      }else{
        this.actual = 0;
      }
    }
  }
    
  save( mainSurface: string, naviSurface: string, sideSurface: string): void{
    console.log('save called');
    this.actual = 0;
    this.stack[1]= new KawaModuleStackElement( mainSurface, naviSurface, sideSurface );
    this.stack.forEach( elem => {
      console.log('main area : '+elem.mainRoute+', navi area : '+elem.naviRoute+', side area : '+elem.sideRoute);
    });
  }

}
