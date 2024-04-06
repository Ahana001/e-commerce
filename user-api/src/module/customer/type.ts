export interface Validation_Req {
    name : string;
    password : string;
}

export interface Customer {
  id: string;
  name: string;
  password?: string;
  created_at?: Date;
  updated_at?: Date;
  is_deleted?: boolean;
}