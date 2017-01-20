import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FireBaseService } from '../../../app/firebase-service';

import { USER_DATA } from '../../../app/firebase-interface';
import { FireBaseServiceTest } from '../../../app/unit-test/unit-test';



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
        private fireTest : FireBaseServiceTest,
        private ngZone : NgZone  
     ) {
        this.checkLoggedIn();
     }  

    renderPage() {
        this.ngZone.run(() => {
            console.log('ngZone.run()');
        });
    }

    userTest(){
        this.fireTest.userUnitTest();
    }

    postTest(){
        this.fireTest.postUnitTest();
    }

    validateInput(){
        if ( this.user.email == null || this.user.email == "" ) return this.validateError('Email');
        if ( this.user.password == null || this.user.password == "" ) return this.validateError('Password');
        return true;
    }

    validateError( value ){
        alert( value + " is not provided!" );
        return false;
    }

    checkLoggedIn(){
        this.fireService.isLoggedIn( re => {
            this.key = re;
            this.router.navigate( ['/forum-home'] );
        }, error => console.info( "Alert! ", error ) );
    }

    onClickLoginUser(){
        if ( this.validateInput() == false ) return;
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