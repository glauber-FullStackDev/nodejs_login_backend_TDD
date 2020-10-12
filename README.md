<div style="width: 100%; display: flex; align-items: center; justify-content: center;">
    <img width="200px" src="./logo.png" alt="">
</div>

# NodeJs Authenticate Back-end

NodeJS authenticate backend TDD with express + Sequelize + JEST.

Authentication is done through a JWT token, providing greater security and providing a way to encrypt data so that user identification and the passage of sensitive data is simpler.

---
## Requirements

For development, you will only need Node.js installed in your environement.

### Node
- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v8.11.3

    $ npm --version
    6.1.0

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g

---

## Install

    $ git clone https://github.com/YOUR_USERNAME/PROJECT_TITLE
    $ cd PROJECT_TITLE
    $ yarn install

## Configure app

Open `.env` file then edit  the credentials of the local database or the server running your database.

`DB_HOST`=YOUR_HOST_DB<br>
`DB_USER`=YOUR_USER_DB<br>
`DB_PASS`=YOUR_PASSWORD_DB<br>
`DB_NAME`=YOUR_DB_NAME<br>
`APP_SECRET`=YOUR_SECRET_WORD_TO_JWT<br>

## Running the project

    $ npm start

## Simple build for production

    $ npm build

# API Documentation
This API uses `POST` and `GET` request to communicate. All responses come in standard JSON. All requests must include a `content-type` of `application/json` and the body must be valid JSON.

## Response Codes 
### Response Codes
```
200: Success
400: Bad request
401: Unauthorized
404: Cannot be found
405: Method not allowed
422: Unprocessable Entity 
50X: Server Error
```

### Example Error Message
```json
http code 400
{
    "code": 400,
    "message": "invalid crendetials"
}
```

## Login
**You send:**  Your  login credentials.<br>
**You get:** An `token` with wich you can make further actions.

**Request:**
```json
POST /sessions HTTP/1.1
Accept: application/json
Content-Type: application/json

{
    "email": "foo@foo.com",
    "password": "1234567" 
}
```
**Successful Response:**
```json
HTTP/1.1 200 OK
Server: My RESTful API
Content-Type: application/json

{
   "token": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
}
```
**Failed Response:**
```json
HTTP/1.1 401 Unauthorized
Server: My RESTful API
Content-Type: application/json
Content-Length: xy

{
    "code": 401,
    "message": "Incorrect password."
}
``` 