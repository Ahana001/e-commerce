import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.raw(`
        CREATE SEQUENCE customer_id_seq
        INCREMENT BY 1
        MINVALUE 1
        MAXVALUE 9223372036854775807
        START 1000
        CACHE 1
        NO CYCLE;
        CREATE TABLE IF NOT EXISTS customer (
            "id" varchar(255) NOT NULL DEFAULT (('CUST_'::text || nextval('customer_id_seq'::regclass))),
            "name" VARCHAR NOT NULL,
            "password" VARCHAR NOT NULL,
            "is_deleted" BOOLEAN NOT NULL DEFAULT 'false',
            "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY ("id")
        );
        ALTER SEQUENCE customer_id_seq OWNED BY customer.id;

    `);
}


export async function down(knex: Knex): Promise<void> {
    await knex.raw(`
        DROP TABLE IF EXISTS customer CASCADE;
        DROP SEQUENCE IF EXISTS customer_id_seq;
    `);
}

