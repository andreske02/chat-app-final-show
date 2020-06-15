import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
// Instructions ---->
// Replace configPlaceholder with environment.firebase
// import { environment } from '../environments/environment';
// import configPlaceholder from './env';
import { ChatComponent } from './chat/chat.component';
import { HomeComponent } from './home/home.component';
import { UsersComponent } from './users/users.component';
import { RoomsComponent } from './rooms/rooms.component';
import { RoomComponent } from './room/room.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const config = {
  apiKey: 'AIzaSyDkgAwyClmcH_RsB3ODGNH6Vy30RGQcNK0',
  authDomain: 'chat-b0dc5.firebaseapp.com',
  databaseURL: 'https://chat-b0dc5.firebaseio.com',
  projectId: 'chat-b0dc5',
  storageBucket: 'chat-b0dc5.appspot.com',
  messagingSenderId: '944554094446',
  appId: '1:944554094446:web:dd18bfe41555c1e0039b7f'
};

@NgModule({
   declarations: [
      AppComponent,
      ChatComponent,
      HomeComponent,
      UsersComponent,
      RoomsComponent,
      RoomComponent,
      LoginComponent,
      RegisterComponent
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      ReactiveFormsModule,
      FormsModule,
      AngularFireModule.initializeApp(config),
      AngularFirestoreModule,
      AngularFireAuthModule,
      AngularFireStorageModule,
      AngularFireDatabaseModule,
      HttpClientModule
   ],
   providers: [],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule {}
