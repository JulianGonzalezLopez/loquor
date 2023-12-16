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
- GET /chat: Obtains sent messages between 2 users / Obtiene los mensajes desde la base de datos entre 2 usuarios
### Authorize
- POST /Authorize: Generates and returns a jwt / Genera y retorna un jwt #IT WILL CHANGE / BE DELETED#
### Admin
- GET /admin: Returns the loginAdmin.html file / Retorna el archivo loginAdmin.html
- POST /admin: Verifies if its a valid admin user / Verifica si es un usuario admin valido
### Users
- GET /users: Returns a list of the users in the app / Retorna una lista de los usuarios de la app (I should add an authorization method for this endpoint)
- POST /users: Add a new user to the DB (Admin auth required) / Agrega un nuevo usuario a la base de datos (Autorizacion de admin requerida)
- PUT /users: Modifies a register (Admin auth required) / Modifica un registro de usuario (Autorizacion de admin requerida)
- DELETE /users: Deletes an user register (Admin auth required) / Elimina un registro de usuario (Autorizacion de admin requerida)

## Example of usage / Ejemplo de uso
This is an early stage example of usage of Loquor, I expect to improve the user interface even more (eliminate / hide chat related stuff when a chat has not been clicked) (DONE)

Este es un ejemplo en las etapas tempranas de Loquor, espero mejorar mas la interfaz de usuario (eliminar / ocultar cosas relacionadas al chat cuando no han sido clickeados) (HECHO)
![2023-12-10-17-31-23](https://github.com/JulianGonzalezLopez/loquor/assets/94023125/62ef8d25-3535-4a17-908d-ac9cff0ef1aa)


## To do list / Cosas por hacer:
- Improve visuals
- Divide CSS and JS from HTML (not doing it out of laziness, ngl)
- Change the way messages are passed onSent
- Delete console.logs
- Divide messages on the user interface so that recived msgs appear on the left and those sent on the right

## Possibilities
- Add amount of unread msg per chat
- Show if an used has read your msg
- Show if an user is on
