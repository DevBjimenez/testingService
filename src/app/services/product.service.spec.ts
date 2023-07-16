import { generateOneProduct } from './../models/product.mock';
import { TestBed } from "@angular/core/testing";
import { ProductsService } from "./product.service";
import { 
    HttpClientTestingModule, HttpTestingController,
  } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpStatusCode } from "@angular/common/http";
import { CreateProductDTO, Product, UpdateProductDTO } from "../models/product.model";
import { environment } from "src/environments/environment";
import { generateManyProducts } from "../models/product.mock";
import { TokenService } from './token.service';
import { TokenInterceptor } from '../interceptors/token.interceptor';

describe('ProductService', () => {
    let productService: ProductsService;
    let httpController: HttpTestingController;
    let httpClient: HttpClient;
    let tokenService: TokenService
     beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                ProductsService,
                TokenService,
                {
                  provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true
                }
            ]
        });
        
        httpController = TestBed.inject(HttpTestingController)
        productService = TestBed.inject(ProductsService);
        tokenService = TestBed.inject(TokenService)
     });
     
     afterEach(() => {
      httpController.verify();
    });
     
    it('should be created', () => {
        expect(productService).toBeTruthy
    });

    describe('GetAllSimple test', () => {
        it('Shoul return a product list', (done) => {
            const mockData:Product[] = generateManyProducts(2)
            spyOn(tokenService, 'getToken').and.returnValue('123')
            productService.getAllSimple().subscribe(
                res => {
                    // assert
                    expect(res).toEqual(mockData);
                    done()
                }
            )

            // hhtp config
            const url = `${environment.API_URL}/api/v1/products`
            const req = httpController.expectOne(url);
            const headers = req.request.headers
            expect(headers.get('Authorization')).toEqual('Bearer 123')
            req.flush(mockData);
           
        });

        it('should return product list with taxes', (doneFn) => {
            // Arrange
            const mockData: Product[] = [
              {
                ...generateOneProduct(),
                price: 100, // 100 * .19 = 19
              },
              {
                ...generateOneProduct(),
                price: 200, // 200 * .19 = 38
              },
              {
                ...generateOneProduct(),
                price: -100, // 200 * .19 = 38
              },
              {
                ...generateOneProduct(),
                price: 0, // 200 * .19 = 38
              }
            ];
            //Act
            productService.getAll()
            .subscribe((data)=> {
              //Assert
              expect(data.length).toEqual(mockData.length);
              expect(data[0].taxes).toEqual(19);
              expect(data[1].taxes).toEqual(38);
              expect(data[2].taxes).toEqual(0);
              expect(data[3].taxes).toEqual(0);
              doneFn();
            });
      
            // http config
            const url = `${environment.API_URL}/api/v1/products`;
            const req = httpController.expectOne(url);
            req.flush(mockData);
            
          });

          it('shoul send query params with 10 and 3', (doneFn) => {
            // Arrange
            const mockData: Product[] = generateManyProducts(3)
            const limit = 10;
            const offset = 3;
              //Act
              productService.getAll(limit, offset)
              .subscribe((data)=> {
                //Assert
                expect(data.length).toEqual(mockData.length);
                doneFn();
              });
        
              // http config
              const url = `${environment.API_URL}/api/v1/products?limit=${limit}&offset=${offset}`;
              const req = httpController.expectOne(url);
              req.flush(mockData);
              const queryParams = req.request.params;
              expect(queryParams.get('limit')).toEqual(`${limit}`)
              expect(queryParams.get('offset')).toEqual(`${offset}`)
              
          });
          
    });

    describe('create method test', () => {
      it('should return new post', (done) => {
        // Arrange
        const mockResponse = generateOneProduct()
        const newProduct: CreateProductDTO = {
          categoryId: 1,
          description: 'Junioe',
          images: ['hola'],
          price: 12,
          title: 'Mazorca'
        }
        // Act
        productService.create({...newProduct}).
        subscribe( 
          res => {
            // Assert
            expect(res).toEqual(mockResponse)
            done()
          }
        )
          // http config
          const url = `${environment.API_URL}/api/v1/products`;
          const req = httpController.expectOne(url);
          req.flush(mockResponse);
          expect(req.request.body).toEqual(newProduct)
          expect(req.request.method).toEqual('POST')
          httpController.verify();
      });
      
    });

    describe('create update test', () => {
      it('should update  post', (done) => {
        // Arrange
        const mockResponse = generateOneProduct()
        const newProduct: UpdateProductDTO = {
          categoryId: 1,
          description: 'Junioe',
          images: ['hola'],
          price: 12,
          title: 'Mazorca'
        }
        const productId = '1';
        // Act
        productService.update(productId, {...newProduct}).
        subscribe( 
          res => {
            // Assert
            expect(res).toEqual(mockResponse)
            done()
          }
        )
          // http config
          const url = `${environment.API_URL}/api/v1/products/${productId}`;
          const req = httpController.expectOne(url);
          req.flush(mockResponse);
          expect(req.request.body).toEqual(newProduct)
          expect(req.request.method).toEqual('PUT')
      });
      
    });

    describe('delete method test', () => {
      it('should delete post', (done) => {
        // Arrange
        const productId = '1';
        
        // Act
        productService.delete(productId).
        subscribe( 
          res => {
            // Assert
            expect(res).toEqual(true)
            done()
          }
        )
          // http config
          const url = `${environment.API_URL}/api/v1/products/${productId}`;
          const req = httpController.expectOne(url);
          req.flush(true)
          expect(req.request.method).toEqual('DELETE')
      });
      
    });

    describe('test for getOne', () => {
      it('should return a product', (doneFn) => {
        // Arrange
        const mockData: Product = generateOneProduct();
        const productId = '1';
        // Act
        productService.getOne(productId)
        .subscribe((data) => {
          // Assert
          expect(data).toEqual(mockData);
          doneFn();
        });
  
        // http config
        const url = `${environment.API_URL}/api/v1/products/${productId}`;
        const req = httpController.expectOne(url);
        expect(req.request.method).toEqual('GET');
        req.flush(mockData);
      });
  
      it('should return the right msg when the status code is 404', (doneFn) => {
        // Arrange
        const productId = '1';
        const msgError = '404 message';
        const mockError = {
          status: HttpStatusCode.NotFound,
          statusText: msgError
        };
        // Act
        productService.getOne(productId)
        .subscribe({
          error: (error) => {
            // assert
            expect(error).toEqual('El producto no existe');
            doneFn();
          }
        });
  
  
        // http config
        const url = `${environment.API_URL}/api/v1/products/${productId}`;
        const req = httpController.expectOne(url);
        expect(req.request.method).toEqual('GET');
        req.flush(msgError, mockError);
      });
    });
    
    
});