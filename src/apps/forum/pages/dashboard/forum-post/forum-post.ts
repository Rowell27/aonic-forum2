import { Component, OnInit, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FireBaseService } from '../../../app/firebase-service';

import { USER_DATA,POST_DATA } from '../../../app/firebase-interface';


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

    constructor( private router: Router, 
                 private fireService : FireBaseService,
                 private ngZone: NgZone ) {
    }
    
    ngOnInit(){
        // this.getPostLists();
    }

    renderPage( re ) {
        this.ngZone.run(() => {
            this.user = re;
        });
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

    
    
} 