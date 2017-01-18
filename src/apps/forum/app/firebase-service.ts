import { Injectable } from '@angular/core';
import { auth, database, storage } from 'firebase';
import * as firebase from 'firebase';
import { USER_DATA, USER_LOGIN_DATA, FILE_UPLOAD, FILE_UPLOADED, RETURN_DATA } from './firebase-interface';



@Injectable()
export class FireBaseService {
    data = <USER_LOGIN_DATA> {}
    key;
    _auth;
    _database;
    returnedValues = <RETURN_DATA> {}

    constructor() { 
        let firebaseConfig = {
            apiKey: "AIzaSyCV0ovi7fQaOmr8HuIdcf9AI4yEgElkEag",
            authDomain: "aonic-d1606.firebaseapp.com",
            databaseURL: "https://aonic-d1606.firebaseio.com",
            storageBucket: "aonic-d1606.appspot.com",
            messagingSenderId: "329419405941"
        };
        firebase.initializeApp(firebaseConfig);
        // this._auth = auth;
        // this._database = database;
    }

    /***********************************************************
     * @Guide in using isLoggedIn() method:
     *    This method checks if user is logged in using the SESSION_ID saved in LocalStorage.
     * 
     * @Flow of isLoggedIn() method:
     * -- If it has SESSION_ID, it returns the value as a successCallback,
     * -- Else, it returns an alert message using the failureCallback.
     * 
     * @example How To Use: 
     * 
     * isLoggedIn( key => {
     *      //User is logged in! SESSION_ID exist in LocalStorage!
     * }, error => {
     *      //An error happened.
     * });
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
     * -- If "success", it returns data from firebase, which is passed to parameter. UID will be
     * -- Then, user's uID will be saved to LocalStorage
     * -- If "failure", failureCallback is called with error.
     * 
     * @example How To Use: 
     * 
     * login( user, () => {
     *      //Login success!
     * },error=>{
     *      //An error happened.
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
     * -- If "success", data is pushed to Firebase database and account information in Firebase authentication
     * -- Then, user's uID will be saved to LocalStorage
     * -- If "failure", failureCallback is called with an error.
     *
     * @example How To Use:
     * 
     * let USER_DATA = {
     *      name: 'User'
     *      email: 'user@email.com',
     *      password: 'xxxxxx',
     *      mobile: '0922832482',
     *      address: '00 User, Address',
     * }
     * 
     * register ( USER_DATA, () => {
     *      //Registration success!
     * }, error => {
     *      //An error happened.
     * });
     * 
     * ***********************************************************/

    register( user: USER_DATA, refName: string, successCallback: () => void , failureCallback: ( error ) => void ) {
        console.info( "User Data: ", user.email, user.password )
        auth().createUserWithEmailAndPassword( user.email, user.password )
              .then( authData =>{
                  this.key = authData['uid']
                  delete user.password;
                  this.createUser( user, this.key, refName, () => {
                        successCallback();
                        localStorage.setItem( 'SESSION_ID', this.key );
                  }, failureCallback )
              })
              .catch( error =>  failureCallback( error ) );
    }

    /*************************************************************
     * @Guide in using createUser() method:
     *      This method is used to push user data from Firebase database.
     * 
     * @Flow of createUser() method:
     * -- If "success" in pushing data using the supplied parameters, successCallback() is then called.
     * -- Else, failureCallback() will be called, provided with the error details.
     * 
     * @example How To Use:
     * 
     * -- Refer to create() method. (Both method are the same but this method uses UID as the "key" value)
     * 
     * *************************************************************/

    createUser( data, key , refName: string, successCallback: () => void , failureCallback: ( error ) => void ) {
         let ref = database().ref( refName );
         ref.child( key )
            .set( data )
            .then( () => {
                console.info("Successfully pushed user data ", data );
                successCallback();
            })
            .catch( error =>  failureCallback( error ) ); 
    }

    /*************************************************************
     * @Guide in using createUser() method:
     *      This method is used to push user data from Firebase database.
     * 
     * @Flow of createUser() method:
     * -- If "success" in pushing data using the supplied parameters, successCallback() is then called.
     * -- Else, failureCallback() will be called, provided with the error details.
     * 
     * @example How To Use:
     * 
     * -- For instance, we create a post:
     * 
     * let refName = "post";
     * let DATA = {
     *      name: 'name',
     *      description: 'description'
     * }
     * 
     * createUser( DATA, refName, re => {
     *      //Data pushed success! "re" value is returned.
     * }, error => {
     *      //An error happened.
     * });
     * 
     * *************************************************************/

    create( data, refName: string, successCallback: ( data ) => void, failureCallback: ( error ) => void ) {
        let ref = database().ref( refName );
        this.returnedValues.key = ref.push().key;
        this.returnedValues.data = data
        ref.child( this.returnedValues.key )
           .set( data )
           .then( () => {
               console.info( "Successfully pushed data ", data );
               successCallback( this.returnedValues );
           } )
           .catch( error =>  failureCallback( error ) ); 
    }

     /*************************************************************
     * @Guide in using update() method:
     *    This method logs in user with the provided information
     * 
     * @Flow of update() method:
     * -- If "success", data is then updated and successCallback() is called.
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
     * update( DATA, key, refName, () => {
     *      //Update success!
     * }, error => {
     *      //An error happened
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
     * -- If "success", retrieved data will be returned as successCallback.
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
     *      //Data of an item retrieved!
     * },error => {
     *      //An error happened
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

    /****************************************************************
     * @Guide in using list() method:
     *      This method deletes the data in database.
     * 
     * @Flow of list() method:
     * -- If "success", successCallback is called with "data" as returned value.
     * -- If "failure", failureCallback is called with error details. 
     * 
     * @example How to Use:
     * 
     * list( "post", data => {
     *     //List of data retrieved.
     * }, error => {
     *     //An error happened 
     * });
     * 
     ************************************************************************/

    list( refName: string, successCallback: ( data ) => void, failureCallback: ( error ) => void ){
         let ref = database().ref( refName );
         ref.once( "value" )
            .then( snapshot => {
                if( snapshot.exists() ) successCallback( snapshot.val() )
                else failureCallback( 'No retrieved value.' )
            })
            .catch( error => failureCallback( error ) ) 
    }

    /****************************************************************
     * @Guide in using upload() method:
     *      This method uploads file(s), like images, in Firebase storage.
     * 
     * @Flow of list() method:
     * -- If "success", successCallback is called with "uploaded" as returned value.
     * -- If "failure", failureCallback is called with error details. 
     * 
     * @example How to Use:
     * 
     * let photoData = {
     *      file: file,
     *      path: "images/" + Date.now() + "/" + file.name
     *  }
     * 
     * upload( photoData, uploaded => {
     *     //Photo uploaded...
     * }, error => {
     *     //An error happened 
     * });
     * 
     ************************************************************************/

    upload( data: FILE_UPLOAD, successCallback: (uploaded:FILE_UPLOADED) => void, failureCallback: (error:string) => void, progressCallback?: ( percent: number ) => void ) {
        if ( data.ref === void 0 ) data.ref = Date.now() + '/' + data.file.name;

        let file = data.file;
        if ( data.blob !== void 0 ) file = data.blob;
        else if ( data.base64 !== void 0 ) file = this.b64toBlob( data.base64, data.base64 );

        console.log('file:', file);
        let task = storage().ref( data.ref )
        .put( file, {contentType: data.file.type});

        task.then( snapshot => {
        storage().ref( data.ref ).getDownloadURL().then( url => {
            let uploaded = { url: url, ref: data.ref };
            successCallback( uploaded );
        });
        })
        .catch( error => failureCallback( error.message ) );

        task.on( firebase.storage.TaskEvent.STATE_CHANGED, snapshot => {
        let percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        progressCallback( percent );
        });
    }

  
    b64toBlob(b64Data, contentType='', sliceSize=512) {
        var byteCharacters = atob(b64Data);
        var byteArrays = [];
        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);
        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        var byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
        }
        var blob = new Blob(byteArrays, {type: contentType});
        return blob;
    }

    deletePhoto( refName: string, successCallback: () => void, failureCallback: (error:string) => void ) {
        let ref = storage().ref().child( refName )
        ref.delete()
        .then( successCallback )
        .catch( error => failureCallback( error.message ) );
    }


    /****************************************************************
     * @Guide in using delete() method:
     *      This method deletes the data in database.
     * 
     * @Flow of delete() method:
     * -- If "success", data of the specified "key" will be deleted.
     * -- If "failure", failureCallback is called with error details. 
     * 
     * @example How to Use:
     * 
     * let key = "category001";
     * 
     * delete( key, "category", () => {
     *     //Data deleted
     * }, error => {
     *     //An error happened 
     * });
     * 
     ************************************************************************/
    
    delete( key, refName: string, successCallback: () => void, failureCallback: ( error ) => void ){
        let ref = database().ref( refName );
        ref.child( key )
            .remove()
            .then( () => successCallback() )
            .catch( error => failureCallback( error ) );
    }

    /****************************************************************
     * @Guide in using destroy() method:
     *      This method deletes all of the data in a category item.
     * 
     * @Flow of destroy() method:
     * -- If "success", data of the specified "key" will be deleted.
     * -- If "failure", failureCallback is called with error details. 
     * 
     * @example How to Use:
     * 
     * destroy( "category", () => {
     *     //All data deleted
     * }, error => {
     *     //An error happened 
     * });
     * 
     ************************************************************************/

    destroy( refName: string, successCallback: () => void, failureCallback: ( error ) => void ){
        let ref = database().ref( refName );
        ref.remove()
            .then( () => successCallback() )
            .catch( error => failureCallback( error ) );
    }

    /****************************************************************
     * @Guide in using logout() method:
     *      This method logs out the user, then clears values of LocalStorage and "key" variable.
     * 
     * @Flow of logout() method:
     * -- If "success", users is logged out, value of LocalStorage and "key" is cleared.
     * 
     * @example How to Use:
     * 
     * logout(){
     *      //User logged out!
     * }
     * 
     ************************************************************************/

    logout( callback? : () => void ){
        auth().signOut();
        localStorage.removeItem( "SESSION_ID" );
        this.key = null;
        if(callback) callback();
    }

    //This method may provide error, since it needs the user to be re-authenticated 
    //before it deletes its data from Firebase authentication

    resign( key , refName: string, successCallback: () => void, failureCallback: ( error ) => void ) {
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
     * -- If "sucess", Firebase will send password-reset configuration to email, and successCallback is called.
     * -- If "failure", failureCallback is called.
     * 
     * @example How To Use:
     * 
     * resetUserPassword( () => {
     *      //Reset configuration sent to email.
     * }, error => {
     *      /An error happened.
     * } )
     * 
     ************************************************************************/
    
    resetUserPassword( successCallback: () => void, failureCallback: ( error ) => void ){
        let currentUser = auth().currentUser;
        auth().sendPasswordResetEmail( currentUser.email )
              .then( () => successCallback() )
              .catch( error => failureCallback( error ) )
    }
    
    
}