import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ChatService } from '../services/chat.service';
import { UsersService } from '../services/users.service';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginEmailForm;
  constructor(public auth: AuthService, public cs: ChatService, public userService: UsersService,private formBuilder: FormBuilder,
    public route: Router) {
    this.loginEmailForm = this.formBuilder.group({
      email: '',
      password: '',
    });
  }


  ngOnInit() {
  }

  EmailPasswordSignIn(formVal) {
    this.auth.EmailPasswordSignIn(formVal);
  }

}
