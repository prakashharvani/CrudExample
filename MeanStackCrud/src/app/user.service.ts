import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  url: string = "http://localhost:8080/api/user";

  constructor(private http: HttpClient) { }

  addUser(user: any) {
    return this.http.post(this.url, user, { headers: this.getHeaderFormData() });
  }

  login(em: String, pass: String) {
    let loginData = { email: em, password: pass };
    return this.http.post(this.url + '/login', loginData);
  }

  deleteUser(id) {
    return this.http.delete(this.url + '/delete/' + id,{ headers: this.getHeader() });
  }

  updateOneUser(id, data) {
    return this.http.put(this.url + '/update/' + id, data,{ headers: this.getHeaderFormData() });
  }

  getOneUser(id) {
    return this.http.get(this.url + '/' + id,{ headers: this.getHeader() });
  }

  getHeader() {
    let headers = new HttpHeaders();
    const token = JSON.parse(localStorage.getItem('token'));
    headers = headers.set('authorization', token);
    headers = headers.set('Content-Type', 'application/json');
    return headers;
  }


  getHeaderFormData() {
    let headers = new HttpHeaders();
    const token = JSON.parse(localStorage.getItem('token'));
    headers = headers.set('authorization', token);
    headers = headers.set('Accept','*/*')
    return headers;
  }
}
