import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import {SignUpFormComponent} from "./sign-up-form.component";
import {SignUpService} from "../services/signup.service";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";

describe('SignUpFormComponent', () => {
  let component: SignUpFormComponent;
  let fixture: ComponentFixture<SignUpFormComponent>;
  let signUpServiceSpy: jasmine.SpyObj<SignUpService>;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    const signUpServiceMock = jasmine.createSpyObj('SignUpService', ['addUser']);

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      declarations: [SignUpFormComponent],
      providers: [{ provide: SignUpService, useValue: signUpServiceMock }]
    }).compileComponents();

    signUpServiceSpy = TestBed.inject(SignUpService) as jasmine.SpyObj<SignUpService>;
    httpMock = TestBed.inject(HttpTestingController);

    fixture = TestBed.createComponent(SignUpFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form correctly', () => {
    expect(component.signupForm.get('firstName')).toBeDefined();
    expect(component.signupForm.get('lastName')).toBeDefined();
    expect(component.signupForm.get('email')).toBeDefined();
    expect(component.signupForm.get('password')).toBeDefined();
  });

  it('should show password error when invalid', () => {
    component.signupForm.get('password')?.setValue('123');
    component.signupForm.get('password')?.markAsTouched();
    expect(component.showPwdError()).toBe(true);
  });

  it('should add a user when form is submitted successfully', () => {
    const mockUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'Millenium'
    };
    signUpServiceSpy.addUser.and.returnValue(of(mockUser));

    component.signupForm.setValue(mockUser);
    component.onSubmit();

    expect(signUpServiceSpy.addUser).toHaveBeenCalledWith(mockUser);
    expect(component.result).toEqual(mockUser);
  });
  
});
