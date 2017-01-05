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
    loginData: USER_DATA = null;
    auth;
    ref;
    key: string;
    data = {};

    error = "";
    constructor( 
        private router: Router, 
        private fireService : FireBaseService,
        private ngZone : NgZone  
     ) {
        this.auth = fireService._auth();
        this.ref = fireService._database().ref("users")
        this.isLoggedIn(); 
     }  


    renderPage() {
        this.ngZone.run(() => {
            console.log('ngZone.run()');
        });
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

    isLoggedIn(){
        this.loginData = JSON.parse( localStorage.getItem("SESSION_ID") );
        if ( !this.loginData ) return;
        alert ( "Already logged in as " + this.loginData.email );
        this.router.navigate( ['/forum-home'] );
    }

    // validateForm(){
    //     this.ref
    //         .child( this.key )
    //         .once('value').then( snapshot => {
    //             this.userData = snapshot.val(); 
    //             console.log( "User Data", this.userData );
    //         }, err => console.log( "Error getUserData ", err ));
    // }


    getUserData( successCallback, failureCallback ){
        if ( !this.key ) this.key = this.loginData.uid;
        
        console.log("This user's UID: ", this.key );
        this.ref
            .child( this.key )
            .once('value').then( snapshot => {
                this.userData = snapshot.val(); 
                successCallback( this.userData )
                console.log( "User Data", this.userData );
            }, err => failureCallback( err ) );
    }

    // onClickLoginUser(){
    //     this.user
    //         .set( 'email', this.userData.email )
    //         .set( 'password', this.userData.password )
    //         .login( authData => {
                
    //             this.key = authData.uid;
                
    //             this.getUserData( userData => {
    //                     this.data = {
    //                     name: this.userData.name,
    //                     email: this.userData.email,
    //                     uid: this.key
    //                 }

    //                 console.log("Data to be stored on cache  ", this.data)
    //                 localStorage.setItem( 'login_data', JSON.stringify( this.data ) );
    //                 this.loginData = JSON.parse( localStorage.getItem( 'login_data' ) );                       
    //                 this.router.navigate( ['/forum-home'] ); 
    //             }, error=> alert( "Unable to get user data" + error) );
                
    //         }, err => console.log(err));            
    // }
}