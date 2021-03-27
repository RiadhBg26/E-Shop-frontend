import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service'
import { Router } from '@angular/router';
import { ProductModelServer, ServerResponse } from '../../models/typescript.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  id: number;
  products: ProductModelServer[] = [];
  constructor(
    private productService : ProductService,
    private cartService: CartService,
    private router: Router) { }

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe( (prods: ServerResponse) => {
      // console.log(prods);
      this.products = prods.products
      // console.log(this.products);
    });
  };

  selectProduct(id: number) {
    this.router.navigate(['/product', id]).then();
    // console.log(id);
  };

  addToCart(id: number) {
    this.cartService.addProductToCart(id)
  };

}
