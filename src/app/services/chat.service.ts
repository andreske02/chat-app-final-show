import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { firestore } from 'firebase/app';
import { map, switchMap } from 'rxjs/operators';
import { Observable, combineLatest, of } from 'rxjs';
import { UsersService } from './users.service';


@Injectable({
  providedIn: 'root'
})
export class ChatService {

  allChats: Observable<any>;

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
    private router: Router,
    private userService: UsersService
  ) {

  }

  get(chatId) {
    return this.afs
      .collection<any>('chats')
      .doc(chatId)
      .snapshotChanges()
      .pipe(
        map(doc => {
          return { id: doc.payload.id, ...doc.payload.data() };
        })
      );
  }

  getAllChats() {
    return this.afs.collection<any>('chats')
    .snapshotChanges()
    .pipe(
     map(actions => {
       return actions.map(a => {
         const data: Object = a.payload.doc.data();
         const id = a.payload.doc.id;
         return { id, ...data };
       });
     })
   );
  }

  // getUserChats() {
  //   return this.auth.user$.pipe(
  //     switchMap(user => {
  //       return this.afs
  //         .collection('chats', ref => ref.where('uid', '==', user.uid))
  //         .snapshotChanges()
  //         .pipe(
  //           map(actions => {
  //             return actions.map(a => {
  //               const data: Object = a.payload.doc.data();
  //               const id = a.payload.doc.id;
  //               return { id, ...data };
  //             });
  //           })
  //         );
  //     })
  //   );
  // }


  async create(uid2) {
    const { uid, displayName } = await this.auth.getUser();
    const data = {
      roomName: 'Room',
      uid,
      uid2,
      displayName,
      createdAt: Date.now(),
      count: 0,
      messages: []
    };

     if(uid === uid2){
      // return false;
    } else {
    const docRef = await this.afs.collection("chats").add(data);
    return this.router.navigate(['chats', docRef.id]);
    }
  }




  async sendMessage(chatId, content) {
    const { uid } = await this.auth.getUser();

    const data = {
      uid,
      content,
      createdAt: Date.now()
    };

    if (uid) {
      const ref = this.afs.collection('chats').doc(chatId);
      return ref.update({
        messages: firestore.FieldValue.arrayUnion(data)
      });
    }
  }

  async deleteMessage(chat, msg) {
    const { uid } = await this.auth.getUser();

    const ref = this.afs.collection('chats').doc(chat.id);
    console.log(msg);
    if (chat.uid === uid || msg.uid === uid) {
      // Allowed to delete
      delete msg.user;
      return ref.update({
        messages: firestore.FieldValue.arrayRemove(msg)
      });
    }
  }

  joinUsers(chat$: Observable<any>) {
    let chat;
    const joinKeys = {};

    return chat$.pipe(
      switchMap(c => {
        // Unique User IDs
        chat = c;
        const uids = Array.from(new Set(c.messages.map(v => v.uid)));

        // Firestore User Doc Reads
        const userDocs = uids.map(u =>
          this.afs.doc(`users/${u}`).valueChanges()
        );

        return userDocs.length ? combineLatest(userDocs) : of([]);
      }),
      map(arr => {
        arr.forEach(v => (joinKeys[(<any>v).uid] = v));
        chat.messages = chat.messages.map(v => {
          return { ...v, user: joinKeys[v.uid] };
        });

        return chat;
      })
    );
  }
}
