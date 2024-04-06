
class Table {
  static readonly TableName = 'order';
  static readonly ColumnNames = {
    id: 'id',
    customer_id: 'customer_id',
    order_status: 'order_status',
    order_acceptance_status: 'order_acceptance_status',
    total_customer_payable: 'total_customer_payable',
    created_at: 'created_at',
    updated_at: 'updated_at',
  };
}

export default Table;
