import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BaseModule } from '../pages/base/base.module';

import { LoginPage } from '../pages/auth/login/login';
import { RegisterPage } from '../pages/auth/register/register';
import { ForumHomePage } from '../pages/dashboard/forum-home/forum-home';
import { ForumPostPage } from '../pages/dashboard/forum-post/forum-post';
import { ForumCommentPage } from '../pages/dashboard/forum-comment/forum-comment';
import { FireBaseService } from './firebase-service';

const appRoutes: Routes = [
    { path: '', component: LoginPage },
    { path: 'login', component: LoginPage },
    { path: 'register', component: RegisterPage },
    { path: 'forum-home', component: ForumHomePage },
]

@NgModule({
    declarations: [
        LoginPage,
        RegisterPage,
        ForumHomePage,
        ForumPostPage,
        ForumCommentPage
    ],
    imports: [
        BrowserModule,
        BaseModule,
        FormsModule,
        RouterModule.forChild( appRoutes )
    ],
    providers: [ FireBaseService ]
})

export class ForumModule {}