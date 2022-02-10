const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const db = require('./db');
const path = require("path"); 

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/',(req,res) => { 
  res.sendFile(path.join(__dirname+'/index.html')); 
}); 

app.post('/newUser', db.newUser);
app.get('/users', db.users);
app.get("/sortA-Z", db.sortAsc);
app.get("/sortZ-A", db.sortDec);
app.post("/removeUser", db.removeUser)
app.post("/updateUserRole", db.updateContactByFirstName)
app.post('/searchByFirst', db.searchByFirst);

app.listen(port, ()=>{
    console.log(`server is up on port ${port}`);
})
