import { Component, OnInit, AfterViewInit,NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { ToastrService } from 'ngx-toastr';


declare var $: any;


function _window(): any {
  // return the global native browser window object 
  return window;
}


@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css']
})
export class ListUserComponent implements OnInit, AfterViewInit {

  deleteId: any;
  imgUrl: any = 'http://localhost:8080/';

  constructor(
    public zone: NgZone,
    private router: Router,
    private userservice: UserService,
    private Toastr: ToastrService) { }

  ngOnInit() {
    _window().my = _window().my || {};
    _window().my.notimgmt = _window().my.notimgmt || {};
    _window().my.notimgmt.editUser = this.editUser.bind(this);
    _window().my.notimgmt.deleteUser = this.deleteUser.bind(this);
  }

  ngAfterViewInit() {
    const that = this;

    $(document).ready(function () {
      $('#m_modal_6').hide();
      $(document).on('click', '.close', function (e) {
        $('#m_modal_6').hide();
      });
      $(document).on('click', '.btn-secondary', function (e) {
        $('#m_modal_6').hide();
      });
      $(document).on('click', '.btn-primary', function (e) {
        $('#m_modal_6').hide();
      });

      $('#usertable').DataTable({
        ajax: {
          'url': 'http://localhost:8080/api/user',
          'type': 'GET',
          'beforeSend': function (request) {
            const localdata = JSON.parse(localStorage.getItem('token'));
            request.setRequestHeader('Authorization', localdata);
          },
        },
        columns: [
          {
            title: 'FirstName',
            data: 'firstName'
          },
          {
            title: 'LastName',
            data: 'lastName'
          },
          {
            title: 'Email',
            data: 'email'
          },
          {
            title: 'Gender',
            data: 'gender'
          }
        ],
        columnDefs: [
          {
            targets: 4,
            title: 'Image',
            orderable: !1,
            render: function (a, e, t, n) {
              return '<img style="height : 30px ; width :40px;" src="' + that.imgUrl + t.image + '">';
            }
          },
          {
            targets: 5,
            title: 'Actions',
            orderable: !1,
            render: function (a, e, t, n) {
              var id = (t._id);
              return '\n<button class="btn btn-danger" data-id="' + id + '" data-toggle="modal" data-target="#m_modal_6" title="Delete" onclick="window.my.notimgmt.deleteUser(this)">Delete</button><button data-id="' + id + '" class="btn btn-danger" onclick="window.my.notimgmt.editUser(this)" style="margin-left: 20px;">Edit</button>'
            }
          }
        ],
        lengthMenu: [5, 10, 15, 20]
      });

    });

  }

  addUser() {
    this.router.navigate(['add-user']);
  }


  deleteUser(e) {
    $('#m_modal_6').show();
    this.deleteId = $(e).data('id');
  }

  deleteSure() {

    this.userservice.deleteUser(this.deleteId).subscribe((data) => {

      if (data['status'] === 200) {
        this.Toastr.success('Record Deleted SuccessFully');
        this.deleteId = '';

        let table: any = $('#usertable');
        var auditorTable = table.DataTable();
        auditorTable.ajax.reload();

      } else {
        this.Toastr.error(data['message']);
      }
    });
  }

  editUser(e) {
    $(e).data('id');
    localStorage.removeItem('editUserId');
    localStorage.setItem('editUserId', $(e).data('id').toString());
    this.zone.run(() => { this.router.navigate(['edit-user']); });
    // this.router.navigate(['edit-user']);
  }
}
