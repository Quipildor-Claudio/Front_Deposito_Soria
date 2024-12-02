import { Injectable } from '@angular/core';
import { API_URI } from '../../../config/config';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../models/producto';
@Injectable({
  providedIn: 'root'
})


export class ProductoService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<any[]> {
    return this.http.get(`${API_URI}/productos`).pipe(
      map(response => response as any[])
    );
  }
  get(id: any): Observable<Producto> {
    return this.http.get<Producto>(`${API_URI}/producto/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(`${API_URI}/producto`, data);
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${API_URI}/producto/${id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${API_URI}/producto/${id}`);
  }
  searchProductsNom(nom: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${API_URI}/searchnom?name=${nom}`);
  }
  actualizarStock(comprobantes: any[],type:string): Observable<any> {
    const payload = { comprobantes, type };
    return this.http.post(`${API_URI}/actualizar-stock`, payload);
  }
}
