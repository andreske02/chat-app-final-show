import { Component, OnInit, AfterViewInit, OnChanges, AfterContentChecked, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';
import { ChatService } from '../services/chat.service';
import { RoomsService } from '../services/rooms.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, AfterViewInit , OnChanges, AfterViewChecked{
  chat$: Observable<any>;
  newMsg: string;
  allRooms: any[] = [];
  @ViewChild('chatBox') private myScrollContainer: ElementRef;
  disableScrollDown = false;

  constructor(
    public cs: ChatService,
    private route: ActivatedRoute,
    public auth: AuthService,
    public userService: UsersService,
    public roomService: RoomsService
  ) {}
  ngOnChanges(changes: import('@angular/core').SimpleChanges): void {
    this.scrollToBottom();
  }
  ngAfterViewInit() {
    this.scrollToBottom();
}
  // tslint:disable-next-line: use-life-cycle-interface
  ngAfterViewChecked() {
    this.scrollToBottom();
  }
  ngOnInit() {
    this.getRooms();
    const chatId = this.route.snapshot.paramMap.get('id');
    const source = this.roomService.get(chatId);
    this.chat$ = this.roomService.joinUsers(source); // .pipe(tap(v => this.scrollToBottom(v)));
    this.scrollToBottom();
  }







  getRooms(){
    this.roomService.getRooms().subscribe((rooms) => {
      this.allRooms = rooms;
    });
  }
  submit(chatId) {
    if (!this.newMsg) {
      return alert('you need to enter something');
    }
    this.roomService.sendMessage(chatId, this.newMsg);
    this.newMsg = '';
    this.scrollToBottom();
  }

  trackByCreated(i, msg) {
    return msg.createdAt;
  }


  private onScroll() {
    const element = this.myScrollContainer.nativeElement;
    const atBottom = element.scrollHeight - element.scrollTop === element.clientHeight;
    if (this.disableScrollDown && atBottom) {
        this.disableScrollDown = false;
    } else {
        this.disableScrollDown = true;
    }
}


private scrollToBottom(): void {
    if (this.disableScrollDown) {
        return;
    }
    try {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
}

}
