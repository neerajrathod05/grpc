import { Component, OnInit } from '@angular/core';
import {grpc} from "@improbable-eng/grpc-web";
import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import {Users} from "../protos/generated/users_pb_service";
import {UserRequest, User, UserStatus} from "../protos/generated/users_pb";
import { BrowserHeaders } from 'browser-headers';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  userList: any[] = []; 
  CreateUserForm: any;

  ngOnInit() {
    this.CreateUserForm = new FormGroup({
      'id':new FormControl(''),
      'name':new FormControl(''),
      'age':new FormControl(''),
      'status':new FormControl('')
    });
  }

  createUser() {
    if (this.CreateUserForm.valid) {
      console.log(this.CreateUserForm.value);
      const jim = new User();
      jim.setName(this.CreateUserForm.value.name);
      jim.setAge(this.CreateUserForm.value.age);
      jim.setId(this.CreateUserForm.value.id);
      jim.setStatus(this.CreateUserForm.value.status);
      grpc.unary(Users.CreateUser, {
        metadata : new BrowserHeaders({
          'content-type': "application/grpc"
        }),
        request: jim,
        host: "http://localhost:8080",
        onEnd: res => {
          const { status, statusMessage, headers, message, trailers } = res;
          console.log(res);
          if (status === grpc.Code.OK && message) {
            alert('User created');
            this.CreateUserForm.reset();
          }
        }
      }); 
    } else {
      alert ('Please enter valid data');
    }
  }

  getUserList() {
    this.userList = [];
    grpc.invoke(Users.GetUsers, {
      request: new Empty(),
      host: "http://localhost:8080",
      onMessage: (message: User) => {
        var user = message.toObject() as User.AsObject;
        console.log("---------User------",user);
        this.userList.push(user);
      },
      onEnd: (code: grpc.Code, msg: string | undefined, trailers: grpc.Metadata) => {
        if (code == grpc.Code.OK) {
          console.log("all Users downloaded")
        } else {
          console.log("hit an error", code, msg, trailers);
        }
      }
    });
  }
}