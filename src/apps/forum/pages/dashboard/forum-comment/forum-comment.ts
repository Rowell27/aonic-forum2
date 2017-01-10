import { Component, OnInit, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FireBaseService } from '../../../app/firebase-service';

import { USER_DATA, POST_DATA, COMMENT_DATA } from '../../../app/firebase-interface';


@Component({
    selector: 'forum-comment-page',
    templateUrl: 'forum-comment.html'
})

export class ForumCommentPage implements OnInit {       
    
    key;
    comments = <COMMENT_DATA> {};
    toggle: boolean = false;
    temp;
    @Input() post: POST_DATA;
    @Input() comment;
    @Output() delete = new EventEmitter();
    @Output() update = new EventEmitter();

    constructor( private router: Router, 
                 private fireService : FireBaseService,
                 private ngZone: NgZone ) {
    }
    
    ngOnInit(){
    }

    renderPage( re ) {
        this.ngZone.run(() => {
        });
    }

    onClickToggleEdit( comment ){
        if( this.toggle == false ) {
            this.temp = comment.data.content
            return this.toggle = true;
        }
        this.comment.data.content = this.temp;
        this.toggle = false;
    }    

    onClickUpdateComment( comment ){
        this.update.emit();
        this.toggle = false
    }

    onClickDeleteComment( comment, id ){
        this.delete.emit();
    }

}