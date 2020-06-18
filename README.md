# HomeSchool'd API

The api for the HomeSchool'd app was created with Node JS and is organized around REST. It uses a database with tables for school logs and accpets GET, POST, PATCH and DELETE requests.

## API Utilizes

- Express
- Knex
- PostgresSQL
- Morgan
- CORS.

### Testing

- Mocha
- Supertest

### Deployed with Heroku

https://sheltered-bayou-81001.herokuapp.com//api

### Front End

https://github.com/pdrufo/homeschooled-client

## API Overview

## Add School Log

Adds schoolLog to database

## URL

```javascript
/api/school-logs
```

- Method

```
POST
```

- Body Params\
  school_date\
  student\
  english\
  math\
  specialty\
  notes

- Success Response\
  Code: 201

- Error Response\
  Code: 400

- Sample Call
  ```javascript
  fetch(`${config.API_ENDPOINT}/school-logs`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(newSchoolLog),
  });
  ```

---

## URL

```javascript
/api/school-logs/:id
```

- Method

```
GET
```

- Body Params\
  id

- Success Response\
  Code: 200

- Error Response\
  Code: 404

- Sample Call
  ```javascript
   fetch(`${config.API_ENDPOINT}/school-logs/${id}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
  };
  ```

---

## URL

```javascript
/api/school-logs/:id
```

- Method

```
DELETE
```

- Body Params\
  id

- Success Response\
  Code: 200

- Error Response\
  Code: 404

- Sample Call
  ```javascript
   fetch(`${config.API_ENDPOINT}/school-logs/${id}`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
      },
    })
  };
  ```

---

## URL

```javascript
/api/school-logs/:id
```

- Method

```
PATCH
```

- Body Params\
  id

- Success Response\
  Code: 200

- Error Response\
  Code: 404

- Sample Call
  ```javascript
  fetch(`${config.API_ENDPOINT}/school-logs/${id}`, {
    method: "PATCH",
    body: JSON.stringify(newSchoolLog),
    headers: {
      "content-type": "application/json",
    },
  });
  ```

---

## URL

```javascript
/api/school-logs/:id
```

- Method

```
GET
```

- Body Params\
  id

- Success Response\
  Code: 200

- Error Response\
  Code: 404

- Sample Call
  ```javascript
  fetch(`${config.API_ENDPOINT}/school-logs/${id}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  });
  ```

---
