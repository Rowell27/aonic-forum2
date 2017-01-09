import { Injectable } from '@angular/core';
import { FireBaseService } from '../firebase-service';
import { USER_DATA, POST_DATA } from '../firebase-interface';
import { Test as test } from './test';

@Injectable()

export class FireBaseServiceTest {

    key;

    constructor( private fireService: FireBaseService ) {
        // console.log(  )
    }

    test( callback ){
        let id = 'user01';
        this.register( id, re => {
            this.login( id, re => {
                this.checkLogin( re => {
                    this.key = re
                    this.get( this.key, "users", re => {
                        this.update( id, this.key, "users", re => {
                            this.logout( re => {
                                this.login( id, re => {
                                    this.resign( this.key, "users", re => {
                                        callback()
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    }


    //FireBaseService Module

    register( id, callback ) {
        let data = {
            name: id,
            mobile: id,
            address: id,
            email: id + "@gmail.com",
            password: id
        }
        this.fireService.register( data, () => {
            test.passed( "Register success!" );
            callback();
        }, error => {
            test.failed( "Register failed!" );
            callback();
        });
    }

    login( id, callback ){
        let data = {
            email: id + "gmail.com",
            password: id
        }
        this.fireService.login( data, () => {
            test.passed( "Log-in success!" );
            callback();
        }, error => {
            test.failed( "Log-in failed!" );
            callback();
        });
    }

    checkLogin( callback ){
        this.fireService.isLoggedIn( key => {
            test.passed( "Check Login success!" );
            callback( key );
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
            test.passed( "Update success!" );
            callback();
        }, error => {
            test.failed( "Update failed!" );
            callback();
        } );
    }

    resign( key, refName, callback ){
        this.fireService.resign( key, refName, () => {
            test.passed( "Account delete success!" );
            callback();
        }, error => {
            test.failed( "Account delete failed!" );
            callback();
        } )
    }

    logout( callback ){
        this.fireService.logout( callback );
    }

    get( key, refName, callback ){
        this.fireService.get( key, refName, data => {
            test.passed( "Get item data success!" + data );
            callback();
        }, error => {
            test.failed( "Get item data failed!" );
            callback();
        } );
    }
}