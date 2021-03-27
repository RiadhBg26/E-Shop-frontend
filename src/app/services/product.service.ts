import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders  } from '@angular/common/http'
import { environment } from '../../environments/environment';
import { Observable, from } from 'rxjs';
import { ProductModelServer} from '../models/typescript.model'
import { ServerResponse } from '../models/typescript.model';
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private SERVER_URL = environment.SERVER_URL

  constructor(private http: HttpClient, private router: Router) { }

  getAllProducts(numberOfResults = 10): Observable<ServerResponse> {
    return this.http.get<ServerResponse>(this.SERVER_URL + '/products', {
        params: {
          limits: numberOfResults.toString()
        }

    })
  }

  //get single product
  getSingleProduct(id: number): Observable <ProductModelServer> {
    return this.http.get<ProductModelServer>(this.SERVER_URL +'/products/' + id)
  };

  getProdFromCategory(catName: string): Observable<ProductModelServer[]>{
    return this.http.get<ProductModelServer[]>(this.SERVER_URL + '/product/category/' + catName)
  }


}
