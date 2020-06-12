import { Component, OnInit, OnChanges, AfterViewInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';
import { RoomsService } from '../services/rooms.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit, OnChanges {
  userChats$;
  allRooms: any = [];
  constructor(public auth: AuthService, public cs: RoomsService, public userService: UsersService,     public roomService: RoomsService) {
    this.getRooms();
  }
  ngOnInit() {
    this.getRooms();
  }
  ngOnChanges() {
    this.getRooms();
  }
  getRooms(){
    this.cs.getRooms().subscribe((rooms) => {
      this.allRooms = rooms;

    });
  }




}
