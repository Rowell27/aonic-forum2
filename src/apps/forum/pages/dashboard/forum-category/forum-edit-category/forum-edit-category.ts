import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FireBaseService } from '../../../../app/firebase-service';
import { USER_DATA } from '../../../../app/firebase-interface';
import { CATEGORY_DATA } from '../../../../app/firebase-interface';

@Component({
    selector: 'forum-edit-category-page',
    templateUrl: 'forum-edit-category.html'
})

export class ForumEditCategoryPage {
    
    category = <CATEGORY_DATA> {}
    username: string;
    key: string;
    ref;
    
    constructor( private router: Router, private routes: ActivatedRoute, private fireService : FireBaseService) { 
        this.ref = fireService._database().ref("category")

        this.checkLoggedIn();
        this.getCategoryData();
    }

    getParamData(){
        this.routes.params.subscribe( param=>{
            this.category.ID  = param['id']
        });
    }

    checkLoggedIn(){
        this.fireService.isLoggedIn( re => {
            this.key = re;
        }, error => console.info( "Alert! ", error ) );
    }

    getCategoryData(){
        if( !this.category.ID ) return;
        this.fireService.get( this.category.ID, "category", data => {
            this.category = data;
        }, error => console.log( "Unable to get category data.", error ) );
        // this.ref
        //     .child( this.category.ID )
        //     .once('value').then( snapshot => {
        //         this.category = snapshot.val(); 
        //         console.log( "Retrieved Category Data", this.category );
        //     }, err => console.log( "Error getCategoryData ", err ));
    }

    clearAll(){
        this.category = null;
    }

    onClickAddCategory(){
        this.fireService.get( this.key, "users", data => {
            this.username = data;
        }, error => console.log( "Unable to get user data: ", error ) );
        let data = {
            ID: this.category.ID,
            name: this.category.name,
            title: this.category.title,
            description: this.category.description,
            author: this.username
        }    
        this.fireService.create( data, data.ID, "category", () => {
            alert( "Category successfully created" );
            this.router.navigate( ['/forum-home'] );
        }, error => console.log( "Unable to create category. Error ", error ) );    
        // this.ref.child( this.category.ID )
        //     .set( data, re => {
        //         alert( "Category successfully created" );
        //         this.router.navigate( ['/forum-home'] );
        //     } );
    }
    
    onClickUpdateCategory(){
        this.fireService.update( this.category, this.category.ID, "category", () => {
            alert( "Category updated!" );
        }, error => console.log( "Unable to update category. Error ", error ) );
        // this.ref.child( this.category.ID )
        //     .update( this.category )
        //     .then ( re => {
        //             alert( "Category successfully updated" );
        //             this.clearAll();
        //             this.router.navigate( ['/forum-home'] );
        //             }, err => console.log("Error Update. ", err) );
    }

    onClickBackToCategory(){
        console.log( "Item to pass (Forum Category) : ", this.category.ID )
        this.router.navigate( ['/forum-category', this.category.ID] );
    }

}