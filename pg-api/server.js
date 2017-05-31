var compression = require('compression');
var express = require('express');
var cors = require('cors');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler')
var pg = require('pg');

const PORT =  10675;

let pool = new pg.Pool({
    database: 'perei345_309',
    user: 'perei345',
    password: '',
    host: 'mcsdb.utm.utoronto.ca',
    port: 5432,
    ssl: false,
    max: 20, //set pool max size to 20
    min: 4, //set min pool size to 4
    idleTimeoutMillis: 1000 //close idle clients after 1 second
});

// Security 
var helmet = require('helmet');
var app = express();
app.use(compression());
app.use(helmet());
app.use(cors())

if (app.get('env') === 'development') {
  app.use(errorHandler());
  console.log('errorHandle loaded!');
}

app.use(logger('dev'))  // combined
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use( (req, res, next ) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// GET /genes => retrieves all gene types in database
app.get('/api/genes', function(request, response){
    pool.connect(function(err,db,done){
        if(err){
            console.error(err);
            response.status(500).send({ 'error' : err});
        } else{
            db.query('SELECT distinct gene FROM benchsci.genes ORDER BY gene ASC', 
		function(err, table){
                done();
                if(err){
                    return response.status(400).send({error:err})
                } else
                {
                    return response.status(200).send(table.rows)
                }
            })
        }
    })
});

// GET /genes/:name => retrieves gene data by name
app.get('/api/genes/:name', function(request, response){
    var name = request.params.name;

    pool.connect(function(err,db,done){
        if(err){
            console.error(err);
            response.status(500).send({ 'error' : err});
        } else{
            db.query('SELECT * FROM benchsci.genes WHERE gene = $1', [String(name)], 
		function(err, table){
                done();
                if(err){
                    return response.status(400).send({error:err})
                } else
                {
                    return response.status(200).send(table.rows)
                }
            })
        }
    })
});

// POST /users/add => creates new user
app.post('/api/users/add', function( request, response) {
    var user_name = request.body.name;
    var password = request.body.password;
    var email = request.body.email;

    let user_values = [user_name, password, email];

    pool.connect((err, db, done) => {

    done();
    if(err){
        console.error('error open connection', err);
        return response.status(400).send({error: err});
    }
    else {
        db.query('INSERT INTO benchsci.users ( user_name, password, email ) VALUES ($1,$2,$3)',
            [...user_values], (err, table) => {
            if(err) {
                console.error('error running query', err);
                return response.status(400).send({error: err});
            }
            else {
                console.log('Data Inserted: ' + id );
                response.status(201).send({ message: 'Data Inserted! ' + id})
            }
        })
    }
    });
    console.log(request.body);
});

// POST /users/login => authenticate user
app.post('/api/users/login', function(request, response){
    var user_name = request.body.name;
    var password = request.body.password;
    let user_values = [user_name, password];

    pool.connect(function(err,db,done){
        if(err){
            console.error(err);
            response.status(500).send({ 'error' : err});
        } else{
            db.query('SELECT * FROM benchsci.users WHERE user_name = $1 and password = $2', 
		[...user_values], function(err, table){
                done();
                if(err){
                    return response.status(400).send({error:err})
                } else
                {
                    return response.status(200).send(table.rows)
                }
            })
        }
    })
});

// GET ../{username}/publications => retrieves publications saved by user
app.get('/api/users/:name/publications', function(request, response){
    var user_name = request.params.name;

    pool.connect(function(err,db,done){
        if(err){
            console.error(err);
            response.status(500).send({ 'error' : err});
        } else{
            db.query('SELECT * FROM benchsci.userpubs WHERE user_name = $1', 
		[String(user_name)], function(err, table){
                done();
                if(err){
                    return response.status(400).send({error:err})
                } else
                {
                    return response.status(200).send(table.rows)
                }
            })
        }
    })
});

// POST .../{username}/publications => save publication for authenticated user
app.post('/api/users/:name/publications', function(request, response){
    var user_name = request.body.name;
    var password = request.body.password;
    var pub_id = request.body.pubID;
    let user_values = [user_name, password, pub_id];

    pool.connect(function(err,db,done){
        if(err){
            console.error(err);
            response.status(500).send({ 'error' : err});
        } else{
            db.query('INSERT INTO benchsci.userpubs(pub_id) values pub_id=$3 WHERE user_name = $1 and password = $2', 
		[...user_values], function(err, table){
                done();
                if(err){
                    return response.status(400).send({error:err})
                } else
                {
                    return response.status(200).send(table.rows)
                }
            })
        }
    })
});

// DELETE /{username}/publications => remove publication for authenticated user
app.delete('/api/users/:name/publications', function(request, response){
    var user_name = request.body.name;
    var password = request.body.password;
    var pub_id = request.body.pubID;
    let user_values = [user_name, password, pub_id];
	
    pool.connect(function(err,db,done){
        if(err){
            return response.status(400).send(err)
        } else{
            db.query('DELETE FROM benchsci.userpubs WHERE user_name = $1 and password=$2 and pub_id=$3', 
		[...user_values], function(err, result){
                done(); 
                if(err){
                    return response.status(400).send(err)
                } else
                {
                    return response.status(200).send({message:'success delete record'})
                }
            })
        }
    })
    console.log(id);
});


app.listen( PORT, () => console.log('Listening on port ' + PORT) );

module.exports = app;
