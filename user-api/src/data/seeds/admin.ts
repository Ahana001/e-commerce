import {Knex} from 'knex';

export async function seed(knex: Knex): Promise<void> { // password: admin
    return knex.raw(`                                  
    INSERT INTO admin (id, name, password, created_at, updated_at, is_deleted) VALUES
    ('ADM_1', 'admin', '21232f297a57a5a743894a0e4a801fc3', '2022-08-01 06:19:27.335941+00', '2022-08-02 09:43:22.473+00', false)
    ON CONFLICT(id) DO NOTHING;

  `);
}