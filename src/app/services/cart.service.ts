
import {Injectable} from '@angular/core';
import {ProductService} from "./product.service";
import {BehaviorSubject} from "rxjs";
import {CartModelPublic, CartModelServer} from "../models/cart.model";
import {ProductModelServer} from '../models/typescript.model';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {NavigationExtras, Router} from "@angular/router";
import {OrderService} from "./order.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})


export class CartService {

  SERVER_URL = environment.SERVER_URL;

  private cartDataClient: CartModelPublic = {prodData: [{inCart: 0, id: 0}], total: 0};  // This will be sent to the backend Server as post data
  // Cart Data variable to store the cart information on the server
  private cartDataServer: CartModelServer = {
    data: [{
      prod: undefined,
      numInCart: 0
    }],
    totalAmount: 0
  };

  cartTotal$ = new BehaviorSubject<number>(0);
  // Data variable to store the cart information on the client's local storage

  cartDataObs$ = new BehaviorSubject<CartModelServer>(this.cartDataServer);


  constructor(private productService: ProductService,
              private orderService: OrderService,
              private httpClient: HttpClient,
              private router: Router,
              private spinner: NgxSpinnerService,
              private toast: ToastrService) { 

    this.cartTotal$.next(this.cartDataServer.totalAmount);
    this.cartDataObs$.next(this.cartDataServer);

    let info: CartModelPublic = JSON.parse(localStorage.getItem('cart'));

    if (info !== null && info !== undefined && info.prodData[0].inCart !== 0) {
      // assign the value to our data variable which corresponds to the LocalStorage data format
      this.cartDataClient = info;
      // Loop through each entry and put it in the cartDataServer object
      this.cartDataClient.prodData.forEach(p => {
        this.productService.getSingleProduct(p.id).subscribe((actualProdInfo: ProductModelServer) => {
          if (this.cartDataServer.data[0].numInCart === 0) {
            this.cartDataServer.data[0].numInCart = p.inCart;
            this.cartDataServer.data[0].prod = actualProdInfo;
            this.calculateTotal();
            this.cartDataClient.total = this.cartDataServer.totalAmount;
            localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          } else {
            this.cartDataServer.data.push({
              numInCart: p.inCart,
              prod: actualProdInfo
            });
            this.calculateTotal();
            this.cartDataClient.total = this.cartDataServer.totalAmount;
            localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          }
          this.cartDataObs$.next({...this.cartDataServer});
        });
      });
    }
  }

  CalculateSubTotal(i): number {
    let subTotal = 0;

    let p = this.cartDataServer.data[i];
    // @ts-ignore
    subTotal = p.prod.price * p.numInCart;

    return subTotal;
  }

  addProductToCart(id: number, quantity?: number) {

    this.productService.getSingleProduct(id).subscribe(prod => {
        // 1. If chosen product is already in cart array
      // console.log(prod[id].quantity, '1');
      // If the cart is empty
      if (this.cartDataServer.data[0].prod === undefined) {
        if(prod.quantity !== 0 || prod.quantity == undefined){
          console.log(prod.quantity);
          this.cartDataServer.data[0].prod = prod;
          this.cartDataServer.data[0].numInCart = quantity !== undefined ? quantity : 1;
          console.log('true');
          console.log('quantity :',prod.quantity, 'number In cart :', this.cartDataClient.prodData[0].inCart );
          this.calculateTotal();
          this.cartDataClient.prodData[0].inCart = this.cartDataServer.data[0].numInCart;
          this.cartDataClient.prodData[0].id = prod.id;
          // calculating amount
          this.cartDataClient.total = this.cartDataServer.totalAmount;
          localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          this.cartDataObs$.next({...this.cartDataServer});
          this.toast.success(`${prod.name} added to the cart.`, "Product Added", {
            timeOut: 1500,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          })
          }
        
      }  // END of IF
      // Cart is not empty
      else {
        let index = this.cartDataServer.data.findIndex(p => p.prod.id === prod.id);
        // 1. If chosen product is already in cart array
        if (index !== -1) {

          if (quantity !== undefined && quantity <= prod.quantity) {
            // @ts-ignore
            this.cartDataServer.data[index].numInCart = this.cartDataServer.data[index].numInCart < prod.quantity ? quantity : prod.quantity;
          } else {
            // @ts-ignore
            this.cartDataServer.data[index].numInCart < prod.quantity ? this.cartDataServer.data[index].numInCart++ : prod.quantity;
          }


          this.cartDataClient.prodData[index].inCart = this.cartDataServer.data[index].numInCart;
          this.toast.info(`${prod.name} quantity updated in the cart.`, "Product Updated", {
            timeOut: 1500,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          })
        }
        // 2. If chosen product is not in cart array
        else {
          if (prod.quantity !== 0) {
            this.cartDataServer.data.push({
              prod: prod,
              numInCart: 1
            });
            this.cartDataClient.prodData.push({
              inCart: 1,
              id: prod.id
            });
            this.toast.success(`${prod.name} added to the cart.`, "Product Added", {
              timeOut: 1500,
              progressBar: true,
              progressAnimation: 'increasing',
              positionClass: 'toast-top-right'
            })
          }
         
        }
        this.calculateTotal();
        this.cartDataClient.total = this.cartDataServer.totalAmount;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
        this.cartDataObs$.next({...this.cartDataServer});
      }  // END of ELSE


    });
  };

  UpdateCartData(index, increase: boolean) {
    let data = this.cartDataServer.data[index];
    if (increase) {
      // @ts-ignore
      data.numInCart < data.prod.quantity ? data.numInCart++ : data.prod.quantity; //if(data.numInCart < data.prod.quantity){data.numInCart++} else{data.numInCart = data.product.quantity}
      this.cartDataClient.prodData[index].inCart = data.numInCart;
      this.calculateTotal();
      this.cartDataClient.total = this.cartDataServer.totalAmount;
      this.cartDataObs$.next({...this.cartDataServer});
      localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
    } else {
      // @ts-ignore
      data.numInCart--;
      // @ts-ignore
      if (data.numInCart < 1) {
        this.DeleteProductFromCart(index);
        this.cartDataObs$.next({...this.cartDataServer});
      } else {
        // @ts-ignore
        this.cartDataObs$.next({...this.cartDataServer});
        this.cartDataClient.prodData[index].inCart = data.numInCart;
        this.calculateTotal();
        this.cartDataClient.total = this.cartDataServer.totalAmount;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      }

    }

  }

  DeleteProductFromCart(index) {
    /*    console.log(this.cartDataClient.prodData[index].prodId);
        console.log(this.cartDataServer.data[index].product.id);*/

    if (window.confirm('Are you sure you want to delete the item?')) {
      this.cartDataServer.data.splice(index, 1);
      this.cartDataClient.prodData.splice(index, 1);
      this.calculateTotal();
      this.cartDataClient.total = this.cartDataServer.totalAmount;

      if (this.cartDataClient.total === 0) {
        this.cartDataClient = {prodData: [{inCart: 0, id: 0}], total: 0};
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      } else {
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      }

      if (this.cartDataServer.totalAmount === 0) {
        this.cartDataServer = {
          data: [{
            prod: undefined,
            numInCart: 0
          }],
          totalAmount: 0
        };
        this.cartDataObs$.next({...this.cartDataServer});
      } else {
        this.cartDataObs$.next({...this.cartDataServer});
      }
    }
    // If the user doesn't want to delete the product, hits the CANCEL button
    else {
      return;
    }


  }

  CheckoutFromCart(userId: number) {

    this.httpClient.post(`${this.SERVER_URL}/orders/payment`, null).subscribe((res: { success: boolean }) => {
      console.clear();
      if (res.success) {
        console.log('success 1', res.success);
        this.resetServerData();
        this.httpClient.post(`${this.SERVER_URL}/orders/new`, {
          userId: userId,
          products: this.cartDataClient.prodData
        }).subscribe((data: OrderConfirmationResponse) => {
          this.orderService.getSingleOrder(data.order_id).then(prods => {
            
            if (data.success) {
              console.log("success 2", data.success);
              const navigationExtras: NavigationExtras = {
                state: {
                  message: data.message,
                  products: prods,
                  orderId: data.order_id,
                  total: this.cartDataClient.total
                }
              };
              this.spinner.hide().then();
              this.router.navigate(['/thankyou'], navigationExtras).then(p => {
                this.cartDataClient = {prodData: [{inCart: 0, id: 0}], total: 0};
                this.cartTotal$.next(0);
                localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
              });
            }
          });

        })
      } else {
        console.log("failed");
        this.spinner.hide().then();
        this.router.navigateByUrl('/checkout').then();
        this.toast.error(`Sorry, failed to book the order`, "Order Status", {
          timeOut: 1500,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        })
      }
    })
  }


  private calculateTotal() {
    let Total = 0;

    this.cartDataServer.data.forEach(p => {
      const {numInCart} = p;
      const {price} = p.prod;
      // @ts-ignore
      Total += numInCart * price;
    });
    this.cartDataServer.totalAmount = Total;
    this.cartTotal$.next(this.cartDataServer.totalAmount);
  }

  private resetServerData() {
    this.cartDataServer = {
      data: [{
        prod: undefined,
        numInCart: 0
      }],
      totalAmount: 0
    };
    this.cartDataObs$.next({...this.cartDataServer});
  }

}

interface OrderConfirmationResponse {
  order_id: number ;
  success: boolean;
  message: string;
  products: [{
    id: string,
    numInCart: string
  }]
}

