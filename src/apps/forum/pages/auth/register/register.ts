import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { database, auth } from 'firebase';
import { FireBaseService } from '../../../app/firebase-service';
import { USER_DATA, USER_LOGIN_DATA } from '../../../app/firebase-interface';


@Component ({
    selector: 'register-page',
    templateUrl: 'register.html'
})

export class RegisterPage {

    userData = <USER_DATA> {}
    key;
    error;
    ref;
    data = {};
    
    constructor( private router: Router, 
                 private fireService : FireBaseService,
                 private ngZone: NgZone ) {
        this.checkLoggedIn();
    }
    
    renderPage() {
        this.ngZone.run(() => {
            console.log('ngZone.run()');
        });
    }

    checkLoggedIn(){
        this.fireService.isLoggedIn( re => {
            console.log( "Session ID: " , re )
            this.key = re;
            this.fireService.get( this.key, "users", data => {
                this.userData = data;
            }, error => console.log( "Unable to retrieved user data from server. Error: ", error ) );
        }, error => console.info( "Alert! ", error ) );
    }
    
    onClickRegisterUser(){
        this.error = ""
        this.fireService.register( this.userData, () => {
                alert("Registration success! ");
                this.router.navigate( ['/forum-home'] );
        }, error => {
                console.log("Error", error);
                this.error = error.message;
                this.renderPage();
        } )
    }

    onClickUpdateUser(){
        this.fireService.update( this.userData, this.key, "users", () => {
            alert( "Update success!" );
        }, error => console.log( "Unable to update user: ", error ) );
    }

    onClickResetPassword(){
        this.fireService.resetUserPassword( () => {
            alert( "A reset configuration is already sent to your email address." )
        }, error => alert( "Unable to send reset configuration to email" ) );
    }

    onClickDeleteUserAccount(){
        this.fireService.deleteUser( this.key, "users", () => {
            alert( "Account deleted!" );
            this.router.navigate( ['/login'] );
        }, error => console.log( "Unable to delete account" ) );
    }

}   