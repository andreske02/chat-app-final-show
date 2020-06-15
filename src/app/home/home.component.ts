import {
  Component,
  OnInit,
  OnChanges,
  AfterViewInit,
  DoCheck
} from '@angular/core';
import {
  AuthService
} from '../services/auth.service';
import {
  ChatService
} from '../services/chat.service';
import {
  UsersService
} from '../services/users.service';
import {
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit, OnChanges {
  userChats$;
  myChats: any = [];
  allRooms: any = [];
  displayNameOtherUser: String = '';
  constructor(public auth: AuthService, public cs: ChatService, public userService: UsersService) {

  }
  ngOnInit() {
    this.getmyChats();
  }



  async getmyChats() {

    const user = await this.auth.getUser();
    if(user){
      const userId = user.uid;
      await this.cs.getAllChats().subscribe((res) => {
        const chats = [];
        for (const chat of res) {
          if (chat['uid'] === userId || chat['uid2'] === userId) {
            // chats.push(chat);
            this.getOtherUserName(chat, chats, userId);
          }
        }

      });
    }

  }

  async getOtherUserName(chat, chats, userId) {
    this.userService.getUsers().pipe(first()).subscribe(res => {
      for (const user of res) {
        if (userId === chat.uid2) {
          if (user['uid'] === chat.uid) {
            this.displayNameOtherUser = user['displayName'];
            chat.displayName = this.displayNameOtherUser;
            chats.push(chat);
          }
        } else {
          if (user['uid'] === chat.uid2) {
            this.displayNameOtherUser = user['displayName'];
            chat.displayName = this.displayNameOtherUser;
            chats.push(chat);
          }
        }
        this.myChats = chats;
     }
    });
  }


  ngOnChanges() {

  }




}
