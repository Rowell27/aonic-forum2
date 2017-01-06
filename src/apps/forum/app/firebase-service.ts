import { Injectable } from '@angular/core';
import { auth, database } from 'firebase';
import * as firebase from 'firebase';
import { USER_DATA, USER_LOGIN_DATA } from './firebase-interface';

@Injectable()
export class FireBaseService {
    data = <USER_LOGIN_DATA> {}
    key;
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
     *    This method checks if user is logged in using the SESSION_ID saved in LocalStorage.
     * 
     * @Flow of isLoggedIn() method:
     * -- First, it checks in LocalStorage if there is existing SESSION_ID of the user that is currently logged in. 
     * -- If it has SESSION_ID, it returns the value as a successCallback,
     * -- Else, it returns an alert message using the failureCallback.
     * 
     * @example How To Use: 
     * 
     * isLoggedIn( key => {
     *      console.log( "User is already logged in! Retrieved SESSION_ID: ", key );
     * }, error => {
     *      console.log( error );
     * });
     * 
     *
     * ************************************************************/

    isLoggedIn( successCallback: ( key ) => void, failureCallback: ( error? ) => void ) {
        if ( !localStorage.getItem("SESSION_ID") ) return failureCallback( "No user currently logged in. No SESSION_ID saved." );
        successCallback ( localStorage.getItem("SESSION_ID") );
    }

    /*************************************************************
     * @Guide in using login() method:
     *    This method logs in user with the provided information
     * 
     * @Flow of login() method:
     * -- User provide login information and then passed to "user"
     * -- If "success", it returns data from firebase, which is passed to "authData"
     * -- Then, the variable "key" gets the UID from "authData", which is then saved to LocalStorage and will act as SESSION_ID
     * -- If "failure", it returns an error
     * 
     * @example How To Use: 
     * 
     * login( user, () => {
     *      console.log( "Logged in success!" );
     * },error=>{
     *      console.log( error );
     * });
     * 
     * *************************************************************/

    login( user: USER_LOGIN_DATA , successCallback: () => void , failureCallback: ( error ) => void ) {
        auth().signInWithEmailAndPassword( user.email, user.password )
              .then( authData =>{
                    this.key = authData['uid']
                    console.info( "Logged in! UID :", this.key );
                    localStorage.setItem( 'SESSION_ID', this.key );
                    successCallback();                        
              })
              .catch( error =>  failureCallback( error ) );
    }

    /*************************************************************
     * @Guide in using register() method:
     *      This method registers the user with the provided information
     * 
     * @Flow of register() method:
     * -- User provides information and then passed to "user" property
     * -- If "success" from creating account using "auth()" method, it returns data and is passed to "authData", else error 
     * -- Then it gets UID of authData then passes it to "key" variable
     * -- Then, it deletes the user's password first before it pushes the data to Firebase database
     * -- If "success" in pushing user's info, successCallback returns null
     * -- Then, it sets the user's UID to the LocalStorage, which will act as a SESSION_ID to be used in isLoggedIn() module
     *
     * @example How To Use:
     * 
     * let USER_DATA = {
     *      name: 'User'
     *      email: 'user@email.com',
     *      password: '123456',
     *      mobile: '0922832482',
     *      address: '00 User, Address',
     * }
     * 
     * register ( USER_DATA, () => {
     *      console.log( "Registration success!" );
     * }, error => {
     *      console.log( "Unable to register account. Error: ", error );
     * });
     * 
     * ***********************************************************/

    register( user: USER_DATA, successCallback: () => void , failureCallback: ( error ) => void ) {
        auth().createUserWithEmailAndPassword( user.email, user.password )
              .then( authData =>{
                  console.log( "Success create account: ", authData )
                  this.key = authData['uid']
                  delete user.password;
                  this.create( user, this.key, "users", () => {
                        successCallback();
                        localStorage.setItem( 'SESSION_ID', this.key );
                  }, failureCallback )
              })
              .catch( error =>  failureCallback( error ) );
    }

    /*************************************************************
     * @Guide in using create() method:
     *      This method is used to push data from Firebase database, using the user's provided information
     * 
     * @Flow of create() method:
     * -- User provides information and then passed to "data". The "key" gets it value depends on the method used ( Example: The user's uID )
     * -- The "refName" value will depend on the path specified by the method used. ( Example: "users" )
     * -- Then, "ref" will get the Firebase reference, along with the "refName" value.
     * -- Then, using the "key" specified ( Example: user's uID), the "data" will be pushed using the set() method of Firebase
     * -- If "success" in pushing data, successCallback() is then called
     * -- Else, failureCallback() will be called, provided with the error details.
     * 
     * @example How To Use:
     * 
     * -- For instance, we create a category:
     * 
     * let refName = "category";
     * let DATA = {
     *      id: 'id',
     *      name: 'name',
     *      title: 'title',
     *      description: 'description'
     * }
     * let key = DATA.id;
     * 
     * 
     * create( DATA, key, refName, () => {
     *      console.log( "Category created" );
     * }, error => {
     *      console.log( "Unable to create category. Error: ", error );
     * });
     * 
     * *************************************************************/

    create( data, key , refName: string, successCallback: () => void , failureCallback: ( error ) => void ) {
         let ref = database().ref( refName );
         ref.child( key )
            .set( data )
            .then( () => {
                console.info("Successfully pushed data", data );
                successCallback();
            })
            .catch( error =>  failureCallback( error ) ); 
    }

     /*************************************************************
     * @Guide in using update() method:
     *    This method logs in user with the provided information
     * 
     * @Flow of update() method:
     * -- Data (that are retrieved using get() method) will be transfer to "data" variable.  
     * -- The "refName" value will depend on the path specified by the method used. ( Example: "users" )
     * -- Then, "ref" will get the Firebase reference, along with the "refName" value.
     * -- Then, using the "key" specified ( Example: user's uID), the "data" updates the old data using the update() method of Firebase
     * -- If "success", successCallback() is called.
     * -- If "failure", failureCallback is called, which returns an error.
     * 
     * @example How To Use: 
     * 
     * -- For instance, we update a category:
     * 
     * let refName = "category";
     * let DATA = {
     *      id: 'id',
     *      name: 'name',
     *      title: 'title',
     *      description: 'description'
     * }
     * let key = DATA.id;
     * 
     * 
     * update( DATA, key, refName, () => {
     *      console.log( "Category created" );
     * }, error => {
     *      console.log( "Unable to create category. Error: ", error );
     * });
     * 
     * *************************************************************/

    update( data, key, refName: string, successCallback: () => void, failureCallback: ( error ) => void ) {
         let ref = database().ref( refName );
         ref.child( key )
            .update( data )
            .then( () => {
                console.info( "Data updated!" );
                successCallback();
            })
            .catch( error => failureCallback( error ) );    
    }

    /*************************************************************
     * @Guide in using get() method:
     *    This method fetch data of as "single item" from the Firebase' database, by using the key item.    
     * 
     * @Flow of get() method:
     * -- The "key" gets it value depends on the method used ( Example: The user's uID )
     * -- The "refName" value will depend on the path specified by the method used. 
     *      ( Example: If method is createUser(), then the refName value will be "users" )
     * -- Then, "ref" will get the Firebase reference, along with the "refName" value.
     * -- Using the "key" specified, the data will then be fetched in the Firebase database, using the .once() method
     * -- If "success", retrieved data is then passed into the "data" variable.
     * -- Upon "success", successCallback() will be called, with "data" as returned value. 
     * -- Else, failureCallback() will be called, provided with the error details.
     * 
     * @example How To Use: 
     * 
     * -- For instance, we get data from a single category with an ID as "category001":
     * 
     * let key = "category001";
     * let refName = "category";
     * let DATA = {
     *      id: string,
     *      name: string,
     *      title: string,
     *      description: string
     * }
     * 
     * get( key, refName, data => {
     *      DATA = data;
     *      console.log( "Success! Data retrieved: ", DATA );
     * },error => {
     *      console.log( error );
     * });
     * 
     * *************************************************************/

    get( key, refName: string, successCallback: ( data ) => void, failureCallback: ( error ) => void ) {
         let ref = database().ref( refName );
         ref.child( key ).once( 'value' )
            .then( snapshot => {
                if( snapshot.exists() ) successCallback( snapshot.val() )
                else failureCallback( 'No retrieved value.' )
            })
            .catch( error => failureCallback( error ) );
    }



    list( refName: string, successCallback: ( data ) => void, failureCallback: ( error ) => void ){
         let ref = database().ref( refName );
         ref.once( "value")
            .then( snapshot => {
                if( snapshot.exists() ) successCallback( snapshot.val() )
                else failureCallback( 'No retrieved value.' )
            })
            .catch( error => failureCallback( error ) ) 
    }


    
    delete( key, refName: string, successCallback: () => void, failureCallback: ( error ) => void ){
        let ref = database().ref( refName );
        ref.child( key )
            .remove()
            .catch( error => failureCallback( error ) );
    }

    /****************************************************************
     * @Guide in using logout() method:
     *      This method logs out the user, then clears values of LocalStorage and "key" variable.
     * 
     * @Flow of logout() method:
     * -- If "success", users is logged out, value of LocalStorage and "key" is cleared.
     * 
     ************************************************************************/

    logout(){
        auth().signOut();
        localStorage.removeItem( "SESSION_ID" );
        this.key = null;
    }

    deleteUser( key , refName: string, successCallback: () => void, failureCallback: ( error ) => void ) {
        let currentUser = auth().currentUser;
        currentUser.delete()
            .then( () => {
                console.log( "Success delete account in auth" )
                this.delete( key, refName, () => {
                    localStorage.removeItem( 'SESSION_ID' );
                    console.log( "Account successfully deleted from Firebase database" );
                    successCallback();
                }, error => console.log( "Unable to delete from db. Error: ", error ) )
            })
            .catch( error => failureCallback( error ) );
    }

    /****************************************************************
     * @Guide in using resetUserPassword() method:
     *      This method resets user's password by sending reset configuration to the user's provided email.
     * 
     * -- If "sucess", Firebase will send password-reset configuration to email. Then, successCallback is called.
     * -- If "failure", failureCallback is called
     * 
     ************************************************************************/
    
    resetUserPassword( successCallback: () => void, failureCallback: ( error ) => void ){
        let currentUser = auth().currentUser;
        auth().sendPasswordResetEmail( currentUser.email )
              .then( () => successCallback() )
              .catch( error => failureCallback( error ) )
    }
    
    
}