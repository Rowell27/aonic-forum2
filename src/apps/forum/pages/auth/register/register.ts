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
    key:string;
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

    onClickGetUser(){
        console.log('fhae5kC5f8f0sSp0bCaYh4OctKF2 ' + this.key)
        this.fireService.get( this.key , "users", snapshot => {
            alert( "Snapshot: " + JSON.stringify(snapshot) )
        }, error => console.log( "Error ", error ) )
    }

    onClickUpdateUser(){
        this.fireService.update( this.userData, this.key, "users", () => {
            this.fireService.updateUserEmail( this.userData.email, () => {
                alert( "Update success!" );
            }, error => console.log( "Unable to update email: ", error ) );
        }, error => console.log( "Unable to update user: ", error ) );
    }

}   