import { Injectable }			from '@angular/core' ;
import { Http, Headers, Response }	from '@angular/http' ;
import { StorageService }		from './storage.service' ;
import { Observable }			from 'rxjs/Observable' ;
import { Serveur }			from './models/serveur';

@Injectable() 
export class ServeurService {

  private configurationUrl: string = "/api/server"; // get to get, post to set, delte to reset

  constructor( private http: Http, private storageService: StorageService) {}

  getConfiguration(): Observable<Response> {
    let token = this.storageService.retrieveToken();
    let headers = new Headers({ "Content-type":"Application/json" });
    headers.append("Authorization","bearer "+token);
    
    return this.http.get( this.configurationUrl, 
      { headers: headers });
  }

  setConfiguration(serv: Serveur): Observable<Response>{
    let token = this.storageService.retrieveToken();
    let headers = new Headers({ "Content-type":"Application/json" });
    headers.append("Authorization","bearer "+token);
    
    return this.http.post(this.configurationUrl, 
      { ip: serv.ip, identifier: serv.identifiant, port: serv.port },
      { headers: headers });
  }

  resetConfiguration(): Observable<Response> {
    let token = this.storageService.retrieveToken();
    let headers = new Headers({ "Content-type":"Application/json" });
    headers.append("Authorization","bearer " +token );
    
    return this.http.delete(this.configurationUrl, { headers: headers });

  }

}
