import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {HttpClient} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {User} from "../models/user.model";
import {SignUpService} from "../services/signup.service";

const passwordPattern = '^(?=.*?[A-Z])(?=.*?[a-z])(?!.*?(?:^|\s)(?:firstName|lastName)(?:$|\s))(?=.*?[0-9]).{8,}$';

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
      password: ['', [Validators.required, Validators.minLength(8)]]
    });

  }

  onSubmit() {
    console.log(this.signupForm.value);
    this.addUser(this.signupForm.value);
  }

  addUser(user: User): void {
    this.signUpService
        .addUser(user)
        .pipe(
            catchError((error) => {
              console.log('Error creating user', error);
              return throwError(error);
            })
        )
        .subscribe(result => {
          this.result = result;
          console.log('result: ' + this.result);
        });
  }

  showPwdError() {
    const passwordControl = this.signupForm.get('password');
    return passwordControl?.invalid && passwordControl?.touched;
  }

  // Custom validator function
  /*
  passwordValidator(formGroup: FormGroup): ValidatorFn | null {
    return (control: AbstractControl): ValidationErrors | null => {
      const firstName = formGroup.get('firstName')?.value;
      const lastName = formGroup.get('lastName')?.value;
      const password = formGroup.get('password')?.value;

      // Check if password meets the requirements
      if (password &&
          password.length >= 8 &&
          /[a-z]/.test(password) &&
          /[A-Z]/.test(password) &&
          firstName &&
          lastName &&
          !(password.includes(firstName) || password.includes(lastName))
      ) {
        return null; // Valid password
      } else {
        return {passwordInvalid: true}; // Invalid password
      }
    };
  }

   */

}
