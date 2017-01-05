import { Injectable } from '@angular/core';
import { auth, database } from 'firebase';
import * as firebase from 'firebase';
import { USER_DATA, USER_LOGIN_DATA } from './firebase-interface';

@Injectable()
export class FireBaseService {
    data = <USER_LOGIN_DATA> {}
    key: string;
    _auth;
    _database;

    constructor() { 
        let firebaseConfig = {
            apiKey: "AIzaSyCV0ovi7fQaOmr8HuIdcf9AI4yEgElkEag",
            authDomain: "aonic-d1606.firebaseapp.com",
            databaseURL: "https://aonic-d1606.firebaseio.com",
            storageBucket: "aonic-d1606.appspot.com",
            messagingSenderId: "329419405941"
        };
        firebase.initializeApp(firebaseConfig);
        this._auth = auth;
        this._database = database;
    }

    /***********************************************************
     * @Guide in using isLoggedIn() method:
     *    This method checks if user is logged in using the SESSION_ID saved in LocalStorage
     *
     * ************************************************************/

    isLoggedIn( successCallback: ( key: string ) => void, failureCallback: ( error? ) => void ){
        if ( !localStorage.getItem("SESSION_ID") ) return failureCallback();
        successCallback ( localStorage.getItem("SESSION_ID") );
    }

    /*************************************************************
     * @Guide in using login() method:
     *    This method logs in user with the provided information
     * 
     * -- If "success", it returns data from firebase, which is passed to "authData"
     * -- Then, the variable "key" gets the UID from "authData", which is then saved to LocalStorage and will act as SESSION_ID
     * -- If "failure", it returns an error
     * 
     * @example 
     * login( user, () => {
     *      console.log( "Logged in success!" );
     * },error=>{
     *      console.log( error );
     * });
     * 
     * *************************************************************/

    login( user: USER_LOGIN_DATA , successCallback: () => void , failureCallback: ( error ) => void ){
        auth().signInWithEmailAndPassword( user.email, user.password )
              .then( authData =>{
                    this.key = authData['uid']
                    console.info( "Logged in! UID :", this.key );
                    localStorage.setItem( 'SESSION_ID', JSON.stringify( this.key ) );
                    successCallback();                        
              })
              .catch( error =>  failureCallback( error ) );
    }

    /****
     * @Guide in using register() method:
     *      This method registers the user with the provided information
     * 
     * -- If "success" from creating account using "auth()" method, it returns data and is passed to "authData", else error 
     * -- Then it gets UID of authData then passes it to "key" holder 
     * -- 
     *
     * ****/

    register( user: USER_DATA, successCallback: () => void , failureCallback: ( error ) => void ){
        auth().createUserWithEmailAndPassword( user.email, user.password )
              .then( authData =>{
                  console.log( "Success create account: ", authData )
                  this.key = authData['uid']
                  delete user.password;
                  this.create( user, "users", () => {
                        localStorage.setItem( 'SESSION_ID', JSON.stringify( this.key ) );
                  }, failureCallback )
              })
              .catch( error =>  failureCallback( error ) );
    }

    create( data , refName: string, successCallback: () => void , failureCallback: ( error ) => void){
         let ref = database().ref( refName );
         ref.child( this.key )
            .set( data )
            .then( () => {
                console.log("Successfully pushed data", data );
                successCallback();
            })
            .catch( error =>  failureCallback( error ) ); 
    }

    update(){


    }

    delete(){


    }

    /****
     *@Guide in using get() method:
     * 
     *
     * ****/

    get( key, refName: string, successCallback: ( data: USER_DATA ) => void, failureCallback: ( error ) => void ){
         let ref = database().ref( refName );
         console.log("Running get() method. ref: ", ref, key);
         ref.child( key ).once('value')
            .then( snapshot => {
                    let data = snapshot.val();  
                    console.log( "Data from snapshot: ", data);
                    successCallback( data );
            })
            .catch( error => failureCallback( error )  );
    }



    list(){


    }


    


    
    
}