const mysql = require("mysql2/promise");
const mysqlDB = require('mysql');


async function getMessages(user_id, username) {
    try {
      const con = await mysql.createConnection({
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE
      });
  
      const other_user_id = await getUserId(username)
      .catch(err=>{
        throw err;
      });

      const query = "SELECT * FROM messages where (creator_id = ? and recipient_id = ?) or (recipient_id = ? and creator_id = ?)";
      const [rows, fields] = await con.execute(query,[user_id,other_user_id.id,user_id, other_user_id.id])
      .catch(err=>{
        throw err;
      });

      await con.end();
      return rows;
  
    } catch (error) {
      console.error("Error en la eliminacion del usuario:", error);
      throw error; // Propagar el error para que pueda ser manejado en el código que llama a esta función
    }
    
  }

  async function getLastMessage(user_id, username) {
    try {
      const con = await mysql.createConnection({
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE
      });
  
      const other_user_id = await getUserId(username)
      .catch(err=>{
        throw err;
      });

      const query = "SELECT * FROM messages where (creator_id = ? and recipient_id = ?) or (recipient_id = ? and creator_id = ?) ORDER BY ID DESC LIMIT 1";
      const [rows, fields] = await con.execute(query,[user_id,other_user_id.id,user_id, other_user_id.id])
      .catch(err=>{
        throw err;
      });

      await con.end();
      return rows;
  
    } catch (error) {
      console.error("Error en la eliminacion del usuario:", error);
      throw error; // Propagar el error para que pueda ser manejado en el código que llama a esta función
    }
    
  }

  async function getNotSeenMessages(user_id, username) {
    try {
      const con = await mysql.createConnection({
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE
      });
  
      const other_user_id = await getUserId(username)
      .catch(err=>{
        throw err;
      });

      const query = "SELECT * FROM messages where ((creator_id = ? and recipient_id = ?) or (recipient_id = ? and creator_id = ?)) AND seen = 0";
      const [rows, fields] = await con.execute(query,[user_id,other_user_id.id,user_id, other_user_id.id])
      .catch(err=>{
        throw err;
      });
      await con.end();
      return rows;
  
    } catch (error) {
      console.error("Error en la eliminacion del usuario:", error);
      throw error; // Propagar el error para que pueda ser manejado en el código que llama a esta función
    }
    
  }

  async function setMessagesToSeen(user_id, username, time) {
    try {
      const con = await mysql.createConnection({
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE
      });
  
      const other_user_id = await getUserId(username)
      .catch(err=>{
        throw err;
      });

      let query = "UPDATE messages SET seen = TRUE where creator_id = ? AND recipient_id = ? AND date <= ?";
      [rows, fields] = await con.execute(query, [other_user_id.id, user_id, time])
      .catch(err=>{
        throw err;
      });

      await con.end();
      return rows;
  
    } catch (error) {
      console.error("Error en la actualizar el estado de los mensajes:", error);
      throw error; // Propagar el error para que pueda ser manejado en el código que llama a esta función
    }
    
  }



  async function sendMessage(user_id, recipient_username, message) {
    try {
      const con = await mysql.createConnection({
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE
      });
  
      if(message == "" || message == null){
        throw {
          "en":"The message's body can't be empty",
          "es":"El cuerpo del mensaje no puede estar vacio"
        };
      };

      if(user_id == "" || user_id == null){
        throw{
          "en":"Seems like you tried to break the program, bad boy. The user id can't be empty",
          "es": "Parece que quisiste romper el programa, chico malo. El id de usuario no puede estar vacio"
        }
      }

      const other_user_id = await getUserId(recipient_username)
      .catch(err=>{
        throw err;
      });

      const query = "INSERT INTO messages(creator_id, recipient_id, body, date) VALUES(?,?,?,NOW())";
      const [rows, fields] = await con.execute(query,[user_id,other_user_id.id, message]);
      await con.end();
      return rows;
  
    } catch (error) {
      console.error("Error obtencion del id del usuario:", error);
      throw error; // Propagar el error para que pueda ser manejado en el código que llama a esta función
    }
  }



  async function getUserId(recipient_username){
    try {
        const con = await mysql.createConnection({
          host: process.env.HOST,
          user: process.env.USER,
          password: process.env.PASSWORD,
          database: process.env.DATABASE
        });
    
        if(recipient_username == ""){
          throw {
            "en":"You have to choose an user to send a message",
            "es":"Tienes que seleccionar un usuario para enviar un mensaje"
          };
        }

        const query = "SELECT id FROM users where username = ?";
        const [rows, fields] = await con.execute(query,[recipient_username]);
        await con.end();
        return rows[0];

      } catch (error) {
          throw error; // Propagar el error para que pueda ser manejado en el código que llama a esta función
      }
  }

  async function getUsername(id){
    try {
        const con = await mysql.createConnection({
          host: process.env.HOST,
          user: process.env.USER,
          password: process.env.PASSWORD,
          database: process.env.DATABASE
        });
    
        if(id == ""){
          throw {
            "en":"You have to choose an user to send a message",
            "es":"Tienes que seleccionar un usuario para enviar un mensaje"
          };
        }

        const query = "SELECT username FROM users where id = ?";
        const [rows, fields] = await con.execute(query,[id]);
        await con.end();
        return rows[0];

      } catch (error) {
          throw error; // Propagar el error para que pueda ser manejado en el código que llama a esta función
      }
  }

  async function getUsersId(){
    try {
        const con = await mysql.createConnection({
          host: process.env.HOST,
          user: process.env.USER,
          password: process.env.PASSWORD,
          database: process.env.DATABASE
        });


        const query = "SELECT id FROM users";
        const [rows, fields] = await con.execute(query);
        await con.end();
        return rows;

      } catch (error) {
          throw error; // Propagar el error para que pueda ser manejado en el código que llama a esta función
      }
  }


  module.exports = {getMessages, getUsername, getUserId, sendMessage, getUsersId, getLastMessage, getNotSeenMessages, setMessagesToSeen};