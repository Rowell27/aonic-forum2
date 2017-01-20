import { Injectable } from '@angular/core';
import { FireBaseService } from '../firebase-service';
import { USER_DATA, POST_DATA } from '../firebase-interface';
import { Test as test } from './test';

@Injectable()

export class FireBaseServiceTest {

    key;
    dataIDs = [];
    userData: USER_DATA = <USER_DATA> {};

    constructor( private fireService: FireBaseService ) { 
    }

    userUnitTest( ){ 
        this.initializeFiftyIDs();
        this.testUsers(0, ()=>{
            console.log( "Test finished..." )
        });
        // this.addUserPhotoTest( "username1", () => console.log("Ok!") )
    }

    postUnitTest(){
        this.initializeFiftyIDs();
        this.testPosts(0, () => {
            console.log( "Test finished..." )
        });
    }

    initializeFiftyIDs(){
        for( let ctr = 1; ctr <=5; ctr ++ ){
            let id = 'username' + ctr;
            this.dataIDs.push(id);
        }
        console.info( "Array length: ", this.dataIDs.length );
    }

    /**
     * Unit Test for USERS 
     */
    testUsers( index: number, doneCallback ){

        console.log('Index:', index);
        let len = this.dataIDs.length - 1;
        if ( index <= len ){
            // If user is from every 4th and every 3rd
            if( index !=0 && index % 3 === 0 && index % 2 === 0){
                console.log("Counter " + index);
                this.createUserTest( this.dataIDs[index], key => {
                    this.update( this.dataIDs[index], key, 'test/users', () => {
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
                this.addUserPhotoTest( this.dataIDs[index], () => {
                    this.logout( () => {
                        index++;
                        this.testUsers( index, doneCallback );
                    });
                });
            }
            // If user is from every 4th only
            else if( index !=0 && index % 3 === 0 ){
                console.log("Counter " + index);
                this.createUserTest( this.dataIDs[index], key => {
                    this.update( this.dataIDs[index], key, 'test/users', () => {
                        this.logout( () => {
                            index++;
                            this.testUsers( index, doneCallback );
                        });
                    });   
                });
            }
            // If user is from every 3rd only
            else if( index !=0 &&  index % 2 === 0 ){
                console.log("Counter " + index);
                this.createUserTest( this.dataIDs[index], key => {
                    this.resign( key, 'test/users', () => {
                        index++;
                        this.testUsers( index, doneCallback );
                    });
                });
            } 
            // If user did not met any of the condition(s) above..
            else {
                this.register( this.dataIDs[index], () => {    
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
     * Unit Test for POST
     */
    testPosts( index: number, doneCallback ){

        let len = this.dataIDs.length - 1;
        if ( index <= len ){
            
            if( index !=0 && index % 2 === 0 && index % 3 === 0 ) {
                this.createPostTest( this.dataIDs[index], data => {
                    this.updatePost( this.dataIDs[index], data.key, 'test/posts', () => {
                        this.delete( this.dataIDs[index], data.key, "test/posts", () => {
                            this.logout( () =>{   
                                index++;            
                                this.testPosts( index, doneCallback );
                            });
                        });
                    });   
                });
            } else if( index !=0 && index % 3 === 0){
                console.log("Counter " + index);
                this.createPostTest( this.dataIDs[index], data => {
                    this.updatePost( this.dataIDs[index], data.key, "test/posts", () => {
                        this.logout( () =>{   
                            index++;            
                            this.testPosts( index, doneCallback );
                        });
                    });
                });
            } else  if( index !=0 && index % 2 === 0) {
                this.createPostTest( this.dataIDs[index], data => {
                    this.delete( this.dataIDs[index], data.key, "test/posts", () => {
                        this.logout( () =>{   
                            index++;            
                            this.testPosts( index, doneCallback );
                        });
                    });
                });
            } else{
                this.createPostTest( this.dataIDs[index], key => {
                    this.logout( () =>{   
                        index++;            
                        this.testPosts( index, doneCallback );
                    });
                });
            }
            
        } else{
            doneCallback();
        }

    }


    /**
     * Unit Test Module for Users
     */

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

    createPostTest( id, callback ) {
        this.createUserTest( id, key => {
            let data = {
                content: id + "'s post.",
                created: Date.now(),
                uid: key,
            }
            this.create( data, "test/post", data => {
                callback(data);
            });
        });
    }


    /**
     * FireBaseService Module
     * */
    register( id, callback, uploaded?) {
            this.userData['name'] = id;
            this.userData['mobile'] = id;
            this.userData['address'] = id;
            this.userData['email'] = id + "@gmail.com";
            this.userData['password'] = id;
            if( uploaded ){
                this.userData['photoUrl'] = uploaded.url;
                this.userData['photoRef'] = uploaded.ref;
            }
            
        this.fireService.register( this.userData, "test/users", () => {
            if( callback )callback();
            test.passed( "Register success! on email " + this.userData.email );
        }, error => {
            test.failed( "Register failed! on email " + this.userData.email + " error: " + error);
            if( callback )callback();
            else console.log("No callback")
        });
    }

    login( id, callback ){
            this.userData['email'] = id + "@gmail.com";
            this.userData['password'] = id;

        this.fireService.login( this.userData, () => {
            callback();
            test.passed( "Log-in success! on email " + this.userData.email );
        }, error => {
            test.failed( "Log-in failed! on email " + this.userData.email );
            callback();
        });
    }

    checkLogin( id, callback ){
        this.fireService.isLoggedIn( key => {
            test.passed( "Check Login success! on ID: " + id + " UID: " + key );
            callback( key );
        }, error => {
            test.failed( "Check Login failed!" );
            callback();
        });
    }

    

    update( id, key, refName, callback ){
        this.userData['name'] = id + "name";
        this.userData['mobile'] = id + "mobile";
        this.userData['address'] = id + "address";

        this.fireService.update( this.userData, key, refName, () => {
            callback();
            test.passed( "Update success! on name " + this.userData.name );
        }, error => {
            test.failed( "Update failed! on name " + this.userData.name );
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

    delete( id, key, refName, callback ){
        this.fireService.delete( key, refName, () => {
            test.passed( "Delete success on post/comment" + id )
        }, error => {
            test.passed( "Delete success on post/comment" + id )
        });
    }

    create( data, refName, callback ){
        this.fireService.create( data, refName, data => {
            test.passed( "Create data success!" );
            callback(data);
        }, error => {
            test.failed( "Create data failed!" );
            callback();
        });
    }

    updatePost( id, key, refName, callback ){
        let data = {
            content: id + " updated",
            created: Date.now(),
            uid: key,
        }

        this.fireService.update( data, key, refName, () => {
            test.passed( "Update data success! on : " + id );
            callback(data);
        }, error => {
            test.failed( "Update data failed! on : " + id );
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