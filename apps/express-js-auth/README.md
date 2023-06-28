# Express App

This is an Express.js application for user authentication and registration.

## Features

- User registration with username and password
- User login with username and password
- Password hashing for secure storage
- JWT-based authentication using JSON Web Tokens
- MongoDB for data storage

## Prerequisites

- Node.js 
- Docker

## Getting Started

1. Set up environment variables:
- Create a **.env**  file in the root directory of the project.
- Add the following variables:
```shell
	PORT=3005
    JWT_SECRET=<your-secret-key>
    MONGODB_URI=mongodb://localhost:27017/user-mgmt-db
```
Make sure to replace <your-secret-key> with a secure secret key for JWT token signing.

2.  Mongo instance 

Run the following command on the root of this monorepo to start the Docker Compose setup:

```shell
docker-compose up
```
3. Start the server

```shell
pnpm start
```
