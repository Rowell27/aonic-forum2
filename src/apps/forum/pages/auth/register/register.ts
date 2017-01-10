import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FireBaseService } from '../../../app/firebase-service';
import { USER_DATA } from '../../../app/firebase-interface';


@Component ({
    selector: 'register-page',
    templateUrl: 'register.html'
})

export class RegisterPage {

    user = <USER_DATA> {}
    key;
    error;
    
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
                this.user = data;
            }, error => console.log( "Unable to retrieved user data from server. Error: ", error ) );
        }, error => console.info( "Alert! ", error ) );
    }

    validateInput(){
        if ( this.user.name == null || this.user.name == "" ) {
            alert( "No user name provided" );
            return false;
        }
        if ( this.user.address == null || this.user.name == "" ) {
            alert( "No user address provided" );
            return false;
        }
        if ( this.user.mobile == null || this.user.name == "" ) {
            alert( "No user mobile provided" );
            return false;
        }
        if ( this.user.email == null || this.user.name == "" ) {
            alert( "No user email provided" );
            return false;
        }
        if ( this.user.password == null || this.user.name == "" ) {
            alert( "No user password provided" );
            return false;
        }
        return true;
    }

    onClickRegisterUser(){
        if( this.validateInput() == false) return;
        this.error = ""
        this.fireService.register( this.user, () => {
                alert("Registration success! ");
                this.router.navigate( ['/forum-home'] );
        }, error => {
                console.log("Alert! ", error);
                this.error = error.message;
                this.renderPage();
        } );
    }

    onClickUpdateUser(){
        this.fireService.update( this.user, this.key, "users", () => {
            alert( "Update success!" );
        }, error => console.log( "Unable to update user: ", error ) );
    }

    onClickResetPassword(){
        this.fireService.resetUserPassword( () => {
            alert( "A reset configuration is already sent to your email address." )
        }, error => alert( "Unable to send reset configuration to email" ) );
    }

    onClickDeleteUserAccount(){
        this.fireService.resign( this.key, "users", () => {
            alert( "Account deleted!" );
            this.router.navigate( ['/login'] );
        }, error => console.log( "Unable to delete account" ) );
    }

}   