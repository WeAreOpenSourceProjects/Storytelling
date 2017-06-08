import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// APP COMPONENTS
import { Auth } from './users';
import { HomeComponent } from "./home";
import { BadRequestPageComponent, NotFoundPageComponent } from "./core";

const appRoutes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'user', loadChildren: 'app/users/users.module#UsersModule' },
    { path: 'slides', loadChildren: 'app/slides/slides.module#SlidesModule' },
    // otherwise redirect to home
    { path: 'bad-request', component: BadRequestPageComponent, data: { title: 'Bad-request' } },
    { path: 'not-found', component: NotFoundPageComponent, data: { title: 'Not-Found' } },
    { path: '**', redirectTo: 'not-found' }
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes, { useHash: true })
    ],
    exports: [
        RouterModule
    ],
    providers: [
        Auth
    ]
})
export class AppRoutingModule { }
