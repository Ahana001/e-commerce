import axios from 'axios';
import { ICartResponse, IOrder, IPlaceOrderRequest, IProduct, IProductReq, IProductRes, OrderAcceptanceStatus, OrderStatus } from "./type";
import { IError } from '../../utilities/controllers/handle_response';
import { Knex } from 'knex';
import { IOrderProduct } from './order_product/type';
import { bulkInsertOrder } from './models';
import { bulkInsertOrderProduct } from './order_product/models';

export async function getProductsDetails(
    product_ids:string[]
): Promise<IProduct[]> {
  const result = await axios
    .post<{result: { products: IProduct[] }}>(
      (process.env.PRODUCT_API_URL || '') +
        '/internal/product/',
      {
        ids:product_ids
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    .then(response => {
      return response.data.result.products;
    })
    .catch(error => {
      console.log('FAILED WHILE GETTING PRODUCT DETAILS');
      throw error;
    });
  return result;
}

export async function updateProductStock(
    products:{id:string, quantity:number}[]
): Promise<IProduct[]> {
  const result = await axios
    .post<{result: { products: IProduct[] }}>(
      (process.env.PRODUCT_API_URL || '') +
        '/internal/product/update',
      {
        products: products
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    .then(response => {
      return response.data.result.products;
    })
    .catch(error => {
      console.log(error)
      console.log('FAILED WHILE UPDATING PRODUCT STOCK');
      throw error;
    });
  return result;
}

export async function checkProductStock(available_products: IProduct[], requested_products: IPlaceOrderRequest['products']){
  const products_unavailable: string[] = [];
  const products_available: IProductRes[] = [];
  let products_available_status = true;

  requested_products.forEach((req_product)=>{
    const find_product = available_products.find((av_product)=>av_product.id === req_product.id);
    if(!find_product || find_product.stock < req_product.quantity){
      products_available_status = false;
      products_unavailable.push(req_product.id);
    }else{
      products_available.push({id: req_product.id, quantity: req_product.quantity, name: find_product.name!, description:find_product.description!, stock: find_product.stock, price: find_product.price})
    }
  });
    const result: {
    products_available_status: boolean;
    products_unavailable?: string[];
    products_available: IProductRes[]
  } = {
    products_available_status: products_available_status,
    products_available: products_available
  };

   if (!products_available_status) {
    result.products_unavailable = products_unavailable;
  }
  return result;
}

export async function validateCart(
  validated_req: IPlaceOrderRequest,
  available_product_details: IProduct[]
){
    const cart_meta_errors: IError[] = [];
    let cart_status = true;

    const validateProductStock = await checkProductStock(available_product_details, validated_req.products);
    if (!validateProductStock.products_available_status) {
        cart_meta_errors.push({
          message: 'products_are_currently_unavailable',
          code: 1030,
          data: validateProductStock.products_unavailable,
        });
        cart_status = false;
    }
    

    const total_customer_payable = validated_req.products.reduce((acc:number, req_product:IProductReq)=>{
      const findProduct = available_product_details.find((av_product)=>av_product.id === req_product.id);
      if(findProduct){
        const price = findProduct.price;
        const totalProductPrice = req_product.quantity * price;
        return acc + totalProductPrice;
      }else{
        return acc;
      }
    },0);

    const populated_cart: ICartResponse = {
      cart_status: cart_status,
      total_customer_payable:total_customer_payable,
      customer_id: validated_req.customer_id,
      products: validateProductStock.products_available
    };
    return {populated_cart, cart_meta_errors};
}

export async function createOrder(
  trx: Knex.Transaction,
  validatedCart: ICartResponse,
) {
  delete validatedCart.cart_status;

  // insert all order data in respective tables
  const order: IOrder = await insertRecords(trx, validatedCart);
  const order_details = {
    order_id: order.id,
    order_acceptance_status: order.order_acceptance_status,
    order_status: order.order_status,
    order_created_at: order.created_at,
    customer_id: validatedCart.customer_id,
    total_customer_payable: validatedCart.total_customer_payable,
    products: validatedCart.products
  };
  return {order_details};
}


export async function insertRecords(
  trx: Knex.Transaction,
  validatedCart: ICartResponse
) {
  const order_status = OrderStatus.PENDING;
  const order_acceptance_status = OrderAcceptanceStatus.PENDING;

  //"order" table data ready for insertion
  const order: IOrder = {
    customer_id: validatedCart.customer_id,
    order_status,
    order_acceptance_status,
    total_customer_payable:
      validatedCart.total_customer_payable,
  };
  const new_order: IOrder = await bulkInsertOrder(trx, [order]);
  const order_products: IOrderProduct[] = [];
  for (
    let item_index = 0;
    item_index < validatedCart.products!.length;
    item_index++
  ) {
    const product = validatedCart.products![item_index];

    order_products.push({
      order_id: new_order.id!,
      product_id: product.id,
      quantity: product.quantity,
      name: product.name,
      price: product.price,
      description: product.description,
    });
    const order_product = (
      await bulkInsertOrderProduct(trx, [order_products[item_index]])
    )[0];
  }
    
  return new_order;
}

