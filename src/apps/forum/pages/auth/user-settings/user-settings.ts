import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FireBaseService } from '../../../app/firebase-service';
import {  USER_DATA } from '../../../app/firebase-interface';

@Component({
    selector: 'user-settings-page',
    templateUrl: 'user-settings.html'
})

export class UserSettingsPage{

    key: string;

    constructor( private router: Router,
                 private fireService: FireBaseService) {
        this.checkLoggedIn();
    }

    checkLoggedIn(){
        this.fireService.isLoggedIn( re => {
            this.key = re;
        }, error => console.info( "Alert! ", error ) );
    }

    onClickResetPassword(){
        // let email = this.loginData.email;

        // this.auth.sendPasswordResetEmail( email )
        //     .then( () => alert( "A reset configuration is already sent to your account." ),
        //             err => console.log("Failed to Send Reset" , err) );
    }

    onClickDeleteUserAccount(){
        // let user = this.auth.currentUser;

        // user.delete()
        //     .then( () => {
        //             alert( "Account successfully deleted" );

        //             this.userRef
        //                 .child( this.loginData.uid )
        //                 .remove( err => console.log( "Unable to delete user data from db. ", err ) );
        //             localStorage.removeItem( 'login_data' );
        //             this.router.navigate( ['/login'] );
        //         }, err => alert( "Unable to delete account" ));
    }
}