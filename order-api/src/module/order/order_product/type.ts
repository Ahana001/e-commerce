export interface IOrderProduct{
    id?:number;
    order_id: number;
    quantity: number;
    name: string;
    description: string;
    price: number;
    product_id: string;
    created_at?: Date;
    updated_at?: Date;
}