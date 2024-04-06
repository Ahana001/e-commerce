export interface IOrder {
  id?: number;
  customer_id?: string;
  order_status?: OrderStatus;
  order_acceptance_status?: OrderAcceptanceStatus;
  total_customer_payable?: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface IGetCustomerOrdersAsAdmin {
  order_id: number;
  admin_id: string;
}

export interface IGetCustomerOrders {
  order_id: number;
  customer_id: string;
}

export enum OrderStatus {
  PLACED = 'placed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  PENDING = 'pending',
}

export enum OrderAcceptanceStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

export interface IProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
}

export interface IProductReq{
  quantity:number;
  id:string;
}

export interface IPlaceOrderRequest{
  customer_id: string;
  products: IProductReq[];
}

export interface ICartResponse{
  cart_status?: boolean;
  total_customer_payable?: number;
  customer_id?: string;
  products?: IProductRes[]
}

export interface IProductRes extends IProductReq {
  name:string;
  description:string;
  stock: number
  price: number;
}

