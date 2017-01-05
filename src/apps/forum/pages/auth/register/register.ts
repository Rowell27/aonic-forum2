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
    loginData: USER_LOGIN_DATA = null;
    error;
    ref;
    data = {};
    
    constructor( private router: Router, 
                 private fireService : FireBaseService,
                 private ngZone: NgZone ) {
        this.ref = fireService._database().ref("users")
        this.checkLoggedIn();
    }
    
    renderPage() {
        this.ngZone.run(() => {
            console.log('ngZone.run()');
        });
    }

    checkLoggedIn(){
        this.fireService.isLoggedIn( key => {
            alert( "Already logged in..." );
            this.router.navigate( ['/forum-home'] );
        }, error => console.log( error) );
    }
    
    onClickRegisterUser(){
        this.error = ""
        this.fireService.register( this.userData, () => {
                alert("Registration success! ");
        }, error => {
                console.log("Error", error);
                this.error = error.message;
                this.renderPage();
        } )
    }

    onClickGetUser(){
        this.fireService.get( "fhae5kC5f8f0sSp0bCaYh4OctKF2", "users", data => {
            alert( "Fetch data: " + data );
        }, error => console.log( "Error fetching data" ))
    }

    // onClickRegisterUser(){
    //     this.auth.createUserWithEmailAndPassword( this.userData.email, this.userData.password )
    //         .then( authData =>{
    //             console.log('success register' + JSON.stringify(authData) );

    //             this.key = authData["uid"];
    //             console.log( "Auth Data UID ", authData["uid"] )

    //             // this.ref.c

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

    //          })
    //         .catch( err => alert( "Account is not registered." + err ) );
    // }

    // getUserData( successCallback, failureCallback ){
    //     if ( !this.key ) this.key = this.loginData.uid;
        
    //     console.log("This user's UID: ", this.key );
    //     this.ref
    //         .child( this.key )
    //         .once('value').then( snapshot => {
    //             this.userData = snapshot.val(); 
    //             successCallback( this.userData )
    //             console.log( "User Data", this.userData );
    //         }, err => failureCallback( err ) );
    // }

    onClickUpdateUser(){
        // let key =  this.loginData.uid;
        // console.log( "This user's key to update: " , key );
        // this.ref.child( key )
        //     .update( this.userData )
        //     .then ( re => {
        //             alert( "Account successfully updated" );

        //             this.getUserData( userData => {
        //                          this.data = {
        //                             name: this.userData.name,
        //                             email: this.userData.email,
        //                             uid: this.key
        //                         }

        //                         console.log("Data to be stored on cache  ", this.data)
        //                         localStorage.setItem( 'login_data', JSON.stringify( this.data ) );
        //                         this.loginData = JSON.parse( localStorage.getItem( 'login_data' ) );   

        //                         this.router.navigate( ['/forum-home'] ); 
        //                     }, error=> alert( "Unable to get user data" + error) );
        //          }, err => console.log("Error Update. ", err) );
    }

}   