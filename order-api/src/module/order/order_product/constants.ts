class Table {
  static readonly TableName = 'order_product';
  static readonly ColumnNames = {
    id: 'id',
    order_id: 'order_id',
    quantity: 'quantity',
    name: 'name',
    description: 'description',
    price: 'price',
    product_id: 'product_id',
    created_at: 'created_at',
    updated_at: 'updated_at',
  };
}

export default Table;

