import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FireBaseService } from '../../../app/firebase-service';

import { USER_DATA } from '../../../app/firebase-interface';
import { POST_DATA } from '../../../app/firebase-interface';


@Component({
    selector: 'forum-comment-page',
    templateUrl: 'forum-comment.html'
})

export class ForumCommentPage implements OnInit {       
    
    key;
    user = <USER_DATA> {}
    comments = <POST_DATA> {};
    list_comments = [];
    comments_keys = [];

    constructor( private router: Router, 
                 private fireService : FireBaseService,
                 private ngZone: NgZone ) {
    }
    
    ngOnInit(){
    }

    renderPage() {
        this.ngZone.run(() => {
            console.log('ngZone.run()');
        });
    }

}