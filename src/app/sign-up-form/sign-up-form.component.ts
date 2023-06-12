import { Component, OnInit } from '@angular/core';
import {
  AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators
} from '@angular/forms';
import {HttpClient} from "@angular/common/http";
import {catchError, throwError} from "rxjs";
import {User} from "../models/user.model";
import {SignUpService} from "../services/signup.service";

@Component({
  selector: 'app-sign-up-form',
  templateUrl: './sign-up-form.component.html',
  styleUrls: ['./sign-up-form.component.css']
})
export class SignUpFormComponent implements OnInit {

  signupForm: FormGroup;

  result: any;

  constructor(private fb: FormBuilder,
              private http: HttpClient,
              private signUpService: SignUpService) {
    this.signupForm = {} as FormGroup;
  }

  ngOnInit() {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordValidator()]]
    });
  }

  onSubmit() {
    this.addUser(this.signupForm.value);
  }

  addUser(user: User): void {
    this.signUpService
        .addUser(user)
        .pipe(
            catchError((error) => {
              return throwError(error);
            })
        )
        .subscribe(result => {
          this.result = result;
        });
  }

  showPwdError() {
    const passwordControl = this.signupForm.get('password');
    return passwordControl?.invalid && passwordControl?.touched;
  }

  passwordValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const password = control.value;
      const firstName = control.root.get('firstName')?.value;
      const lastName = control.root.get('lastName')?.value;

      if (
          password &&
          password.length >= 8 &&
          /[a-z]/.test(password) &&
          /[A-Z]/.test(password) &&
          !password.includes(firstName) &&
          !password.includes(lastName)
      ) {
        return null; // Valid password
      } else {
        return { passwordInvalid: true }; // Invalid password
      }

    };
  }

}
