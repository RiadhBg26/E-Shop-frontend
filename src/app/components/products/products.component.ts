import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import {map} from "rxjs/operators";

declare let $: any

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  id: number;
  product;
  thumbImages: any[] = [];

  @ViewChild('quantity') quantityInput;
  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute ) { }
    
  ngOnInit(): void {
    
    this.route.paramMap.pipe(map((param: ParamMap) => {
      // @ts-ignore
      return param.params.id;
    })
    ).subscribe( prodId => {
      console.log('product id: ', prodId);
      this.id = prodId;

      this.productService.getSingleProduct(this.id).subscribe( prod => {
        this.product = prod
        console.log('test',prod);
        
        if (prod.images !== null) {
          this.thumbImages = prod.images.split(';')
        }
      });
    });

  }
  

  AfterViewInit() {
    // Product Main img Slick
	$('#product-main-img').slick({
    infinite: true,
    speed: 300,
    dots: false,
    arrows: true,
    fade: true,
    asNavFor: '#product-imgs',
  });

    	// Product imgs Slick
  $('#product-imgs').slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    centerMode: true,
    focusOnSelect: true,
		centerPadding: 0,
		vertical: true,
    asNavFor: '#product-main-img',
		responsive: [{
        breakpoint: 991,
        settings: {
					vertical: false,
					arrows: false,
					dots: true,
        }
      },
    ]
  });

	 // Product img zoom
   var zoomMainProduct = document.getElementById('product-main-img');
   if (zoomMainProduct) {
     $('#product-main-img .product-preview').zoom();
   }
 }

 addToCart(id: number) {
   this.cartService.addProductToCart(id, this.quantityInput.nativeElement.value);
 }

 Increase() {
   let value = parseInt(this.quantityInput.nativeElement.value);
   if (this.product.quantity >= 1){
     value++;

     if (value > this.product.quantity) {
       // @ts-ignore
       value = this.product.quantity;
     }
   } else {
     return;
   }

   this.quantityInput.nativeElement.value = value.toString();
 }

 Decrease() {
   let value = parseInt(this.quantityInput.nativeElement.value);
   if (this.product.quantity > 1){
     value--;

     if (value <= 1) {
       // @ts-ignore
       value = 1;
     }
   } else {
     return;
   }
   this.quantityInput.nativeElement.value = value.toString();
 }
}