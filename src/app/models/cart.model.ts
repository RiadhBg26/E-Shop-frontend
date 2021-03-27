import { ProductModelServer } from "./typescript.model";


export interface CartModelPublic {
    total: number;
    prodData: [{
        id: number,
        inCart: number
    }]
}


export interface CartModelServer {
    totalAmount: number;
    data: [{
        prod: ProductModelServer,
        numInCart: number
    }]
}

