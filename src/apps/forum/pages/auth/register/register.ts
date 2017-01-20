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
    key = null;
    error;
    temp;
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

    renderUserProfile( file ) {
        this.ngZone.run(() => {
            this.user.photoUrl = file.url;
            this.user.photoRef = file.ref
            this.photoUrl = file.url;
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
        if ( this.user.name == null || this.user.name == "" ) return this.validateError('Username');
        if ( this.user.mobile == null || this.user.mobile == "" ) return this.validateError('Mobile');
        if ( this.user.address == null || this.user.address == "" ) return this.validateError('Address');
        if ( this.user.email == null || this.user.email == "" ) return this.validateError('Email');
        if ( this.user.password == null || this.user.password == "" ) return this.validateError('Password');
      
        return true;
    }

    validateError( value ){
        alert( value + " is not provided!" );
        return false;
    }

    deletePhoto( ref ){
        this.fireService.deletePhoto( ref, () => {
            console.log( "Old photo deleted" );
        }, error => console.log( "Unable to delete photo. Error: ", error ) );
    }

    onChangeFile( $event ){
        let file = $event.target.files[0];
        console.log( "Target file: " , file )

        if( file === void 0 ) return;
        if( this.user.photoUrl ){
            this.deletePhoto( this.user.photoRef );
        }
        this.progress = true;

        let photoData = {
            file: file,
            path: "images/" + Date.now() + "/" + file.name
        }

        this.fireService.upload( photoData, uploaded => {
            console.log( "Photo URL: " + uploaded.url );
            this.renderUserProfile( uploaded );
        }, error => {
            alert( "Unable to upload! Error: " + error );
        }, percent => {
            this.progress_value = percent;
            this.renderProgress( percent );
            if( this.progress_value == 100 ) return this.progress = false;
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
            this.router.navigate( ['/forum-home'] );
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

    onClickDeleteUserPhoto( ){
        if( confirm( "Are you sure you want to delete?" ) == false ) return;
        if( !this.user.photoUrl ) return;
        this.deletePhoto( this.user.photoRef );
        this.photoUrl = 'assets/image/user-profile.png';
    }

}   