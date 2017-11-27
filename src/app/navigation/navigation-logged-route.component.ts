import { Component, OnInit } 			from '@angular/core';
import { KawaModuleRetrievalService }		from '../kawaModule-retrieval.service';
import { KawaModule }				from '../models/kawaModule';
import { Router }				from '@angular/router';

@Component({
  templateUrl: './navigation-logged-route.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationLoggedRouteComponent implements OnInit {

  constructor( private kawaModuleRetrievalService: KawaModuleRetrievalService ,
               private router: Router ) {}
  
  kawaModules: KawaModule[] ;


  ngOnInit(): void{
    this.kawaModules = this.kawaModuleRetrievalService.listOfModules;
  }

  routeTo(index: number): void{
    this.router.navigate([ { outlets: { kawaviewarea: [this.kawaModules[index].viewAreaPath] ,
                                        kawanavi: [this.kawaModules[index].naviPath] } }]);
  }

  deconnect(): void{
    this.router.navigate([ { outlets: { kawaviewarea: ['arealogin'] ,
                                        kawanavi: ['navigationstart'] } }]);
  }

  speroute(): void {
    console.log('check');
    this.router.navigate([ { outlets: { kawaviewarea: ['listeDeCoursesViewAreaPath'],
                                        kawanavi: ['listeDeCoursesNavi'] } }]);
  }

}


