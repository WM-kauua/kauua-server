import { Component, OnInit }		from '@angular/core';
import { KawaModule }			from '../models/kawaModule';
import { KawaModuleRetrievalService }	from '../kawaModule-retrieval.service';
import { Router }			from '@angular/router';
import { KawaModuleStackService }	from '../kawa-kawaModule-stack.service';
import { KawaSidenavService }		from '../kawa-sidenav.service';


@Component({
  templateUrl: './kawaserver-sidenav.component.html',
  styleUrls: ['kawaserver-sidenav.component.css'],
})
export class KawaServerSidenavComponent implements OnInit {

  private listeDeModules: KawaModule[] = [];

  constructor( private kawaModuleRetrievalService: KawaModuleRetrievalService,  
               private router: Router, 
               private kawaModuleStackService: KawaModuleStackService,
               private kawaSidenavService: KawaSidenavService){}

  ngOnInit(): void{
    //this.listeDeModules = [];
    //this.listeDeModules.push(new KawaModule("je suis un module","je suis un navipath","je suis un view area navi path"));
    this.kawaModuleRetrievalService.list.subscribe( list => {
      this.listeDeModules = list;
    });
    this.kawaModuleRetrievalService.retrieve();
    
  }

  selectModule(i: number): void{
    this.kawaModuleStackService.save(this.listeDeModules[i].viewAreaPath,
                                     this.listeDeModules[i].naviPath,
                                     this.listeDeModules[i].sidePath || "");
    if(this.listeDeModules[i].sidePath === ""){
      this.router.navigate([ { outlets: { kawaviewarea: [this.listeDeModules[i].viewAreaPath ] ,
                                          kawanavi: [ this.listeDeModules[i].naviPath ] }} ]);
    } else {
      this.router.navigate([ { outlets: { kawaviewarea: [this.listeDeModules[i].viewAreaPath ] ,
                                          kawanavi: [ this.listeDeModules[i].naviPath ] ,
                                          kawamenu: [ this.listeDeModules[i].sidePath ] }}]);
    }
    this.kawaSidenavService.toggle();
    
  }

}
