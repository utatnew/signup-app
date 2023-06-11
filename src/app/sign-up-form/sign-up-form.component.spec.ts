import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import {SignUpFormComponent} from "./sign-up-form.component";
import {SignUpService} from "../services/signup.service";

describe('SignUpFormComponent', () => {
  let component: SignUpFormComponent;
  let fixture: ComponentFixture<SignUpFormComponent>;
  let signUpServiceSpy: jasmine.SpyObj<SignUpService>;

  beforeEach(async(() => {
    const signUpServiceMock = jasmine.createSpyObj('SignUpService', ['addUser']);

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [SignUpFormComponent],
      providers: [{ provide: SignUpService, useValue: signUpServiceMock }]
    }).compileComponents();

    signUpServiceSpy = TestBed.inject(SignUpService) as jasmine.SpyObj<SignUpService>;

    fixture = TestBed.createComponent(SignUpFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

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

  it('should handle error when adding a user', () => {
    const mockUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'Millenium'
    };
    const errorMessage = 'An error occurred while adding the user.';
    signUpServiceSpy.addUser.and.returnValue(throwError(errorMessage));

    component.signupForm.setValue(mockUser);
    component.onSubmit();

    expect(signUpServiceSpy.addUser).toHaveBeenCalledWith(mockUser);
    expect(component.result).toBeUndefined();
    // You can also expect component.error or perform further error handling
  });
});
