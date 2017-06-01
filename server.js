var compression = require('compression');
var express = require('express');
var cors = require('cors');
var morgan = require('morgan');
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
app.use(express.static('build'))
app.use(compression());
app.use(helmet());
app.use(cors())

if (app.get('env') === 'development') {
  app.use(errorHandler());
  console.log('errorHandle loaded!');
}

app.use(morgan('dev'))  // combined
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
            db.query('SELECT * FROM benchsci.genes WHERE gene = $1 ORDER BY figure_number ASC',
            [String(name)],	function(err, table){
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
app.post('/create', function( request, response) {
    var username = request.body.username;
    var password = request.body.password;
    console.log(username);
    pool.connect((err, db, done) => {
    done();
    if(err){
        console.error('error open connection', err);
        return response.status(400).send({error: err});
    } else {
      // Check if user already exists
      db.query('SELECT * FROM benchsci.users WHERE username = $1',
        [username], function(err, table){
          done();
          // no error -> user was retrieved
          if(!err){
              return response.status(400).send({error:err})
          } else {
              db.query('INSERT INTO benchsci.users ( username, password ) VALUES ($1,$2);',
                  [username, password], (err, table) => {
                  if(err) {
                      console.error('error running query', err);
                      return response.status(400).send({error: err});
                  } else {
                      console.log('Data Inserted');
                      response.status(201).send({ message: 'Data Inserted!'})
                  }
              })
            }
          })
        }
    });
});

// POST /users/login => authenticate user
app.post('/login', function(request, response){
    var username = request.body.username;
    var password = request.body.password;

    pool.connect(function(err,db,done){
        if(err){
            console.error(err);
            response.status(500).send({ 'error' : err});
        } else{
            db.query('SELECT * FROM benchsci.users WHERE username = $1 and password = $2',
		          [username, password], function(err, table){
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
    var username = request.params.username;

    pool.connect(function(err,db,done){
        if(err){
            console.error(err);
            response.status(500).send({ 'error' : err});
        } else{
            db.query('SELECT publications FROM benchsci.userpubs WHERE username = $1',
		          [String(username)], function(err, table){
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
    var username = request.params.username;
    var password = request.body.password;
    var pub_id = request.body.pubID;

    pool.connect(function(err,db,done){
        if(err){
            console.error(err);
            response.status(500).send({ 'error' : err});
        } else {
          // Check if user already exists
          db.query('SELECT * FROM benchsci.users WHERE username = $1 and password=$2',
            [username, password], function(err, table){
              done();
              // no user was retrieved
              if(err){
                  return response.status(400).send({error:err})
              } else {
                db.query('INSERT INTO benchsci.userpubs(username, pub_id) values ($1, $2)',
      		         [username, pub_id], function(err, table){
                    done();
                    if(err){
                        return response.status(400).send({error:err})
                    } else {
                        return response.status(200).send(table.rows)
                    }
                });
              }
            });
        }
    });
});

// DELETE /{username}/publications => remove publication for authenticated user
app.delete('/api/users/:name/publications', function(request, response){
    var username = request.params.username;
    var pub_id = request.body.pubID;

    pool.connect(function(err,db,done){
        if(err){
            return response.status(400).send(err)
        } else{
            db.query('DELETE FROM benchsci.userpubs WHERE username = $1 and pub_id=$3',
		          [username, password, pub_id], function(err, result){
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
