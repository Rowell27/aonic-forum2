import { Component, OnInit, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FireBaseService } from '../../../app/firebase-service';

import { USER_DATA, POST_DATA, COMMENT_DATA } from '../../../app/firebase-interface';


@Component({
    selector: 'forum-post-page',
    templateUrl: 'forum-post.html'
})

export class ForumPostPage implements OnInit {       
    
    @Input() user: USER_DATA;
    @Input() post;
    @Input() postList=[];
    @Output() delete = new EventEmitter();    
    @Output() update = new EventEmitter();    
    key;
    toggle: boolean = false;
    temp;
    comment = <COMMENT_DATA> {}
    list_comments = []

    constructor( private router: Router, 
                 private fireService : FireBaseService,
                 private ngZone: NgZone ) {
    }
    
    ngOnInit(){
        this.getCommentsLists();
    }

    renderPage( re ) {
        this.ngZone.run(() => {
            this.user = re;
        });
    }

    getCommentsLists(){
        this.list_comments = [];
        let path = "posts/" + this.post.key + "/comments/"
        this.fireService.list( path , data => {
            this.displayComments( data );
            // console.log( "Post lists: ", JSON.stringify(this.list_posts))
        }, error => console.log( "Unable to get all data. ", error ) )
    }

    displayComments( data? ){
        if ( data === void 0 ) return;
        for( let id of Object.keys( data ).reverse( ) ){
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

    onClickUpdatePost( post ){
        this.update.emit();
        this.toggle = false
    }

    onClickDeletePost( post, id ){
        if( confirm( "Are you sure you want to delete?" ) == false ) return;
        this.delete.emit();
    }

    onClickSubmitComment( post ){
        let refName = "posts/" + post.key + "/comments"
        let data = {
            author: this.post.data.author,
            content: this.comment.content,
            created: Date.now()
        }
        this.fireService.create( data, refName, re => {
            console.log( "Success comment!" )
            this.list_comments.unshift( re )
        }, error => console.log( "Unable to create comment. ", error ) );
    }
    
} 