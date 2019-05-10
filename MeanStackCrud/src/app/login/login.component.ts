import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  submitted: Boolean = false;
  invalidLogin: Boolean = false;

  constructor(private formBuilder: FormBuilder, private router: Router, private userservice: UserService, private Toastr: ToastrService) { }

  ngOnInit() {

    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

  }
  get f() {
    return this.loginForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return
    }
    else {
      var em = this.loginForm.value.email;
      var pass = this.loginForm.value.password;

      this.userservice.login(em, pass).subscribe(data => {
        if (data['status'] == 200) {
          localStorage.removeItem('token');

          localStorage.setItem("token", JSON.stringify(data['data']));

          this.router.navigate(['list-user']);
        }
        else {
          this.Toastr.error(data['message']);
        }
      })
    }
  }

}
