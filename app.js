const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({extended:true}));
const db = require('./db');

app.get('/getNames', db.getNames);
app.get('/getContacts', db.getContacts);
app.get('/updateContactFirstNameByIds/id/:id/firstname/:firstname', db.updateContactFirstNameById);
app.get('/updateContactById/id/:id', db.updateContactById);

app.get('/', (req, res)=>{
    res.send('hello');
})

app.listen(port, ()=>{
    console.log(`server is up on port ${port}`);
})
