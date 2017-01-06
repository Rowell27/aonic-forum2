import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FireBaseService } from '../../../app/firebase-service';

import { USER_DATA } from '../../../app/firebase-interface';



@Component ({
    selector: 'login-page',
    templateUrl: 'login.html'
})

export class LoginPage {

    userData = <USER_DATA> {};
    auth;
    key: string;
    data = {};
    error = "";
    
    constructor( 
        private router: Router, 
        private fireService : FireBaseService,
        private ngZone : NgZone  
     ) {
        this.checkLoggedIn();
     }  

    renderPage() {
        this.ngZone.run(() => {
            console.log('ngZone.run()');
        });
    }

    checkLoggedIn(){
        this.fireService.isLoggedIn( re => {
            this.key = re;
            this.router.navigate( ['/forum-home'] );
        }, error => console.info( "Alert! ", error ) );
    }

    onClickLoginUser(){
             this.error = "";
             this.fireService.login( this.userData, () =>{
                    this.router.navigate( ['/forum-home'] ); 
             }, error => {
                 console.log("Error", error);
                 this.error = error.message;
                 this.renderPage();
            });
    }

}