import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import * as firebase from 'firebase';
import { FireBaseService } from '../../../../app/firebase-service';

import { USER_DATA } from '../../../../app/firebase-interface';
import { POST_DATA } from '../../../../app/firebase-interface';


@Component({
    selector: 'forum-edit-post-page',
    templateUrl: 'forum-edit-post.html'
})

export class ForumEditPostPage {
    
    post = <POST_DATA> {}
    loginData: USER_DATA = null;
    ref;
    paramData: string;

    constructor( private routes: ActivatedRoute, private fireService : FireBaseService) {
        this.ref = fireService._database().ref("category")
        this.isLoggedIn();
    }

    isLoggedIn(){
        this.loginData = JSON.parse(localStorage.getItem("login_data"));
        if ( !this.loginData ) return;
    }

    getParamData(){
        this.routes.params.subscribe( param=>{
            this.paramData = param['id']
        });
        console.info( "Retrieved Category ID: ", this.paramData )
        // this.category.ID = this.paramData
    }

    onClickAddPost(){
        let data = {
            ID: this.post.ID,
            name: this.post.name,
            title: this.post.title,
            content: this.post.description,
            author: this.loginData.name,
            category: this.paramData
        }        
        this.ref.child( "posts/" + this.post.ID )
            .set( data, re => {
                alert( "Category successfully created" );
                // this.router.navigate( ['/forum-home'] );
            } );
    }
}