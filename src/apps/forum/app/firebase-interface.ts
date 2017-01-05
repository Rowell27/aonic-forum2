
/****
 * @ USER_DATA inteface 
 * This interface is used for components that uses the user's information
 ***/
export interface USER_LOGIN_DATA{
    email: string;
    password?: string;
    uid?: string;
}

export interface USER_DATA extends USER_LOGIN_DATA {
    name: string;
    mobile: string;
    address: string;
}

/****
 * @ CATEGORY_DATA inteface 
 * This interface is used for components that uses the forum's category information
 ***/

export interface CATEGORY_DATA {
    ID: string;
    name: string;
    title: string;
    description: string;
}

/****
 * @ CATEGORY_DATA inteface 
 * This interface is used for components that uses the forum's post information (while inherits category information)
 ***/

export interface POST_DATA extends CATEGORY_DATA {
    ID: string;
    name: string;
    title: string;
    description: string;
}