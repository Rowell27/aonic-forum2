export class Test {

    static ctr: number = 0;

    static passed( msg ) {
        this.ctr +=1;
        console.info( 'PASS ' + this.ctr + ' : ' + msg );
    }
    static failed( msg ) {
        this.ctr +=1;
        console.error( 'FAIL ' + this.ctr + ' : ' + msg );
    }
}