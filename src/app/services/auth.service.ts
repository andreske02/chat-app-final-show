import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import { AngularFireDatabase } from "@angular/fire/database";
import * as firebase from 'firebase/app'
import {AngularFireAuth} from '@angular/fire/auth';

import{ tap, map, switchMap, first} from 'rxjs/operators';
import {of, Subscription} from'rxjs';
import {Observable} from 'rxjs';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable < any > ;
  userId: String = '';

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore, private router: Router, private db: AngularFireDatabase) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          this.userId = user.uid;
          // this.updateOnUser().subscribe();
          // this.updateOnDisconnect().subscribe();
          // this.updateOnAway();
          return this.afs.doc <any> (`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
          this.updateOnUser().subscribe();
          this.updateOnDisconnect().subscribe();
          this.updateOnAway();
  }

  // !=============CHECKSTATUS============= //
  getPresence(uid: String) {
    return this.db.object(`status/${uid}`).valueChanges();
  }

  async setPresence(status: String) {
    const user = await this.getUser();
    if (user) {
      return this.db.object(`status/${user.uid}`).update({status, timestamp: this.timestamp,  uid: user.uid,  name: user.displayName});
    }
  }
  getUser() {
    return this.user$.pipe(first()).toPromise();
  }

  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }


updateOnUser() {
  const connection = this.db.object('.info/connected').valueChanges().pipe(
    map(connected => connected ? 'online' : 'offline')
  );
  return this.afAuth.authState.pipe(
    switchMap(user => user ? connection : of('offline')),
    tap(status => this.setPresence(status))
  );
}



updateOnAway() {
  document.onvisibilitychange = (e) => {
    if (document.visibilityState === 'hidden') {
      this.setPresence('away');
    } else {
      this.setPresence('online');
    }
  };
}

updateOnDisconnect() {
return this.afAuth.authState.pipe(
  tap(user => {
    if(user) {
      this.db.object(`status/${user.uid}`).query.ref.onDisconnect().update({status: 'offline', timestamp: this.timestamp});
    }
  })
);
}




  // checkIfOnline(visibility) {
  //   const uid = this.afAuth.auth.currentUser.uid;
  //   const userStatusFirestoreRef = this.afs.doc('/status/' + uid);

  //   // Firestore uses a different server timestamp value, so we'll
  //   // create two more constants for Firestore state.
  //   if (visibility === 'hidden' || visibility === 'unloaded') {
  //     const isOfflineForFirestore = {
  //       state: 'offline',
  //       last_changed: new Date().getTime(),
  //     };
  //     userStatusFirestoreRef.set(isOfflineForFirestore);
  //   } else if (visibility === 'visible') {
  //     const isOnlineForFirestore = {
  //       state: 'online',
  //       last_changed: new Date().getTime(),
  //     };
  //     userStatusFirestoreRef.set(isOnlineForFirestore);
  //   } else {
  //     const isOfflineForFirestore = {
  //       state: 'offline',
  //       last_changed: new Date().getTime(),
  //     };
  //     userStatusFirestoreRef.set(isOfflineForFirestore);
  //   }
  // }














  // !=============SIGNIN============= //
  // Google signin
  googleSignUp(formVal) {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.oAuthRegister(provider,formVal);
  }

  private async oAuthRegister(provider, formVal) {
    const credential = await this.afAuth.auth.signInWithPopup(provider);
    return this.updateUserDataGoogle(credential.user, formVal);
  }

  private updateUserDataGoogle({
    uid,
    email,
    displayName,
    photoURL
  }, formVal) {
    const userRef: AngularFirestoreDocument < any > = this.afs.doc(`users/${uid}`);

    const data = {
      uid,
      email,
      displayName,
      photoURL,
      website: formVal.website,
      function: formVal.functie,
      bio: formVal.bio,
    };

    return userRef.set(data, {
      merge: true
    });
  }

  // Google signin
  googleSignIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  private async oAuthLogin(provider) {
    const credential = await this.afAuth.auth.signInWithPopup(provider);
    return ;
  }


    // Email & password sign in
    async EmailPasswordSignIn(formVal) {
      const credentials = await this.afAuth.auth.signInWithEmailAndPassword(formVal.email, formVal.password).catch(function(error) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // ...
      console.log(errorCode, errorMessage);
      return errorMessage;
    });
    return 'success';
    }



    // Email & password register
    async EmailPasswordRegister(formVal) {

      const credentials = await this.afAuth.auth.createUserWithEmailAndPassword(formVal.email, formVal.password).catch(function(error) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // ...
      console.log(errorCode, errorMessage);
      return errorMessage;
    });
    return this.updateUserDataEmail(credentials,formVal);
    }

      // Update user data with email
  private updateUserDataEmail(credentials, formVal) {
    const userRef: AngularFirestoreDocument < any > = this.afs.doc(`users/${credentials.user.uid}`);
    const data = {
      uid: credentials.user.uid,
      email: formVal.email,
      displayName: formVal.name,
      function: formVal.functie,
      website: formVal.website,
      bio: formVal.bio,
    };

    return userRef.set(data, {
      merge: true
    });
  }






    // Anonymous sign in
    async AnonymousSignIn(userName) {
      const credentials = await this.afAuth.auth.signInAnonymously();
      return this.updateUserData(credentials, userName);
    }

    // Update user data
    private updateUserData(credentials, username) {
      const userRef: AngularFirestoreDocument < any > = this.afs.doc(`users/${credentials.user.uid}`);
      const data = {
        uid: credentials.user.uid,
        displayName: username,
      };

      return userRef.set(data, {
        merge: true
      });
    }
  async signOut() {
    await this.setPresence('offline');
    await this.afAuth.auth.signOut();
    window.location.reload();
    return this.router.navigate(['/']);
  }
}
