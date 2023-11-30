const mysql = require("mysql");

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root"
  });
  
con.connect(function(err) {
    if (err) throw err;
        console.log("Connected!");
        con.query("CREATE DATABASE IF NOT EXISTS mydb", function (err, result) {
    if (err) throw err;
        console.log("Database created");
    });
});

con.connect(function(err){
    if(err) throw err;
    console.log("ok");
    con.query("CREATE TABLE")
});
