# Loquor
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
- POST /login: Verifies if its a valid user / Verifica si el usuario es valido
### Chat
- POST /chat: Sends a message given the content in the body of the request / Envia el mensaje segun el contenido del body
- GET /chat: Obtains sent messages between 2 users / Obtiene los mensajes desde la base de datos entre 2 usuarios
### Authorize
- POST /Authorize: Generates and returns a jwt / Genera y retorna un jwt #IT WILL CHANGE / BE DELETED#
### AdminPanel #IT WILL CHANGE / BE DELETED#
### Admin #IT WILL CHANGE / BE DELETED#


## Example of usage / Ejemplo de uso
This is an early stage example of usage of Loquor, I expect to improve the user interface even more (eliminate / hide chat related stuff when a chat has not been clicked)
![2023-12-10-17-31-23](https://github.com/JulianGonzalezLopez/loquor/assets/94023125/62ef8d25-3535-4a17-908d-ac9cff0ef1aa)


## To do list / Cosas por hacer:
- Improve visuals
- Divide CSS and JS from HTML (not doing it out of laziness, ngl)
- Change the way messages are passed onSent
- Delete console.logs
- Make it more bullet proof
- Add a way for admins to access adminPanel.html (Probably I'll add .env variables for them to select an user and password and add a verification based on that info)
- Divide messages on the user interface so that recived msgs appear on the left and those sent on the right

## Possibilities
- Add amount of unread msg per chat
- Show if an used has read your msg
- Show if an user is on
