
class Table {
  static readonly TableName = 'product';
  static readonly ColumnNames = {
    id: 'id',
    name: 'name',
    description: 'description',
    price: 'price',
    stock: 'stock',
    created_at: 'created_at',
    updated_at: 'updated_at',
    is_deleted: 'is_deleted',
  };
}

export default Table;
