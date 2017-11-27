import { Injectable }			from '@angular/core';
import { User }				from './models/user';
import { Http, Headers, Response } 	from '@angular/http';
import { StorageService }		from './storage.service';
import { Router }			from '@angular/router';
import { Observable }			from 'rxjs/Observable';
import { KawaModuleRetrievalService}	from './kawaModule-retrieval.service';


@Injectable()
export class UserService{

  private createUserUrl = '/api/user';
  private loginUserUrl = '/api/login';
  private createHeaders = new Headers( {"Content-type":"application/json"} );

  constructor(
    private http :Http, 
    private storageService: StorageService,
    private router: Router,
    private moduleRetrievalService: KawaModuleRetrievalService ){}

  createUser(user: User): Observable<Response> {
    // let createHeaders = new Headers( {"Content-type":"application/json" } );
    
    return this.http.post(this.createUserUrl,
      { name: user.name, 
        password: user.password,
      },
      { headers: this.createHeaders },
    );
    /*.subscribe((next) => { console.log( next.toString() ); },
               (error) => { console.log( error.toString() ); },
               () => { console.log(' completed'); });*/
  }

  loginUser(user: User): void {
    this.http.post(this.loginUserUrl,
      { name: user.name,
        password: user.password,
      },
      { headers: this.createHeaders },
    )
    .subscribe( (response) => { 
      console.log(response.json()); 
      this.storageService.storeToken(response.json().token);
      console.log(this.storageService.retrieveToken());
      this.moduleRetrievalService.retrieve();
      //this.router.navigate(['init']);
      this.router.navigate([ { outlets: { kawanavi: ['navigationLoggedRoute'] ,
                                          kawaviewarea: ['areaLoggedRoute'] } }]);
      },
               (error) => { console.log(''+error); },
               () => { console.log('completed'); });
  }

  isAdmin(): Observable<Response>{
    let token = this.storageService.retrieveToken();
    let headers = new Headers({"Authorization":"bearer "+token});
    let getPrivilegeUrl = "/api/privileges" ;
    return this.http.get(getPrivilegeUrl, { headers : headers });
  }

  

}
