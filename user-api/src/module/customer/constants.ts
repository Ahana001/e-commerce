
class Table {
  static readonly TableName = 'customer';
  static readonly ColumnNames = {
    id: 'id',
    name: 'name',
    password: 'password',
    created_at: 'created_at',
    updated_at: 'updated_at',
    is_deleted: 'is_deleted',
  };
}

export default Table;
