import { Producto } from "./producto";
import { User } from "./user";

export class Movimiento {
    _id?: string;
    products:Producto[]=[];
    type:string;
    quantity: number;
    date:string;
    hora:string;
    user:User;
    cod?:string;
    observacion:string;
}
