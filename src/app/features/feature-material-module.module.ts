import { NgModule }			from '@angular/core';
import { MatSidenavModule }		from '@angular/material';
import { MatButtonModule }		from '@angular/material';
import { MatToolbarModule }		from '@angular/material';
import { MatCardModule }		from '@angular/material';
import { MatInputModule }		from '@angular/material';
import { MatStepperModule }		from '@angular/material';
import { MatIconModule }		from '@angular/material';
import { MatDialogModule }		from '@angular/material';
import { MatButtonToggleModule }	from '@angular/material';
import { MatGridListModule }		from '@angular/material';
import { MatProgressBarModule }		from '@angular/material';

@NgModule({
  exports: [ MatSidenavModule,
             MatButtonModule,
             MatCardModule,
             MatInputModule,
             MatStepperModule,
             MatIconModule,
             MatToolbarModule,
             MatDialogModule,
             MatButtonToggleModule,
             MatGridListModule,
             MatProgressBarModule  ]
})
export class FeatureMaterialModule {
  
}
