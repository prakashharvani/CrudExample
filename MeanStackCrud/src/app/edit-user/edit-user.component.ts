import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { ToastrService } from 'ngx-toastr';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  result: any;
  url: any;
  submitted: Boolean = false;
  editForm: FormGroup;
  filedata: any;
  filedata2: any;
  userId: any;
  imgUrl: any = 'http://localhost:8080/';
  arr: any;
  constructor(private fb: FormBuilder, private router: Router, private userservice: UserService, private Toastr: ToastrService) { }

  async ngOnInit() {
    this.userId = localStorage.getItem('editUserId');
    if (!this.userId) {
      await this.router.navigate(['list-user']);
      return;
    }
    else {

      this.editForm = this.fb.group({
        email: ['', Validators.required],
        password: [''],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        gender: ['male', Validators.required],
        image: [''],
        pdf: ['']
      });

      await this.userservice.getOneUser(this.userId).subscribe((data) => {
        if (data['status'] === 200) {
          this.Toastr.success('user retrived SuccessFully');

          this.result = data['data'];
          // this.editForm.patchValue(data['data']);
          this.editForm.patchValue({ email: this.result.email });
          // this.editForm.patchValue({ password: this.result.password });
          this.editForm.patchValue({ firstName: this.result.firstName });
          this.editForm.patchValue({ lastName: this.result.lastName });
          this.editForm.patchValue({ gender: this.result.gender });
          // this.arr = this.result.image.split('/');
          // this.editForm.value.image = this.arr.slice(-1)[0];
          this.url = this.result.image;
        }
        else {
          this.Toastr.error(data['message']);
        }
      });
    }

  }
  get f() {
    return this.editForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    if (this.editForm.invalid) {
      return;
    } else {
      const fd = new FormData();
      fd.append('firstName', this.editForm.value.firstName);
      fd.append('lastName', this.editForm.value.lastName);
      fd.append('email', this.editForm.value.email);
      fd.append('password', this.editForm.value.password);
      fd.append('gender', this.editForm.value.gender);
      if (this.filedata != undefined) {
        fd.append('image', this.filedata);
      }
      if (this.filedata2 != undefined) {
        fd.append('pdf', this.filedata2);
      }
      this.userservice.updateOneUser(this.userId, fd).subscribe((data) => {

        if (data['status'] === 200) {
          this.Toastr.error('record updated SuccessFully.');
          this.router.navigate(['list-user']);
          localStorage.removeItem('editUserId');
        } else {
          this.Toastr.error(data['message']);
        }

      });

    }
  }

  onFileChange(e) {
    this.imgUrl = '';
    this.url = '';
    if (e.target.files[0]) {
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
    else {

    }

  }

  onFileChanges(e) {
    if (e.target.files[0]) {
      if (e.target.files[0].name.match(/\.(pdf)$/)) {
        this.filedata2 = e.target.files[0];
      } else {
        this.Toastr.error('Only Pdf is Allow');
      }
    }
    else {

    }
  }
}
