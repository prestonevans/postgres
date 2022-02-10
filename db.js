//api to the database
const Pool = require('pg').Pool;
const {v4 : uuidv4} = require('uuid');
const herokudb = process.env.HEROKU_DB || false;

let dbURL = {
    connectionString: process.env.DATABASE_URL
}

//additional flags needed for local app to access remote db on heroku
//https://security.stackexchange.com/questions/229282/is-it-safe-to-set-rejectunauthorized-to-false-when-using-herokus-postgres-datab
if(herokudb){
    dbURL.ssl= { 
        sslmode: 'require', 
        rejectUnauthorized: false };
}

const pool = new Pool(dbURL);

pool.connect();

const newUser = (req, res) => {
    pool.query("insert into contact (first_name, last_name, email, age, role, password) values ('"+req.body.firstName+"','"+req.body.lastName+"','"+req.body.emailAddress+"',"+req.body.age+",'"+req.body.role+"','"+req.body.password+"') RETURNING *", (error, results) => {
        if (error) {
            throw error;
        } 
        res.status(200).json(results.rows);
    })
}

const users = (req,res) => {
    pool.query('SELECT * FROM contact', (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    })
} 

const sortAsc = (req,res) => {
    pool.query('SELECT * FROM contact ORDER BY last_name ASC', (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    })
} 

const sortDec = (req,res) => {
    pool.query('SELECT * FROM contact ORDER BY last_name DESC', (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    })
} 

const removeUser = (req,res) => {
    let firstName  = req.body.name;
    pool.query('DELETE from contact where first_name = $1 returning *', 
    [firstName], 
    (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    })
}

const updateContactByFirstName = (req, res) =>{
    let firstName  = req.body.name
    let role = req.body.role
    pool.query('update contact set role = $2 where first_name = $1 returning *', 
    [firstName, role], 
    (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    })
}

const searchByFirst = (req, res) => {
    let firstName  = req.body.name
    pool.query('SELECT * from contact where first_name = $1',
    [firstName], 
    (err, results) => {
        if (err) throw err;
        for (let row of results.rows) {
            console.log(JSON.stringify(row));
        }
        res.status(200).json(results.rows);
    })
};

module.exports = {searchByFirst,updateContactByFirstName, removeUser, sortDec, sortAsc, users, newUser};