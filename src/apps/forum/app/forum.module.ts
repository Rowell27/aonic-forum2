import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BaseModule } from '../pages/base/base.module';

import { LoginPage } from '../pages/auth/login/login';
import { RegisterPage } from '../pages/auth/register/register';
import { ForumHomePage } from '../pages/dashboard/forum-home/forum-home';
import { ForumCategoryPage } from '../pages/dashboard/forum-category/forum-category';
import { ForumEditCategoryPage } from '../pages/dashboard/forum-category/forum-edit-category/forum-edit-category';
import { ForumPostPage } from '../pages/dashboard/forum-post/forum-post';
import { ForumEditPostPage } from '../pages/dashboard/forum-post/forum-edit-post/forum-edit-post';
import { FireBaseService } from './firebase-service';

const appRoutes: Routes = [
    { path: '', component: LoginPage },
    { path: 'login', component: LoginPage },
    { path: 'register', component: RegisterPage },
    { path: 'forum-home', component: ForumHomePage },
    { path: 'forum-category/:id', component: ForumCategoryPage },    
    { path: 'forum-edit-category', component: ForumEditCategoryPage },     
    { path: 'forum-edit-category/:id', component: ForumEditCategoryPage },
    { path: 'forum-post', component: ForumPostPage },                          
    { path: 'forum-edit-post', component: ForumEditPostPage },  
    { path: 'forum-edit-post/:id', component: ForumEditPostPage }                          
                            
]

@NgModule({
    declarations: [
        LoginPage,
        RegisterPage,
        ForumHomePage,
        ForumCategoryPage,
        ForumEditCategoryPage,
        ForumPostPage,
        ForumEditPostPage
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