import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private registerUrl = 'http://localhost:3000/register';
  private loginUrl = 'http://localhost:3000/login';
  private createPostUrl = 'http://localhost:3000/create-post';
  private apiUrl = 'http://localhost:3000/posts';
  
  private dbUrl = 'http://localhost:5984/posts'; // CouchDB URL
  private couchDBUsername = 'hyrumsapurco27';  // Change to your CouchDB username
  private couchDBPassword = 'july272002'; // Change to your CouchDB password


  // private registerUrl = 'http://backend:3000/register';
  // private loginUrl = 'http://backend:3000/login';
  // private createPostUrl = 'http://backend:3000/create-post';
  // private apiUrl = 'http://backend:3000/posts';
  
  // private dbUrl = 'http://couchdb:5984/posts'; // CouchDB URL
  // private couchDBUsername = 'hyrumsapurco27';  // Change to your CouchDB username
  // private couchDBPassword = 'july272002'; // Change to your CouchDB password
  
  

  constructor(private http: HttpClient, private router: Router) {}

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: 'Basic ' + btoa(`${this.couchDBUsername}:${this.couchDBPassword}`),
      'Content-Type': 'application/json'
    });
  }

  register(user: {  username: string; password: string }): Observable<any> {
    return this.http.post(this.registerUrl, user);
  }


  login(user: { username: string; password: string }): Observable<any> {
    return this.http.post<any>(this.loginUrl, user).pipe(
      tap(response => {
        if (response && response.userID && response.fullname) { // Ensure fullname is included
          localStorage.setItem('token', response.token);
          localStorage.setItem('userID', response.userID);
          localStorage.setItem('fullname', response.fullname); // ✅ Store fullname
          console.log('UserID and Fullname stored:', response.userID, response.fullname);
        } else {
          console.error('Login response missing userID or fullname');
        }
      })
    );
  }


  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
  

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userID');
    localStorage.removeItem('fullname'); // ✅ Remove fullname
    this.router.navigateByUrl('/login');
  }
  

  createPost(post: { title: string; content: string }) {
    const userID = localStorage.getItem('userID'); // Retrieve userID
    const fullname = localStorage.getItem('fullname');
  
    if (!userID) {
      console.error("User not logged in - userID missing from localStorage");
      alert("User not logged in. Please log in again."); // Show error message
      throw new Error("User not logged in");
    }
  
    console.log("UserID found:", userID); // Debugging
  
    const postData = { ...post, userID, fullname }; // Include userID
  
    return this.http.post(this.createPostUrl, postData);
  }



  getAllPosts(): Observable<any> {
    return this.http.get<any>(`${this.dbUrl}/_all_docs?include_docs=true`, {
      headers: this.getAuthHeaders()
    });
  }
  
  
//x
  getPosts(): Observable<any> {
    const userID = localStorage.getItem('userID'); // Get logged-in user ID
  
    if (!userID) {
      console.error("User not logged in - userID missing from localStorage");
      alert("User not logged in. Please log in again."); 
      throw new Error("User not logged in");
    }
  
    return this.http.get<any>(`http://localhost:3000/posts/${userID}`);
  }

  
  

  deletePost(id: string, rev: string): Observable<any> {
    return this.http.delete(`${this.dbUrl}/${id}?rev=${rev}`, {
      headers: this.getAuthHeaders()
    });
  }

  // x
  updatePost(post: { _id: string; _rev: string; title: string; content: string; timestamp: string }) {
    return this.http.put<{ok: boolean, id: string, rev: string}>(`${this.dbUrl}/${post._id}`, post, {
      headers: new HttpHeaders({
        Authorization: 'Basic ' + btoa(`${this.couchDBUsername}:${this.couchDBPassword}`)
      })
    });
  }
}
