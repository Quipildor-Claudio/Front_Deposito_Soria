import { Producto } from "./producto";
import { Service } from "./service";
import { User } from "./user";

export class Movimiento {
    _id?: string;
    products:Producto[]=[];
    type:string;
    quantity: number;
    date:string;
    hora:string;
    user:User;
    code?:string;
    service:Service;
    observacion:string;
}
