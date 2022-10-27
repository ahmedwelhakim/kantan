import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}

  postData<T = Object>(url: string, data: Object) {
    return this.http.post<T>(environment.apiUrl + url, data);
  }
  putData<T = Object>(url: string, data: Object) {
    return this.http.put<T>(environment.apiUrl + url, data);
  }
  fetchData<T = Object>(url: string) {
    return this.http.get<T>(environment.apiUrl + url);
  }
  patchData<T>(url: string, data: Object) {
    return this.http.patch(environment.apiUrl + url, data);
  }
  deleteData<T>(url: string) {
    return this.http.delete(environment.apiUrl + url);
  }
}
