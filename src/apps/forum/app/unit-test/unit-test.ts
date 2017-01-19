import { Injectable } from '@angular/core';
import { FireBaseService } from '../firebase-service';
import { USER_DATA, POST_DATA } from '../firebase-interface';
import { Test as test } from './test';

@Injectable()

export class FireBaseServiceTest {

    key;
    userIDs = [];
    data: USER_DATA = <USER_DATA> {}

    constructor( private fireService: FireBaseService ) { }

    test( ){ 
        // this.initializeFiftyUsers();
        // this.testUsers(0, ()=>{
        //     console.log( "Test finished..." )
        // });
        this.addUserPhotoTest( "username40", () => {
        })
    }

    initializeFiftyUsers(){
        for( let ctr = 1; ctr <=12; ctr ++ ){
            let id = 'username' + ctr;
            this.userIDs.push(id);
        }
        console.info( "Array length: ", this.userIDs.length );
    }

    testUsers( index: number, doneCallback ){

        console.log('Index:', index);
        let len = this.userIDs.length - 1;
        if ( index < len ){
            // If user is from every 4th and every 3rd
            if( index !=0 && index % 3 === 0 && index % 2 === 0){
                console.log("Counter " + index);
                this.createUserTest( this.userIDs[index], key => {
                    this.update( this.userIDs[index], key, 'test/users', () => {
                        this.resign( key, 'test/users', () => {
                            index++;
                            this.testUsers( index, doneCallback );
                        });
                    });   
                });
            }
            // If user is from every 10th only
            else if( index !=0 && index % 4 === 0 ){
                console.log("Counter " + index);
                this.addUserPhotoTest( this.userIDs[index], () => {
                    this.logout( () => {
                        index++;
                        this.testUsers( index, doneCallback );
                    });
                });
            }
            // If user is from every 4th only
            else if( index !=0 && index % 3 === 0 ){
                console.log("Counter " + index);
                this.updateUserTest( this.userIDs[index], () => {
                    this.logout( () => {
                        index++;
                        this.testUsers( index, doneCallback );
                    });
                });
            }
            // If user is from every 3rd only
            else if( index !=0 &&  index % 2 === 0 ){
                console.log("Counter " + index);
                this.deleteUserTest( this.userIDs[index], () => {
                    // this.userIDs.slice(index, 1);
                    index++;
                    this.testUsers( index, doneCallback );
                });
            } 
            // If user did not met any of the condition(s) above..
            else {
                this.register( this.userIDs[index], () => {    
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
                this.checkLogin( id, key =>{                
                    callback( key );
                });
            })
         });
    }

    addUserPhotoTest( id, callback ){
        this.addPhoto( uploaded => {
            this.register( id,  () => {
                callback();
            }, uploaded )
        })
    }

    updateUserTest( id, callback ){
        this.createUserTest( id, key => {
            this.update( id, key, 'test/users', () => {
                callback();
            });
        });
    }

    deleteUserTest( id, callback) {
        this.createUserTest( id, key => {
            this.resign( key, 'test/users', () => {
                callback();
            });
        });
        
    }
    

    /**
     * FireBaseService Module
     * */
    register( id,  callback, uploaded?) {
            this.data['name'] = id;
            this.data['mobile'] = id;
            this.data['address'] = id;
            this.data['email'] = id + "@gmail.com";
            this.data['password'] = id;
            if( uploaded ){
                this.data['photoUrl'] = uploaded.url;
                this.data['photoRef'] = uploaded.ref;
            }
            // else {
            //     this.data['photoUrl'] = "";
            //     this.data['photoRef'] = "";
            // }
            
        this.fireService.register( this.data, "test/users", () => {
            if( callback )callback();
            test.passed( "Register success! on email " + this.data.email );
        }, error => {
            test.failed( "Register failed! on email " + this.data.email + " error: " + error);
            if( callback )callback();
            else console.log("No callback")
        });
    }

    login( id, callback ){
            this.data['email'] = id + "@gmail.com";
            this.data['password'] = id;

        this.fireService.login( this.data, () => {
            callback();
            test.passed( "Log-in success! on email " + this.data.email );
        }, error => {
            test.failed( "Log-in failed! on email " + this.data.email );
            callback();
        });
    }

    checkLogin( id, callback ){
        this.fireService.isLoggedIn( key => {
            callback( key );
            test.passed( "Check Login success! on ID: " + id + " UID: " + key );
        }, error => {
            test.failed( "Check Login failed!" );
            callback();
        } );
    }

    update( id, key, refName, callback ){
        this.data['name'] = id + "name";
        this.data['mobile'] = id + "mobile";
        this.data['address'] = id + "address";

        this.fireService.update( this.data, key, refName, () => {
            callback();
            test.passed( "Update success! on name " + this.data.name );
        }, error => {
            test.failed( "Update failed! on name " + this.data.name );
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

    addPhoto( callback ){
        let data = {
            file: 'assets/image/user-profile.png',
            path: "images/" + Date.now() + "/user-profile.png"
        }
        console.log( "File: " + JSON.stringify(data) )
        this.fireService.upload( data, uploaded => {
            test.passed( "Photo upload passed: " + JSON.stringify( uploaded.url ) );
            callback( uploaded );
        }, error => {
            test.failed( "Photo upload failed: " );
            callback();
        });
    }
}