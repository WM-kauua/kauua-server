/**
 * kawa auto generated app.module.ts :
 *   it gather the list of modules from the server, 
 *   and recreate the imports statements and declaration based on
 *   skel in ./server/scripts/skel.* files by injection, concatenation
 *
 */

import { BrowserModule }                 	        from '@angular/platform-browser';
import { BrowserAnimationsModule }              	from '@angular/platform-browser/animations';
import { NgModule }                           		from '@angular/core';
import { FormsModule, ReactiveFormsModule }             from '@angular/forms';
import { RouterModule, Routes }                		from '@angular/router';
import { HttpModule }                           	from '@angular/http';
import { CUSTOM_ELEMENTS_SCHEMA }               	from '@angular/core';
import { CommonModule }					from '@angular/common';
import { HttpClientModule }				from '@angular/common/http';

// material module :
import { FeatureMaterialModule }			from './features/feature-material-module.module';

import { KawaServerSidenavComponent }			from './side/kawaserver-sidenav.component';
import { AppComponent }                         	from './app.component';
import { RegisterComponent }                    	from './register.component';
import { NavbarComponent }                      	from './navbar.component';
import { sameAsValidatorDirective }             	from './same-as.directive';
import { onlyAlphaNumValidatorDirective }       	from './only-alphanum.directive';
import { UserService }                          	from './user.service';
import { StorageService }                       	from './storage.service';
import { InitComponent }                        	from './init.component';
//import { GuardPageComponent }                   	from './garde/guard-page.component';
import { GuardPageComponent }				from './garde/guard-page-injected.component';
//import { NavigationComponent }                  	from './navigation/navigation.component';
import { NavigationComponent }				from './navigation/navigation-angular.component';
import { HomeComponent }                        	from './home.component';
import { KawaModuleRetrievalService }			from './kawaModule-retrieval.service';
import { AreaLoggedRouteComponent }			from './garde/area-logged-route.component';
//import { NavigationLoggedRouteComponent }		from './navigation/navigation-logged-route.component';
import { NavigationLoggedRouteComponent }		from './navigation/navigation-angular-logged.component';
import { KawaSidenavService }				from './kawa-sidenav.service';
import { KawaSidenavMenuComponent }			from './kawa-sidenav-menu.component';
import { ListeDeCoursesModule }				from './kawaModules/liste_de_courses/liste-de-courses.module';
import { KawaModuleStackService }			from './kawa-kawaModule-stack.service';
import { ServeurService }				from './serveur.service' ;

import { PremierModule }  from './kawaModules/premierModule/PremierModule.module';
import { GestionUtilisateurModule }  from './kawaModules/gestionUtilisateur/GestionUtilisateurModule.module';
import { EspaceDeStockageModule }  from './kawaModules/espaceDeStockage/EspaceDeStockageModule.module';
const appRoutes: Routes=[
  { path: 'register',
    component: RegisterComponent,
    data: { title: 'Enregistrement', register: 'true' }
  },
  { path: 'login',
    component: RegisterComponent,
    data: { title: 'Connexion' }
  },
  { path: 'init',
    component: InitComponent,
    data: { title: 'Initialisation' }
  },
  { path: 'arealogin',
    component: GuardPageComponent,
    data: { title: 'Connexion' },
    outlet: 'kawaviewarea'
  },
  {
    path: 'arearegister',
    component: GuardPageComponent,
    data: { title: 'Enregistrement' },
    outlet: 'kawaviewarea'
  },
  {
    path: 'navigationstart',
    component: NavigationComponent,
    outlet: 'kawanavi',
  },
  /*{
    path: 'kawamenuload',
    component: KawaSidenavMenuComponent,
    outlet: 'kawamenu'
  },*/
  {
    path: 'kawamenuload',
    component: KawaServerSidenavComponent,
    outlet: 'kawamenu'
  },
  {
    path: 'navigationLoggedRoute',
    component: NavigationLoggedRouteComponent,
    outlet: 'kawanavi'
  },
  {
    path: 'areaLoggedRoute',
    component: AreaLoggedRouteComponent,
    outlet: 'kawaviewarea'
  },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      { path: 'innavigationstart',
        component: NavigationComponent,
        outlet: 'kawanavi'
      },
      { path: 'inarearegister',
        component: GuardPageComponent,
        data: { title: 'Enregistrement' },
        outlet: 'kawaviewarea'
      },
      { path: 'inarealogin',
        component: GuardPageComponent,
        data: { title: 'Connexion' },
        outlet: 'kawaviewarea'
      }
    ]
  },
  { path: '',
    redirectTo: 'navigationstart',
    pathMatch: 'full'
  }/*,
  { path: '**',
    redirectTo: 'login',
    pathMatch: 'full'
  },*/
]


@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    NavbarComponent,
    InitComponent,
    sameAsValidatorDirective,
    onlyAlphaNumValidatorDirective,
    GuardPageComponent,
    NavigationComponent,
    HomeComponent,
    AreaLoggedRouteComponent,
    NavigationLoggedRouteComponent,
    KawaSidenavMenuComponent,
    KawaServerSidenavComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes, { enableTracing: true, useHash: true }
    ),

PremierModule,
GestionUtilisateurModule,
EspaceDeStockageModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    HttpModule,
    FeatureMaterialModule
  ],
  providers: [UserService, StorageService, KawaModuleRetrievalService, KawaSidenavService, KawaModuleStackService, ServeurService],
  bootstrap: [AppComponent]
})
export class AppModule { }

