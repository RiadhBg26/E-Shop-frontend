import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CartModelServer } from '../../models/cart.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  cartTotal: number;
  cartData: CartModelServer
  image : string;
  authState: boolean;

  constructor(public cartService: CartService, private userService: UserService) { }

  ngOnInit(): void {
    this.cartService.cartTotal$.subscribe(total => {
      this.cartTotal = total;
    });
    this.cartService.cartDataObs$.subscribe(data => {
      this.cartData = data;
      // console.log(this.cartData);
    });

    this.userService.authState$.subscribe( authState => this.authState = authState)

  };
  
}
