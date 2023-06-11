import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SignUpService } from './signup.service';
import {User} from "../models/user.model";


describe('SignUpService', () => {
  let service: SignUpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SignUpService]
    });
    service = TestBed.inject(SignUpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a POST request to create a user', () => {
    const mockUser: User = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'Millenium'
    };

    service.addUser(mockUser).subscribe();

    const req = httpMock.expectOne('https://demo-api.now.sh/users');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockUser);
    req.flush({});
  });

  it('should handle error during user creation', () => {
    const mockUser: User = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'Millenium'
    };

    service.addUser(mockUser).subscribe(
        () => fail('Expected an error, but got a successful response'),
        (error) => {
          expect(error).toBeTruthy();
          expect(error.message).toBe('An error occurred while adding the user.');
        }
    );

    const req = httpMock.expectOne('https://demo-api.now.sh/users');
    req.error(new ErrorEvent('An error occurred'));
  });
});
