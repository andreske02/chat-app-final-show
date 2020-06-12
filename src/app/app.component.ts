import {
  Component,
  OnInit,
  HostListener
} from '@angular/core';
import {
  AuthService
} from './services/auth.service';
import {
  ChatService
} from './services/chat.service';
import {
  auth, User
} from 'firebase';
import { UsersService } from './services/users.service';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  host: {
    // '(document:visibilitychange)': 'checkIfOnline($event)'
    // '(window:onbeforeunload)': 'checkIfClose($event)'
  },
})
export class AppComponent implements OnInit {
  online: String = "";
  uid: String = "";
  user;
  presence$;
  constructor(
    public cs: ChatService,
    public authService: AuthService,
    public userService: UsersService
  ) {}

  ngOnInit(): void {

    this.user = this.authService.getUser();
    this.presence$ = this.authService.getPresence(this.user.uid);
    this.userService.getUsers();
  }
}

