
/****
 * @ USER_LOGIN_DATA inteface 
 * This interface is used for components that uses the user's account information
 ***/

export interface USER_LOGIN_DATA{
    email: string;
    password?: string;
    uid?: string;
}

/****
 * @ USER_DATA inteface 
 * This interface is used for components that uses the user's information
 ***/

export interface USER_DATA extends USER_LOGIN_DATA {
    name: string;
    mobile: string;
    address: string;
}

/****
 * @ POST_DATA inteface 
 * This interface is used for components that uses the forum's post information (while inherits category information)
 ***/

export interface POST_DATA extends USER_DATA{
    ID: string;
    content: string;
    created: number;
}