import { Component, OnInit, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FireBaseService } from '../../../app/firebase-service';

import { USER_DATA, POST_DATA, COMMENT_DATA } from '../../../app/firebase-interface';


@Component({
    selector: 'forum-comment-page',
    templateUrl: 'forum-comment.html'
})

export class ForumCommentPage implements OnInit {       
    
    @Input() post: POST_DATA;
    @Input() comment;
    @Output() delete = new EventEmitter();
    @Output() update = new EventEmitter();

    comments = <COMMENT_DATA> {};
    user: USER_DATA;
    toggle: boolean = false;
    photoUrl = 'assets/image/user-profile.png';
    key = null;
    temp;    

    constructor( private router: Router, 
                 private fireService : FireBaseService,
                 private ngZone: NgZone ) {
    }
    
    ngOnInit(){
        this.getCommentOwner();
        this.getUserID();
    }

    renderData( data ) {
        this.ngZone.run(() => {
            this.user = data;
        });
    }

    getUserID(){
        this.key = localStorage.getItem( 'SESSION_ID' );
    }

    getCommentOwner(){
        this.fireService.get( this.comment.data.uid, "users", data => {
            this.renderData( data );
            if ( this.user.photoUrl ) return this.photoUrl = this.user.photoUrl;
        }, error => console.log( "Unable to get user info. ", error ) );
    }

    onClickToggleEdit( comment ){
        if( this.toggle == false ) {
            this.temp = comment.data.content
            return this.toggle = true;
        }
        this.comment.data.content = this.temp;
        this.toggle = false;
    }    

    onClickUpdateComment( post, comment ){
        this.update.emit();
        this.toggle = false
    }

    onClickDeleteComment( post, comment, id ){
        if( confirm( "Are you sure you want to delete?" ) == false ) return;
        this.delete.emit();
    }

}