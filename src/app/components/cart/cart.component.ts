import { Component, OnInit } from '@angular/core';
import { CartModelServer } from '../../models/cart.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  cartData : CartModelServer;
  cartTotal: number;
  subTotal: number
  constructor(public cartService: CartService) { }

  ngOnInit(): void {
    this.cartService.cartDataObs$.subscribe(data => this.cartData = data);
     this.cartService.cartTotal$.subscribe(total => this.cartTotal = total);
  }

  changeQuantity(id: number, increase:boolean) {
    this.cartService.UpdateCartData(id, increase)
  }
  calculateSubTotal(i) {
    this.cartService.CalculateSubTotal(i)
  }
}
