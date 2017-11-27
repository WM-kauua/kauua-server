import { Component, OnInit } 				from '@angular/core';
import { Router }					from '@angular/router';
import { KawaModuleRetrievalService }			from '../kawaModule-retrieval.service';
import { KawaModule }					from '../models/kawaModule';
import { KawaSidenavService }				from '../kawa-sidenav.service';

@Component({
  templateUrl: './navigation.component.html',
  styleUrls: [ './navigation.component.css' ],
})
export class NavigationComponent implements OnInit{

  kawaModules: KawaModule[];

  constructor( private router: Router, 
    private kawaRetrievalService: KawaModuleRetrievalService,
    private kawaSidenavService: KawaSidenavService ) {}

  routeTo(routePath: string) :void{
    // this.router.navigate([ 'home' , { outlets: { kawaviewarea:  [routePath] }}]);

    // test premier module :
    this.router.navigate([{ outlets: { kawaviewarea: [routePath] }}]);
  }

  ngOnInit(): void{
  // link kawaModules to the array of modules inside retrieval service
    this.kawaModules = this.kawaRetrievalService.listOfModules;
  /*  this.kawaRetrievalService.list.subscribe( data => {
      this.kawaModules = data;
    });*/
  }

  toggleDrawer(): void{
    //this.kawaSidenavService.toggle();
    this.kawaSidenavService.sidenav.toggle();
  }

}
