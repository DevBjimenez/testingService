import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { AuthService } from "./auth.service";
import { TokenService } from "./token.service";
import { TestBed } from "@angular/core/testing";
import { Auth } from "../models/auth.model";
import { environment } from "src/environments/environment";
import { ur } from "@faker-js/faker";

describe('auth service test', () => {
    let authService: AuthService;
    let httpController: HttpTestingController;
    let tokenService: TokenService
     beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                AuthService,
                TokenService,
                
            ]
        });
        
        httpController = TestBed.inject(HttpTestingController)
        authService = TestBed.inject(AuthService);
        tokenService = TestBed.inject(TokenService)
     });
     
     afterEach(() => {
      httpController.verify();
    });

    it('should be created', () => {
        expect(authService).toBeTruthy
    });
    describe('Login Method Test', () => {
        it('should return token', (done) => {
            const mockData: Auth = {
                access_token: '123'
            }
            const email = 'brayan@gmail.com';
            const password = 'papa';
            authService.login(email, password).subscribe(
                res => {
                    expect(res).toEqual(mockData)
                    done()
                }
            )

            // httpConfig
            const url = `${environment.API_URL}/api/v1/auth/login`
            const req = httpController.expectOne(url)
            req.flush(mockData)
        });

        it('should save token', (done) => {
            const mockData: Auth = {
                access_token: '123'
            }
            const email = 'brayan@gmail.com';
            spyOn(tokenService, 'saveToken').and.callThrough()
            const password = 'papa';
            authService.login(email, password).subscribe(
                res => {
                    expect(res).toEqual(mockData)
                    expect(tokenService.saveToken).toHaveBeenCalledWith(mockData.access_token)
                    done()
                }
            )

            // httpConfig
            const url = `${environment.API_URL}/api/v1/auth/login`
            const req = httpController.expectOne(url)
            req.flush(mockData)
        });
        
    });
});