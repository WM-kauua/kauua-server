import { Injectable }		from '@angular/core';

@Injectable()
export class StorageService{

  private tokenKey: string = "user_token" ;

  storeToken(token: string){
    localStorage.setItem(this.tokenKey, token);
  }

  retrieveToken(): string{
    let storedToken: string = localStorage.getItem(this.tokenKey);
    return storedToken;
  }
}
