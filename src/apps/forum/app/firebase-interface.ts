
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
    photoUrl?: string;
}

/****
 * @ POST_DATA inteface 
 * This interface is used for components that uses the forum's post information (while inherits category information)
 ***/

export interface POST_DATA extends USER_DATA{
    content: string;
    created: number;
}

export interface COMMENT_DATA extends POST_DATA{
    content: string;
}

export interface RETURN_DATA {
    key : string,
    data : any;
}

export interface FILE_UPLOAD {
    file: any;
    blob?: any;
    ref?: string;
    base64?: string;
    name?: string;
}

export interface FILE_UPLOADED {
    url: string;
    ref: string;
}