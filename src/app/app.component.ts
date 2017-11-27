//import { ContentChild }			from '@angular/core';
import { ViewChild }				from '@angular/core';
import { Component, OnInit, Output } 		from '@angular/core';
import { Router }				from '@angular/router';
//import { MatSidenavModule }			from '@angular/material';
import { KawaSidenavService }			from './kawa-sidenav.service';
import { MatSidenav }				from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  // @ContentChild(MatSidenavModule.MdSidenav) sideNavigation: Component;
  @ViewChild('sidenav') public sideNavi: MatSidenav;

  constructor( private router: Router, private kawaSidenavService: KawaSidenavService) {
  }

  ngOnInit(): void {
    //this.kawaSidenavService.setSideNav(this.sideNavi) ;
    this.kawaSidenavService.sidenav = this.sideNavi;
    this.kawaSidenavService.check();

    //this.router.navigate([ {outlets: {kawanavi: ['navigationstart']}} ]);
    this.router.navigate( [ { outlets: { kawanavi: ['navigationstart'] ,
                                         kawamenu: ['kawamenuload'] }} ]);
  }
}
