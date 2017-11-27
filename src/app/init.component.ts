import { Component, OnInit }		from '@angular/core';
import { ActivatedRoute }		from'@angular/router';

@Component({
  selector: 'kawa-init',
  templateUrl: './init.component.html'
})
export class InitComponent implements OnInit {
  title: string = "Init";

  constructor( private route: ActivatedRoute) {}

  ngOnInit(): void{
    this.route.data.subscribe( (data: any) => {
      this.title = data.title || this.title ;
    });
  }
}

