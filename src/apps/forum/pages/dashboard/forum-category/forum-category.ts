import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
// import * as firebase from 'firebase';
import { FireBaseService } from '../../../app/firebase-service';

import { USER_DATA } from '../../../app/firebase-interface';

import { CATEGORY_DATA } from '../../../app/firebase-interface';


@Component({
    selector: 'forum-category-page',
    templateUrl: 'forum-category.html'
})

export class ForumCategoryPage {

    category = <CATEGORY_DATA> {}
    key: string;
    ref;
    category_ID: string;

    constructor( private routes: ActivatedRoute, 
                 private router: Router, 
                 private fireService : FireBaseService ) {
                     
        this.ref = fireService._database().ref("category")

        this.checkLoggedIn();
        this.getCategoryData();
    }

    getParamData(){
        this.routes.params.subscribe( param=>{
            this.category.ID = param['id']
        });
    }

    checkLoggedIn(){
        this.fireService.isLoggedIn( re => {
            this.key = re;
        }, error => console.info( "Alert! ", error ) );
    }

    getCategoryData(){
        this.ref
            .child( this.category.ID )
            .once('value').then( snapshot => {
                this.category = snapshot.val(); 
                console.log( "User Data", this.category );
            }, err => console.log( "Error getUserData ", err ));
    }

    onClickDeleteCategory(){
        this.ref
            .child( this.category.ID )
            .remove( re => {
                alert( "Category successfully deleted." );
                this.router.navigate( ['/forum-home'] );
            });
    }

    onClickViewEditCategory(){
        console.log( "Item to pass (Forum Edit Category) : ", this.category.ID )
        this.router.navigate( ['/forum-edit-category', this.category.ID] );
    }

    onClickViewAddPost(){
        console.log( "Item to pass (Forum Add Post) : ", this.category.ID )
        this.router.navigate( ['/forum-edit-post', this.category.ID] );
    }

}