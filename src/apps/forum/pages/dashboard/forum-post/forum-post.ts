import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FireBaseService } from '../../../app/firebase-service';

import { USER_DATA } from '../../../app/firebase-interface';
import { POST_DATA } from '../../../app/firebase-interface';


@Component({
    selector: 'forum-post-page',
    templateUrl: 'forum-post.html'
})

export class ForumPostPage implements OnInit {       
    
    key;
    user = <USER_DATA> {}
    post = <POST_DATA> {};
    list_posts = [];
    post_keys = [];

    constructor( private router: Router, 
                 private fireService : FireBaseService,
                 private ngZone: NgZone ) {
    }
    
    ngOnInit(){
        this.getPosts();
        this.getUser();
    }

    renderPage() {
        this.ngZone.run(() => {
            console.log('ngZone.run()');
        });
    }

    getPosts(){
        this.list_posts = []
        this.fireService.list( "posts", data => {
            this.displayPosts( data );
            // console.log( "Post lists: ", JSON.stringify(this.list_posts))
        }, error => console.log( "Unable to get all data. Error: ", error ) )
    }

    getUser(){
        this.key = localStorage.getItem( 'SESSION_ID' );
        this.fireService.get( this.key, "users", re => {
            this.user = re;
        }, error => console.log( "Unable to get user info. Error: ", error ) );
    }

    displayPosts( data? ){
        if ( data === void 0 ) return;
        for( let id of Object.keys( data ) ){
            this.list_posts.push( data[id] );
        }
        this.post_keys = Object.keys( data )
    }

    validateInput(){
        if ( this.post.content == null || this.post.content == '' ) 
        {
            alert( "Please provide message." );
            return false;
        }
        return true;
    }

    onClickSubmitPost(){
        if ( this.validateInput() == false ) return;
        let data = {
            content: this.post.content,
            created: Date.now(),
            author: this.user.name
        }
        this.fireService.create( data, "posts", () => {
            this.getPosts();
        }, error => console.log( "Unable to create post. Error: ", error ) );
    }

    onClickDeletePost( id ){
        let key = this.post_keys[id]
        if( confirm( "Are you sure you want to delete?" ) == false ) return;
        this.fireService.delete( key, "posts", () => {
            console.log( "Delete successful" )
            this.getPosts();
        }, error => console.log( "Unable to delete post! Error: ", error ) );
    }

} 