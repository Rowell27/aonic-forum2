import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FireBaseService } from '../../../app/firebase-service';

import { USER_DATA } from '../../../app/firebase-interface';
import { POST_DATA } from '../../../app/firebase-interface';


@Component({
    selector: 'forum-home-page',
    templateUrl: 'forum-home.html'
})

export class ForumHomePage implements OnInit {       
    
    post = <POST_DATA> {}
    user = <USER_DATA> {}
    photoUrl = 'assets/image/user-profile.png';
    postPhotoUrl = 'assets/image/post-photo.png';
    key;
    list_posts = [];

    constructor( private router: Router, 
                 private fireService : FireBaseService,
                 private ngZone: NgZone ) {
    }
    
    ngOnInit(){
        this.checkLoggedIn();
        this.getPostLists();
    }

    renderPage( data ) {
        this.ngZone.run(() => {
            this.user = data;
        });
    }

    checkLoggedIn(){
        this.fireService.isLoggedIn( re => {
            this.key = re;
            this.getUser();
        }, error => console.log( "Error: ", error ) );
    }

    getUser(){
        this.fireService.get( this.key, "users", data => {
            this.renderPage( data );
            if ( this.user.photoUrl ) return this.photoUrl = this.user.photoUrl;
        }, error => console.log( "Unable to get user info. ", error ) );
    }

    getPostLists(){
        this.list_posts = [];
        this.fireService.list( "posts", data => {
            this.displayPosts( data );
            // console.log( "Post lists: ", JSON.stringify(this.list_posts))
        }, error => console.log( "Unable to get all data. ", error ) )
    }

    displayPosts( data? ){
        if ( data === void 0 ) return;
        for( let id of Object.keys( data ).reverse() ){
            this.list_posts.push( { key: id, data: data[id] } );
        }
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
        let time = new Date().getTime();
        let date = new Date(time);
        let data = {
            content: this.post.content,
            created: date.toDateString(),
            uid: this.key
        }
        this.fireService.create( data, "posts", re => {
            this.post.content = '';
            let newpost = JSON.parse(JSON.stringify( re ))
            this.list_posts.unshift( newpost )
        }, error => console.log( "Unable to create post. Error: ", error ) );
    }

    onClickUpdatePost( post ){
        let time = new Date().getTime()
        let date = new Date(time)
        let data = {
            uid: post.data.uid,
            updated: date.toDateString(),
            content: post.data.content 
        }
        this.fireService.update( data, post.key, "posts", () => {
            console.log( "Post updated!" )
        }, error => console.log( "Unable to update post" ) )
    }

    onClickDeletePost( post, id ){
        this.fireService.delete( post.key, "posts", () => {
            this.fireService.destroy( "comments/" + post.key, () => {
                console.log( "Delete post successful" )
            }, error => console.log( "Unable to delete comments in post! Error: ", error ) );
            this.list_posts.splice( id, 1 );
        }, error => console.log( "Unable to delete post! Error: ", error ) );
    }
}