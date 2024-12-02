import { Injectable } from '@angular/core';
import { API_URI } from '../../../config/config';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Comprobante } from '../models/comprobante';
@Injectable({
  providedIn: 'root'
})

export class ComprobanteService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<any[]> {
    return this.http.get(`${API_URI}/comprobantes`).pipe(
      map(response => response as any[])
    );
  }
  get(id: any): Observable<Comprobante> {
    return this.http.get<Comprobante>(`${API_URI}/comprobante/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(`${API_URI}/comprobante`, data);
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${API_URI}/comprobante/${id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${API_URI}/comprobante/${id}`);
  }
}
