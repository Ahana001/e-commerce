import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
    const products = [
        { id: 'PROD_1022',name: 'Product 2',price:120, description: 'Description for Product 2', stock: 150 },
        { id: 'PROD_1023',name: 'Product 3',price:110, description: 'Description for Product 3', stock: 200 },
        { id: 'PROD_1024',name: 'Product 4',price:100, description: 'Description for Product 4', stock: 80 },
        { id: 'PROD_1025',name: 'Product 5',price:80, description: 'Description for Product 5', stock: 120 },
        { id: 'PROD_1026',name: 'Product 6',price:70, description: 'Description for Product 6', stock: 90 },
        { id: 'PROD_1027',name: 'Product 7',price:75, description: 'Description for Product 7', stock: 180 },
        { id: 'PROD_1028',name: 'Product 8',price:250, description: 'Description for Product 8', stock: 220 },
        { id: 'PROD_1029',name: 'Product 9',price:10, description: 'Description for Product 9', stock: 130 },
        { id: 'PROD_1030',name: 'Product 1',price:20, description: 'Description for Product 1', stock: 100 },
        { id: 'PROD_1031',name: 'Product 10',price:45, description: 'Description for Product 10', stock: 170 }
    ];

    await knex('product').insert(products).onConflict().ignore();
}