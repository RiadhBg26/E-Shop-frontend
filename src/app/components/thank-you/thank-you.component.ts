import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-thank-you',
  templateUrl: './thank-you.component.html',
  styleUrls: ['./thank-you.component.scss']
})
export class ThankYouComponent implements OnInit {

  message: string;
  orderId: number;
  products; 
  cartTotal: number;

  constructor(private cartService: CartService,
     private router: Router,
    private orderService: OrderService  ) {
      const navigation = this.router.getCurrentNavigation();
      const state = navigation.extras.state as {
        message: string;
        products: ProductResponseModel;
        orderId: number;
        total: number;
      }
      this.message = state.message;
      this.orderId = state.orderId;
      this.products = state.products;
      this.cartTotal = state.total;
    }

  ngOnInit() {}

}
interface ProductResponseModel {
  id: Number;
  title: String;
  description: String;
  price: Number;
  image: String;
  quantityOrdered: Number;
}
