export interface IProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  created_at?: Date;
  updated_at?: Date;
  is_deleted?: boolean;
}
