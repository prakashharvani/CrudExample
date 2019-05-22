import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  addForm: FormGroup;
  filedata: any;
  filedata2: any;
  url: any;
  submitted: Boolean = false;
  constructor(private fb: FormBuilder, private router: Router, private userservice: UserService, private Toastr: ToastrService) { }

  ngOnInit() {
    this.addForm = this.fb.group({
      email: ['', Validators.required],
      mobileNumber: ['',Validators.required],
      password: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: ['', Validators.required],
      image: ['', Validators.required],
      pdf: ['', Validators.required]
    });
  }
  onSubmit() {
    this.submitted = true;
    if (this.addForm.invalid) {
      return;
    } else {

      const fd = new FormData();
      fd.append('firstName', this.addForm.value.firstName);
      fd.append('lastName', this.addForm.value.lastName);
      fd.append('email', this.addForm.value.email);
      fd.append('mobileNumber', this.addForm.value.mobileNumber);
      fd.append('password', this.addForm.value.password);
      fd.append('gender', this.addForm.value.gender);
      fd.append('image', this.filedata);
      fd.append('pdf', this.filedata2);


      this.userservice.addUser(fd)
        .subscribe((data) => {
          if (data['status'] == 200) {
            this.router.navigate(['list-user']);
          } else {
            this.Toastr.error(data['message']);
          }
        });
    }

  }
  get f() {
    return this.addForm.controls;
  }
  onFileChange(e) {

    if (e.target.files[0].name.match(/\.(png|jpeg|jpg)$/)) {
      this.filedata = e.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(this.filedata);

      reader.onload = (event) => {
        this.url = reader.result;
      }
    } else {
      this.Toastr.error('Only Image is Allow');
    }

  }

  onFileChanges(e) {
    if (e.target.files[0].name.match(/\.(pdf)$/)) {
      this.filedata2 = e.target.files[0];
    } else {
      this.Toastr.error('Only Pdf is Allow');
    }
  }

  backToList() {
    this.router.navigate(['list-user']);
  }
}
