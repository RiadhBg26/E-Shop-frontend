import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CartModelServer } from '../../models/cart.model';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  userId: number;
  cartTotal: number;
  cartData: CartModelServer;

  constructor(private cartService: CartService,
    private orderService: OrderService,
    private userService: UserService,
    private router: Router,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.cartService.cartDataObs$.subscribe(data => this.cartData = data);
    this.cartService.cartTotal$.subscribe(total => this.cartTotal = total);
    this.userService.userData$.subscribe(data => {
      //@ts-ignore
      this.userId = data.userId || data.id;
      console.log(this.userId);
    })
  }

  onCheckout() {
    this.spinner.show().then(p => {
      this.cartService.CheckoutFromCart(this.userId)
    })
  }
}
