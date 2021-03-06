import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

import { UserService } from "@services/user.service";
import { AuthService } from "@services/auth.service";
import { ValidatePassword } from "@validators/password.validator";
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  signUpForm: FormGroup;
  showConfirmValidation = false;

  constructor(
    private signUpFormBuilder: FormBuilder,
    private signUpService: AuthService,
    private userService: UserService,
    public router: Router,
    public toastCtrl: ToastController,
  ) { }

  ngOnInit() {
    this.signUpForm = this.signUpFormBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      name: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(8), ValidatePassword])],
      confirmPassword: ['', Validators.compose([Validators.required, Validators.minLength(8), ValidatePassword])],
      agreeOnterms: [false, Validators.compose([Validators.required, Validators.requiredTrue])]
    });

    this.signUpForm.get('confirmPassword').valueChanges.subscribe((value) => {

      if (this.password.value === value) {
        this.showConfirmValidation = false;
      } else {
        this.showConfirmValidation = true;
      }
    });
  }

  get email() {
    return this.signUpForm.get('email');
  }

  get name() {
    return this.signUpForm.get('name');
  }

  get password() {
    return this.signUpForm.get('password');
  }
  get confirmPassword() {
    return this.signUpForm.get('confirmPassword');
  }

  async signUp() {

    const { email, password, name } = this.signUpForm.value;
    const userCredentials = {
      username: name,
      password,
      secondaryFields: {
        name,
        email,
      }
    };

    this.signUpService.signUp(userCredentials)
      .then(() => this.confirmAuth())
      .catch(async (err: HttpErrorResponse) => this.showToast(err.message));

  }

  confirmAuth() {
    this.userService.getUser().then((res) => {
      if (res) {
        this.router.navigateByUrl('/home/article-list')
      } else {
        this.confirmAuth();
      }
    })
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000
    });
    toast.present();
  }
}
