import { Component, Input, OnInit }             from '@angular/core';
import { User }                                 from '../models/user';
import { ActivatedRoute }                       from '@angular/router';
import { UserService }                          from '../user.service';
import { Response }                             from '@angular/http';
import { KawaModuleRetrievalService }		from '../kawaModule-retrieval.service';

@Component({
  templateUrl: './guard-page.component.html',
  styleUrls: ['./guard-page.component.css'],
})
export class GuardPageComponent implements OnInit {

  constructor( private route: ActivatedRoute, 
    private userService: UserService,
    private kawaModuleRetrievalService: KawaModuleRetrievalService) {}

  title: string ;
  isRegister: boolean;
  responseErrorMessage: string;
  isErrorServer: boolean;

  @Input() verification: string;
  @Input() user: User;

  ngOnInit(): void {
    this.route.data.subscribe( (data: any) => {
      this.title = data.title;
      if(data.register){
        this.isRegister = true ;
      } else {
        this.isRegister = false ;
      }
    });
    this.user = new User(" "," "," ");
    this.isErrorServer = false;
  }

  save(): void{
    console.log("saving user...");
    if(this.title === "Enregistrement" && this.user){
      console.log('sending');
      this.userService.createUser(this.user).subscribe( (data: Response) => {
          /* should retur name :
          call login with that name user*/
          this.isErrorServer = false;
          this.userService.loginUser(this.user);
        },
        (error: Response) => {
          console.log(error.json().error);
          this.isErrorServer = true;
          this.responseErrorMessage = error.json().error ;
        },
        () => { console.log('createUser completed'); }
      );
    }else if( this.title === "Connexion" && this.user){
      this.userService.loginUser(this.user);
    }
  }

  check(): void{
    this.kawaModuleRetrievalService.listOfModules.forEach( kawaModule => {
      console.log( 'module : '+kawaModule.name);
    });
  }
}

