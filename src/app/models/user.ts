import { Role } from "./role";
import { Service } from "./service";

export class User {
    _id:string;
    name:string;
    username:string;
    password:string;
    email:string;
    isActive:boolean;
    service:Service;
    role:Role;

}
