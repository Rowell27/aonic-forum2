import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FireBaseService } from '../../../app/firebase-service';

import { USER_DATA } from '../../../app/firebase-interface';



@Component ({
    selector: 'login-page',
    templateUrl: 'login.html'
})

export class LoginPage {

    user = <USER_DATA> {};
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

    valdiateInput(){
        if ( this.user.email == null || this.user.email == "" ) {
            alert( "No user email provided" );
            return false;
        }
        if ( this.user.password == null || this.user.password == "" ) {
            alert( "No user password provided" );
            return false;
        }
        return true;
    }

    checkLoggedIn(){
        this.fireService.isLoggedIn( re => {
            this.key = re;
            this.router.navigate( ['/forum-home'] );
        }, error => console.info( "Alert! ", error ) );
    }

    onClickLoginUser(){
        if ( this.valdiateInput() == false ) return;
        this.error = "";
        this.fireService.login( this.user, () =>{
            this.router.navigate( ['/forum-home'] ); 
        }, error => {
            console.log("Alert! ", error);
            this.error = error.message;
            this.renderPage();
        });
    }

}