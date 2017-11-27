import { Component, OnInit } 			from '@angular/core';
import { KawaModuleRetrievalService }		from '../kawaModule-retrieval.service';
import { KawaModule }				from '../models/kawaModule';
import { Router }				from '@angular/router';
import { KawaSidenavService }			from '../kawa-sidenav.service';
import { KawaModuleStackService }		from '../kawa-kawaModule-stack.service';


@Component({
  templateUrl: './navigation-angular-logged.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationLoggedRouteComponent implements OnInit {

  constructor( private kawaModuleRetrievalService: KawaModuleRetrievalService ,
               private router: Router,
               private kawaSidenavService: KawaSidenavService,
               private kawaModuleStackService: KawaModuleStackService) {}
  
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

  toggleDrawer(): void{
    this.kawaSidenavService.sidenav.toggle();
  }

  switchModule(): void{
    this.kawaModuleStackService.switch();
  }

}


