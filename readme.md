# Loquor

## Description / Descripcion

Proposal of chat on lan, inspired on http://www.igniterealtime.org/projects/spark/, designed to offer a practical solution without the requirement to install individually in each PC or smartphone

Propuesta de un chat en red interna, inspirado en http://www.igniterealtime.org/projects/spark/, diseñado para ofrecer una solución práctica sin necesidad de instalación individual en cada PC o smartphone.

## Used technologies / Tecnologias usadas

- NodeJs
- HTML
- CSS
- JS
- MySQL

## Used modules / Modulos usados

- Express
- Morgan
- Path
- Socket.io
- Http
- Jsonwebtoken
- Express/router
- MySql
- MySql2

## Endpoints

### Login
- GET /login: Returns the login.html file / Retorna el archivo login.html
- POST /login: Verifies if its a valid user / Verifica si el usuario es valido
### Chat
- POST /chat: Sends a message given the content in the body of the request / Envia el mensaje segun el contenido del body
- GET /chat: Get sent messages between 2 users / Obtiene los mensajes desde la base de datos entre 2 usuarios
- GET /chat/last: Get last sent message from a chat / Obtiene el ultimo mensaje de un chat
- GET /chat/notseen: Get not seen messages from a chat / Obtiene los mensajes no leidos de un chat
- GET /chat/seen: Updates the states of messages from a chat / Actualiza los mensajes de un chat
### Authorize
- POST /Authorize: Generates and returns a jwt / Genera y retorna un jwt #IT WILL CHANGE / BE DELETED#
### Admin
- GET /admin: Returns the loginAdmin.html file / Retorna el archivo loginAdmin.html
- POST /admin: Verifies if its a valid admin user / Verifica si es un usuario admin valido
### Users
- GET /users: Returns a list of the users in the app / Retorna una lista de los usuarios de la app (I should add an authorization method for this endpoint)
- GET /users/status: Returns a given user data / Retorna la informacion de un usuario dado
- POST /users: Add a new user to the DB (Admin auth required) / Agrega un nuevo usuario a la base de datos (Autorizacion de admin requerida)
- PUT /users: Modifies a register (Admin auth required) / Modifica un registro de usuario (Autorizacion de admin requerida)
- DELETE /users: Deletes an user register (Admin auth required) / Elimina un registro de usuario (Autorizacion de admin requerida)

## Example of usage / Ejemplo de uso

![2024-01-03-20-03-14](https://github.com/JulianGonzalezLopez/loquor/assets/94023125/68bc2fe3-507e-418e-a355-baa4005f5b77)



## To do list / Cosas por hacer:

- "Dryify" the code (primarily front)
-  Beautify the admin interface and add more visual information
-  Add error handling
