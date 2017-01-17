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
    progress: boolean = false;
    progress_value: number = 0;
    photoUrl = 'assets/image/user-profile.png';

    
    constructor( private router: Router, 
                 private fireService : FireBaseService,
                 private ngZone: NgZone ) {
        this.checkLoggedIn();
    }
    
    renderData( data ) {
        this.ngZone.run(() => {
            this.user = data
        });
    }

    renderPage() {
        this.ngZone.run(() => {
        });
    }

    renderUserProfile( url ) {
        this.ngZone.run(() => {
            this.user.photoUrl = url;
            this.photoUrl = url;
        });
    }

    renderProgress( value ) {
        this.ngZone.run(() => {
            this.progress = true;
        });
    }

    checkLoggedIn(){
        this.fireService.isLoggedIn( re => {
            console.log( "Session ID: " , re )
            this.key = re;
            this.fireService.get( this.key, "users", data => {
                this.renderData( data );
                if ( this.user.photoUrl ) return this.photoUrl = this.user.photoUrl;
            }, error => console.log( "Unable to retrieved user data from server. Error: ", error ) );
        }, error => console.info( "Alert! ", error ) );
    }

    validateInput(){
        if ( this.user.name == null || this.user.name == "" ) {
            this.error = "No user name provided"
            return false;
        }
        if ( this.user.address == null || this.user.name == "" ) {
            this.error = "No address provided"
            return false;
        }
        if ( this.user.mobile == null || this.user.name == "" ) {
            this.error = "No mobile provided"
            return false;
        }
        if ( this.user.email == null || this.user.name == "" ) {
            this.error = "No email provided"
            return false;
        }
        if ( this.user.password == null || this.user.name == "" ) {
            this.error = "No password provided"
            return false;
        }
        return true;
    }

    onChangeFile( $event ){
        let file = $event.target.files[0];
        console.log( "Target file: " , file )
        if( file === void 0 ) return;
        this.progress = true;

        let photoData = {
            file: file,
            path: "images/" + Date.now() + "/" + file.name
        }

        this.fireService.upload( photoData, uploaded => {
            console.log( "Photo URL: " + uploaded.url );
            this.renderUserProfile( uploaded.url );
        }, error => {
            alert( "Unable to upload! Error: " + error );
        }, percent => {
            this.progress_value = percent;
            this.renderProgress( percent );
        });
    }

    onClickRegisterUser(){
        if( this.validateInput() == false) return;
        this.error = ""
        this.fireService.register( this.user, "users", () => {
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