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
    
    key;
    user = <USER_DATA> {}

    constructor( private router: Router, 
                 private fireService : FireBaseService,
                 private ngZone: NgZone ) {
        this.checkLoggedIn();
    }
    
    ngOnInit(){
        this.getUser();
    }

    renderPage() {
        this.ngZone.run(() => {
            console.log('ngZone.run()');
        });
    }

    checkLoggedIn(){
        this.fireService.isLoggedIn( re => {
            this.key = re;
        }, error => console.log( "Error: ", error ) );
    }

    getUser(){
        this.fireService.get( this.key, "users", re => {
            this.user = re;
        }, error => console.log( "Unable to get user info. Error: ", error ) );
    }
}