import {
  Component,
  OnInit
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
  FormBuilder
} from '@angular/forms';
import {
  Router
} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerEmailForm;
  constructor(public auth: AuthService,
    public cs: ChatService,
    public userService: UsersService,
    private formBuilder: FormBuilder,
    public route: Router) {

    this.registerEmailForm = this.formBuilder.group({
      name: '',
      email: '',
      password: '',
      website: '',
      functie: '',
      bio: ''
    });
  }

  ngOnInit() {

  }

  goToHome() {
    this.route.navigate(['/']);
  }
  EmailPasswordRegister(formVal) {
    this.auth.EmailPasswordRegister(formVal);
  }
}
