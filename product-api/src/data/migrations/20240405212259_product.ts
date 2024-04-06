import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.raw(`
        CREATE SEQUENCE product_id_seq
            INCREMENT BY 1
            MINVALUE 1
            MAXVALUE 9223372036854775807
            START 1000
            CACHE 1
            NO CYCLE;
        
        CREATE TABLE IF NOT EXISTS product (
            "id" varchar(255) NOT NULL DEFAULT (('PROD_'::text || nextval('product_id_seq'::regclass))),
            "name" VARCHAR NOT NULL,
            "description" VARCHAR NULL,
            "price" numeric(9, 2) NOT NULL,
            "stock" INTEGER NOT NULL DEFAULT '0',
            "is_deleted" BOOLEAN NOT NULL DEFAULT false,
            "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY ("id")
        );
        
        ALTER SEQUENCE product_id_seq OWNED BY product.id;
    `);
}

export async function down(knex: Knex): Promise<void> {
    await knex.raw(`
        DROP TABLE IF EXISTS product CASCADE;
        DROP SEQUENCE IF EXISTS product_id_seq;
    `);
}


