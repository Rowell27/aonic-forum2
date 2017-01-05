import { Component } from '@angular/core';

@Component({
    selector: 'forum-post-page',
    templateUrl: 'forum-post.html'
})

export class ForumPostPage {
    

    // constructor() {
    //     this.isLoggedIn();
    // }

    // ngOnInit(){
    //     this.getAllCategoryData();
    // }

    // isLoggedIn(){
    //     this.loginData = JSON.parse(localStorage.getItem("login_data"));
    //     if ( !this.loginData ) return;
    // }

    // getAllCategoryData(){
    //     this.ref.once('value').then( snapshot => {
    //             this.list_category = snapshot.val(); 
    //             console.log( "Category List ", this.categories );
    //         }, err => console.log( "Error getAllCategoryData ", err ));
    // }
}