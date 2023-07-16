import { Product } from 'src/app/models/product.model';
import { ProductsService } from './../../services/product.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  products: Product[] = [];

  constructor( private ProductsService: ProductsService) {
    
  }

  ngOnInit(): void {
    this.getAllProducts()
  }

  getAllProducts() {
    this.ProductsService.getAllSimple().subscribe(
      res => this.products = res
    )
  }
}
