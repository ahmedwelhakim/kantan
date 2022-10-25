import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}

  postData<T = Object>(url: string, data: Object) {
    return this.http.post<T>(url, data);
  }
  putData<T = Object>(url: string, data: Object) {
    return this.http.put<T>(url, data);
  }
  fetchData<T = Object>(url: string) {
    return this.http.get<T>(url);
  }
  patchData<T>(url: string, data: Object) {
    return this.http.patch(url, data);
  }
  deleteData<T>(url: string) {
    return this.http.delete(url);
  }
}
