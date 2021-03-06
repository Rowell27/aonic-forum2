import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FireBaseService } from '../../../app/firebase-service';

@Component({
    selector: 'base-nav',
    templateUrl: 'nav.html'
})

export class BaseNav {

    key = null;

    constructor( private router: Router,
                 private fireService: FireBaseService ) { 
        this.checkLoggedIn();
    }

    checkLoggedIn(){
        this.fireService.isLoggedIn( re => {
            this.key = re;
        }, error => {} );
    }

    onClickLogoutUser(){
        this.fireService.logout();
        this.router.navigate( ['/login'] );
    }

}