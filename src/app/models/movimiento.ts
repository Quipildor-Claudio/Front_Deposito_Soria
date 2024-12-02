import { Comprobante } from "./comprobante";
import { Producto } from "./producto";
import { Service } from "./service";
import { User } from "./user";

export class Movimiento {
    _id?: string;
    comprobantes: Comprobante[] = [];
    type: string;
    date: string;
    hora: string;
    user: User;
    code?: string;
    service: Service;
    observacion: string;
}
