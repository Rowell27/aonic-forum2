import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
//import * as firebase from 'firebase';
// import { database } from 'firebase';
import { FireBaseService } from '../../../app/firebase-service';

// import { CATEGORY_DATA } from '../../../app/firebase-interface';
import { USER_DATA } from '../../../app/firebase-interface';


@Component({
    selector: 'forum-home-page',
    templateUrl: 'forum-home.html'
})

export class ForumHomePage implements OnInit {       
    
    loginData;
    ref;
    list_category;

    constructor( private router: Router, private fireService : FireBaseService ) {
        this.ref = fireService._database().ref("category")
        this.checkLoggedIn();
    }
    
    ngOnInit(){
        this.getAllCategoryData();
    }

    checkLoggedIn(){
        this.fireService.isLoggedIn( re => {
            this.loginData = re;
        }, error => console.log( "Error: ", error ) );
    }

    getAllCategoryData(){
        this.ref.once('value').then( snapshot => {
                this.list_category = snapshot.val(); 
                console.log( "Category List ", this.categories );
            }, err => console.log( "Error getAllCategoryData ", err ));
    }

    get categories(){
        if ( this.list_category === void 0 ) return [];
        return Object.keys( this.list_category );
    }
    
    onClickViewCategory(id : string){       
        this.router.navigate( ['/forum-category', id] );
    }
} 