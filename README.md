## Tech Stack :

- **Backend:** NodeJs
- **Language:** Typescript
- **Library:** Joi(Request Validation) Knex.js(database interactions)
- **Database:** PostgreSQL
- **Code Editor and tools**: VS Code
- **Unit Testing**: Jest


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
2. Cart
3. Coupon
4. Vendor Onboarding
5. Payment Integration

## Future Optimization.

1. Redis Caching
2. Message Queue

## Contribution

**Create Migration**
```
knex migrate:make migration_name --knexfile path/to/your/knexfile.js

# create customer migration
knex migrate:make customer --knexfile src/data/knex.ts
# or
npx knex migrate:make customer --knexfile src/data/knex.ts
```





