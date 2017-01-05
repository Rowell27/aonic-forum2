import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';

import {  USER_DATA } from '../../../app/firebase-interface';

@Component({
    selector: 'user-settings-page',
    templateUrl: 'user-settings.html'
})

export class UserSettingsPage{

    loginData: USER_DATA = null;
    auth = firebase.auth()
    userRef = firebase.database().ref("users")

    constructor( private router: Router) {
        this.isLoggedIn();
    }

    isLoggedIn(){
        this.loginData = JSON.parse(localStorage.getItem("login_data"));  
        if ( !this.loginData ) return;
    }

    onClickResetPassword(){
        let email = this.loginData.email;

        this.auth.sendPasswordResetEmail( email )
            .then( () => alert( "A reset configuration is already sent to your account." ),
                    err => console.log("Failed to Send Reset" , err) );
    }

    onClickDeleteUserAccount(){
        let user = this.auth.currentUser;

        user.delete()
            .then( () => {
                    alert( "Account successfully deleted" );

                    this.userRef
                        .child( this.loginData.uid )
                        .remove( err => console.log( "Unable to delete user data from db. ", err ) );
                    localStorage.removeItem( 'login_data' );
                    this.router.navigate( ['/login'] );
                }, err => alert( "Unable to delete account" ));
    }
}