import { Component, OnInit, Input, NgZone } from '@angular/core';
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
    list_comments = [];
    comments_keys = [];
    @Input() post: POST_DATA;
    @Input() comment;

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
    

    getCommentsList(){
        
    }

    

}