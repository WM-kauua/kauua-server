import { Component }		 	from '@angular/core';
import { ServeurService }		from '../serveur.service';
import { Serveur }			from '../models/serveur' ;
import { OnInit, OnDestroy }		from '@angular/core' ;
import { Subscription }			from 'rxjs/Subscription' ;
import { Response }			from '@angular/http' ;
import { User }				from '../models/user' ;
import { UserService }			from '../user.service';

@Component({
  templateUrl: './area-logged-route.component.html'
})
export class AreaLoggedRouteComponent implements OnInit, OnDestroy{

  public serveur: Serveur ;
  private resetInformation: Subscription; 
  private setInformation: Subscription;
  private getInformation: Subscription ;
  private userSubscription: Subscription ;
  private isAdmin: boolean ;
  
  constructor( private serveurService: ServeurService, private userService: UserService) {}

  ngOnInit(): void{
    // Get the information from the server :
    this.serveur = new Serveur("","");
    this.isAdmin = false ;
    this.getInformation = this.serveurService.getConfiguration().subscribe( (response: Response) => {
      console.log(response.json());
      if(response.status == 200 && response.json()){
        this.serveur.ip = response.json().ip ;
        this.serveur.identifiant = response.json().identifiant ;
        this.serveur.port = response.json().port ;
        console.log("receipt response, serveur: "+this.serveur.ip+", "+this.serveur.port+", "+this.serveur.identifiant);
        this.userSubscription = this.userService.isAdmin().subscribe( (response: Response) =>{
          if(response.status == 200){
            this.isAdmin = response.json();
          }
        }, ( error: Response) => {
          console.log("erreur :"+error.json());
        });
      }
    },
    (error: Response) => {
      console.log("error "+error.json);
    });
  }

  ngOnDestroy(): void{
    if(this.getInformation){
      this.getInformation.unsubscribe();
    }
    if(this.resetInformation){
      this.resetInformation.unsubscribe();
    }
    if(this.setInformation){
      this.setInformation.unsubscribe();
    }
    if(this.userSubscription){
      this.userSubscription.unsubscribe();
    }
  }

  setInfo(): void{
    if(this.serveur.ip && this.serveur.port && this.serveur.identifiant){
      this.setInformation = this.serveurService.setConfiguration(this.serveur).subscribe( (response: Response) => {
        if(response.status == 200){
          console.log("all clear");
        }
      },
      (error: Response) => {
        console.log("erreur : "+error.json());
      });
    }
  }

  resetInfo(): void{
    this.resetInformation = this.serveurService.resetConfiguration().subscribe( (response: Response) => {
      if(response.status == 200){
        console.log("all clear");
      }
    }, (error: Response ) => {
       console.log("erreur : "+error.json());
    });

  }

  
}
