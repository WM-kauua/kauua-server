import { Injectable }			from '@angular/core';
import { KawaModule }			from './models/kawaModule';
import { Http, Headers, Response }	from '@angular/http';
import { StorageService }		from './storage.service';
import { EventEmitter }			from '@angular/core';

@Injectable()
export class KawaModuleRetrievalService{

  list: EventEmitter<KawaModule[]> = new EventEmitter();

  private retrievalUrl = '/api/modules';
  public listOfModules: KawaModule[] = [] ;

  constructor(	
	private http: Http,
	private storageService: StorageService) {}

  retrieve(): void{
    let token = this.storageService.retrieveToken();
    // let token = "im the token";
    let header = new Headers( { "Authorization":"bearer "+token } );
    this.listOfModules = [] ;
    this.http.get(this.retrievalUrl,
      { headers: header }
    ).subscribe( response => {
      if(response.status === 200){
        // display in the navi menu
        response.json().forEach( elem => {
          console.log(elem);
          this.listOfModules.push(new KawaModule(elem.name, 
            elem.navigationMenuLinkRouteName, 
            elem.viewAreaLinkRouteName,
            elem.sideRouteName || ""));
        });
        this.list.emit(this.listOfModules);
        console.log('emitted');
      } else {
        console.log(' status code : '+response.status);
      }
    });
  }
	
}

