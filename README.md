# Backend

This repository contains code for the backend used to power Privacybear.

## Schemas

## User Schema
```js
  name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 7
    },
    avatar: {
        type: String,
        required: false
    },
    timestamp: {
        type: String,
        default: new Date().getTime()
    }
```

### History Schema
```js
    user: {
        type: ObjectId,
        ref: 'User',
        required: true,
    },
    site: {
        type: String,
        required: true,
        trim: true
    },
    url: {
        type: String,
        required: true,
        trim: true,
    },
    permissions: [{
        type: String,
        required: true,
        trim: true
    }],
    timestamp: {
        type: String,
        default: new Date().getTime()
    }
```

## Routes (User)

### GET /users
Requires the authentication token in header (``Authorization``, ``Bearer YOUR_TOKEN_HERE``) and returns a user object or an error. Fetches User information.

Response:
```json

{
  "user": {
    "name": "Name of the User",
    "email": "Email address of the User",
    "avatar": "Avatar of the User",
    "timestamp": "Timestamp of creation"
  }
}

```

### POST /users
Takes the following fields in JSON(application/json) and returns the user and token for authentication.

**name** - Name of the user.
**email** - Email of the user.
**password** - Password of the user.

Response:
```json
{
  "user":{
    "name": ....,
    "email": .....,
    "password": hashed(....),
    "avatar": data:svg,
  },
  "token": ....
}
```

### POST /users/login

Takes the following fields in JSON(application/json) and returns the token for authentication if email/password combination is valid.

**email** - Email of the user.
**password** - Password of the user.

Response:
```json
{
  "user":{
    "name": ....,
    "email": .....,
    "avatar": data:svg,
    "timestamp": .....,
  }
  "token": ....
}
```

### POST /users/change-password (requires token)

Takes the following fields in JSON(application/json) as well as the authentication token in header (``Authorization``, ``Bearer YOUR_TOKEN_HERE``) and returns a confirmation or an error.

**password** - Password of the user.

Response:
```json
{
  "status" or "error": ....
}
```

## Routes (History)

### GET /history (requires token)

Requires the authentication token in header (``Authorization``, ``Bearer YOUR_TOKEN_HERE``) and returns a JSON object with all the records.

Response:
```json
{
  "records": Number of records,
  "history": [
    {
      "permissions": ['LOCATION', 'COOKIES', ...],
      "timestamp": "1595312359042",
      "_id": "5f1688e7713f243bdccb3734",
      "user": "5f167d9c45cbf425c0fda3ff",
      "site": "Auxin",
      "url": "https://getauxin.com/"
    },
    ...
  ]
}
```

### POST /history/add (requires token)

Takes the following fields in JSON(application/json) as well as the authentication token in header (``Authorization``, ``Bearer YOUR_TOKEN_HERE``) and returns a confirmation or an error.

**site** - Site name.
**url** - URL of the site.
**permissions** - Permissions stored in an array of strings.

Response:
```json
{
  "status" or "error": ....
}
```

### DELETE /history/ (requires token)

Requires the authentication token in header (``Authorization``, ``Bearer YOUR_TOKEN_HERE``) and returns a confirmation or an error. Deletes all records.

Response:
```json
{
  "status" or "error": ....
}
```

### DELETE /history/:id (requires token)

Takes the **_id** of the record in the URL parameter as well as the authentication token in header (``Authorization``, ``Bearer YOUR_TOKEN_HERE``) and returns a confirmation or an error. Deletes one record.

Response:
```json
{
  "status" or "error": ....
}
```