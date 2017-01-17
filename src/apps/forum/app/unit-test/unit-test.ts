import { Injectable } from '@angular/core';
import { FireBaseService } from '../firebase-service';
import { USER_DATA, POST_DATA } from '../firebase-interface';
import { Test as test } from './test';

@Injectable()

export class FireBaseServiceTest {

    key;
    userIDs = [];

    constructor( private fireService: FireBaseService ) { }

    test( ){ 
        this.initializeFiftyUsers();
        this.testUsers(0, ()=>{

        });
       
    }


    initializeFiftyUsers(){
        for( let ctr = 1; ctr <=50; ctr ++ ){
            let id = 'username' + ctr;
            this.userIDs.push(id);
        }
        console.info( "Array length: ", this.userIDs.length );
    }

    testUsers( index: number, doneCallback ){

        console.log('Index:', index);
        let len = this.userIDs.length;
        if ( index < len ){
            // If user is from every 4th and every 3rd
            if( index !=0 && index % 4 === 0 && index % 3 === 0){
                console.log("Counter " + index);
                this.updateUserTest( this.userIDs[index], () => {
                    this.deleteUserTest( this.userIDs[index], () => {
                        index++;
                        this.testUsers( index, doneCallback );
                    });
                });
            }
            // If user is from every 4th only
            else if( index !=0 && index % 4 === 0 ){
                console.log("Counter " + index);
                this.updateUserTest( this.userIDs[index], () => {
                    index++;
                    this.testUsers( index, doneCallback );
                });
            }
            // If user is from every 3rd only
            else if(  index !=0 &&  index % 3 === 0 ){
                console.log("Counter " + index);
                console.log("Index " + index);
                this.deleteUserTest( this.userIDs[index], () => {
                    this.userIDs.slice(index, 1);
                    index++;
                    this.testUsers( index, doneCallback );
                });
            } 
            // If user did not met any of the condition(s) above..
            else {
                this.register(this.userIDs[index], () => {    
                    this.logout( () =>{   
                             index++;            
                             this.testUsers( index, doneCallback );
                    });
                });
            }
        } 
        else {
            doneCallback();
        }
    }

    /**
     * Unit Test Module for Users
     */
    deleteAll( index = 0, callback ){
        if(index < this.userIDs.length){
             this.deleteUserTest( this.userIDs[index], () => {
                index++;
                this.userIDs.slice(index, 1);
                this.deleteAll( index, callback );
             });
        } else{
            callback();
        }
    }

    createUserTest( id, callback: (key) => void ){
        this.register( id, () => {
            this.login( id, () => {
                this.checkLogin( key =>{                
                    callback( key );
                });
            });
         });
    }

    // addUserPhotoTest(id, callback){
    //     this.update( id, res, 'users', () =>{
    //         this.resign( res, 'users', () =>{
    //             callback();
    //         })
    //     })
    // }

    updateUserTest(id, callback){
        this.createUserTest( id, key => {
            this.update( id, key, 'test/users', () => {
                callback();
            });
        });
    }

    deleteUserTest(id, callback){
        this.createUserTest( id, key => {
            this.resign( key, 'test/users', () => {
                callback();
            });
        });
        
    }
    

    /**
     * FireBaseService Module
     * */
    register( id, callback? ) {
        let data = {
            name: id,
            mobile: id,
            address: id,
            email: id + "@gmail.com",
            password: id
        }
        this.fireService.register( data, "test/users", () => {
            callback();
            test.passed( "Register success! on email " + data.email );
        }, error => {
            test.failed( "Register failed! on email " + data.email);
            callback();
        });
    }

    login( id, callback ){
        let data = {
            email: id + "@gmail.com",
            password: id
        }
        this.fireService.login( data, () => {
            callback();
            test.passed( "Log-in success! on email " + data.email );
        }, error => {
            test.failed( "Log-in failed! on email " + data.email );
            callback();
        });
    }

    checkLogin( callback ){
        this.fireService.isLoggedIn( key => {
            callback( key );
            test.passed( "Check Login success! UID: " + key );
            
        }, error => {
            test.failed( "Check Login failed!" );
            callback();
        } );
    }

    update( id, key, refName, callback ){
        let data = {
            name: id + 'name',
            mobile: id + 'mobile',
            address: id + 'address',
            email: id + "@gmail.com",
            password: id
        }
        this.fireService.update( data, key, refName, () => {
            callback();
            test.passed( "Update success! on email " + data.email );
        }, error => {
            test.failed( "Update failed! on email " + data.email );
            callback();
        });
    }

    resign( key, refName, callback ){
        this.fireService.resign( key, refName, () => {
            callback();
            test.passed( "Account delete success! on UID " + key );
        }, error => {
            test.failed( "Account delete failed!" );
            callback();
        });
    }

    logout( callback ){
        this.fireService.logout(() => {
            test.passed( "User logout success!" );
            callback();
        });
    }

    get( key, refName, callback ){
        this.fireService.get( key, refName, data => {
            test.passed( "Get item data success!" + JSON.stringify(data) );
            callback();
        }, error => {
            test.failed( "Get item data failed!" );
            callback();
        });
    }

    list( refName, callback ){
        this.fireService.list( refName, data => {
            test.passed( "Get list success! on category (" + refName + "). Data: " + JSON.stringify(data) );
            callback( data );
        }, error => {
            test.failed( "Get list failed! on category: " + refName );
            callback();
        });
    }
}