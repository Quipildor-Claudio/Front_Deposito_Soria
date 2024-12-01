import { Injectable } from '@angular/core';
import { API_URI } from '../../../config/config';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Service } from '../models/service';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<any[]> {
    return this.http.get(`${API_URI}/services`).pipe(
      map(response => response as any[])
    );
  }
  get(id: any): Observable<Service> {
    return this.http.get<Service>(`${API_URI}/service/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(`${API_URI}/service`, data);
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${API_URI}/service/${id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${API_URI}/service/${id}`);
  }
}
