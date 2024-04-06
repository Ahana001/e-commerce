## Tech Stack :

- **Backend:** NodeJs
- **Language:** Typescript
- **Library:** Joi(Request Validation) Knex.js(database interactions)
- **Database:** PostgreSQL
- **Code Editor and tools**: VS Code

## Folder Structure 📒
<pre>
    |───order-api
    |───product-api
    └───user-api
  
</pre>
  <br />


## To Start Project

**PostgreSQL Install**
https://www.pgadmin.org/download/


**Create Migration**
```
knex migrate:make migration_name --knexfile path/to/your/knexfile.js

# create customer migration
knex migrate:make customer --knexfile src/data/knex.ts
# or
npx knex migrate:make customer --knexfile src/data/knex.ts
```

## How To Run Locally

 To start contributing, follow the below guidelines:

**1.** Fork [this](https://github.com/Ahana001/e-commerce.git) repository.

**2.** Clone your forked copy of the project.

```
git clone https://github.com/Ahana001/e-commerce.git
```

**3.** Navigate to the project directory.

```
cd e-commerce
```

**4.** set up .env for any service

**5.** Navigate to the project directory.

```
cd user-api
```

**6.** execute below command
```
npm run start
```

## Planned Enhancement

1. Invoice
2. Coupon
3. Vendor Onboarding
4. Payment Integration




