import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.raw(`
        CREATE TABLE "order" (
           id bigserial NOT NULL,
           customer_id varchar(255) NOT NULL,
           order_status varchar(255) NOT NULL,
           order_acceptance_status varchar(255) NOT NULL,
           total_customer_payable numeric(10, 2) NOT NULL,
           created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
           updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
           CONSTRAINT order_id PRIMARY KEY (id)
        );

        CREATE TABLE order_product (
            order_id int8 NOT NULL,
            quantity int4 NOT NULL,
            "name" varchar(255) NOT NULL,
            description varchar NULL,
            price numeric(10, 2) NOT NULL,
            created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
            product_id VARCHAR NOT NULL,
            id bigserial NOT NULL,
            CONSTRAINT id PRIMARY KEY (id)
        );

        ALTER TABLE order_product ADD CONSTRAINT order_product_order_id_foreign FOREIGN KEY (order_id) REFERENCES "order"(id);
    `);
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(`
    drop table if exists "order" cascade;
    drop table if exists order_product cascade;
    drop table if exists knex_migrations cascade;
    drop table if exists knex_migrations_lock cascade;
  `);
}