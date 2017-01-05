import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { USER_DATA } from '../../../app/firebase-interface';

@Component({
    selector: 'base-nav',
    templateUrl: 'nav.html'
})

export class BaseNav {

    loginData: USER_DATA = null;

    constructor( private router: Router ) { 
        this.isLoggedIn();
    }

    getUserData(){
        this.loginData = JSON.parse(localStorage.getItem("SESSION_ID"));        
    }

    isLoggedIn(){
        this.getUserData();
        if ( !this.loginData ) return;
    }

    onClickLogoutUser(){
        this.getUserData();

        if ( !this.loginData ) return; 
                
        localStorage.removeItem('SESSION_ID');
        this.router.navigate( ['/login'] );
    }

}