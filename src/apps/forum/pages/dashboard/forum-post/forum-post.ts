import { Component, OnInit, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FireBaseService } from '../../../app/firebase-service';

import { USER_DATA, POST_DATA, COMMENT_DATA } from '../../../app/firebase-interface';


@Component({
    selector: 'forum-post-page',
    templateUrl: 'forum-post.html'
})

export class ForumPostPage implements OnInit {       
    
    @Input() post;
    @Output() delete = new EventEmitter();    
    @Output() update = new EventEmitter();    
    
    comment = <COMMENT_DATA> {}
    user: USER_DATA;
    list_comments = []
    photoUrl = 'assets/image/user-profile.png';
    toggle: boolean = false;
    toggle_comments: boolean = false;
    error:string = '';
    key;
    temp;

    constructor( private router: Router, 
                 private fireService : FireBaseService,
                 private ngZone: NgZone ) {
    }
    
    ngOnInit(){
        this.getCommentsLists();
        this.getPostOwner();
    }

    renderData( data ) {
        this.ngZone.run(() => {
            this.user = data;
        });
    }

    getPostOwner(){
        console.log( "Post owner UID: " + this.post.data.uid )
        this.fireService.get( this.post.data.uid, "users", data => {
            this.renderData( data );
            console.log( "PostOwnerContent: " + this.user.name );
            if ( this.user.photoUrl ) return this.photoUrl = this.user.photoUrl;
        }, error => console.log( "Unable to get user info. ", error ) );
    }

    getCommentsLists(){
        this.list_comments = [];
        let path = "comments/" + this.post.key
        this.fireService.list( path , data => {
            this.displayComments( data );
            // console.log( "Post lists: ", JSON.stringify(this.list_posts))
        }, error => {
            this.renderError();
            console.log( "Error: ", error );
        } )
    }

    renderError(){
        this.ngZone.run(() =>{
            this.error = 'This post has no comment(s)';
        })
    }

    displayComments( data? ){
        if ( data === void 0 ) return;
        for( let id of Object.keys( data ) ){
            this.list_comments.push( { key: id, data: data[id] } );
        }
    }

    onClickToggleEdit( post ){
        if( this.toggle == false ) {
            this.temp = post.data.content
            return this.toggle = true;
        }
        this.post.data.content = this.temp;
        this.toggle = false;
    }

    onClickViewComments( ){
        if( this.toggle_comments == false ) {
            return this.toggle_comments = true;
        }
        this.toggle_comments = false;
    }

    onClickUpdatePost( post ){
        this.update.emit();
        this.toggle = false
    }

    onClickDeletePost( post, id ){
        if( confirm( "Are you sure you want to delete?" ) == false ) return;
        this.delete.emit();
    }

    validateInput(){
        if ( this.comment.content == null || this.comment.content == '' ) 
        {
            alert( "Please provide message." );
            return false;
        }
        return true;
    }

    onClickSubmitComment( post ){
        if ( this.validateInput() == false ) return;
        let refName = "comments/" + post.key
        let time = new Date().getTime();
        let date = new Date(time);
        let data = {
            uid: this.key,
            content: this.comment.content,
            created: date.toDateString()
        }
        this.fireService.create( data, refName, re => {
            console.log( "Success comment!" )
            this.comment.content = '';
            let newcomment = JSON.parse(JSON.stringify( re ))
            this.list_comments.push( newcomment );
            this.error = '';
        }, error => console.log( "Unable to create comment. ", error ) );
    }
    
    onClickUpdateComment( post, comment ){
        let refName = "comments/" + post.key
        let time = new Date().getTime();
        let date = new Date(time);
        let data = {
            author: comment.data.author,
            updated: date.toDateString(),
            content: comment.data.content 
        }
        this.fireService.update( data, comment.key, refName, () => {
            console.log( "Comment updated!" )
        }, error => console.log( "Unable to update comment" ) )
    }

    onClickDeleteComment( post, comment, id ){
        let refName = "comments/" + post.key
        this.fireService.delete( comment.key, refName, () => {
            console.log( "Delete comment successful" )
            this.list_comments.splice( id, 1 );
            if( this.list_comments.length <= 0) this.error ='This post has no comment(s)'
        }, error => console.log( "Unable to delete comment! Error: ", error ) );
    }
} 