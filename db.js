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

const getContacts = (req, res) => {
    pool.query('SELECT * from contact limit 5', (err, results) => {
        if (err) throw err;
        for (let row of results.rows) {
            console.log(JSON.stringify(row));
        }
        res.status(200).json(results.rows);
    })
};
const getNames = (req, res) => {
    console.log(`db getNames`);
    pool.query('SELECT first_name, last_name FROM contact ORDER BY last_name ASC', (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    })
};
const updateContactFirstNameById = (req, res) =>{
    let id  = req.params.id;
    let firstname = req.params.firstname;
    pool.query('update contact set first_name = $1 where id = $2 returning *', 
    [firstname, id], 
    (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    })
}
const updateContactById = (req, res) =>{
    let id  = req.params.id;
    pool.query('SELECT * from contact where id = $1', 
    [id], 
    (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    })
}

module.exports = {sortDec, sortAsc, users, getContacts, getNames, updateContactFirstNameById, updateContactById, newUser};