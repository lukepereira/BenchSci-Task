var express = require('express');
var compression = require('compression');
var cors = require('cors');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var pg = require('pg');

const PORT = 10675;
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

var app = express();
app.use('/', express.static('build'));

app.use(compression());
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/* Main API: see ./db/schema.sql for PSQL schema */
/* Really need to clean up this code */

// GET /genes => retrieves all gene types in database
app.get('/api/genes', function(request, response) {
  pool.connect(function(err, db, done) {
    if (err) {
      console.error(err);
      response.status(500).send({
        'error': err
      });
    } else {
      db.query('SELECT distinct gene FROM benchsci.genes ORDER BY gene ASC',
        function(err, table) {
          done();
          if (err) {
            return response.status(400).send({
              error: err
            })
          } else {
            return response.status(200).send(table.rows)
          }
        })
    }
  })
});

// GET /genes/:name => retrieves gene data by name
app.get('/:name', function(request, response) {
  var name = request.params.name;

  pool.connect(function(err, db, done) {
    if (err) {
      console.error(err);
      response.status(500).send({
        'error': err
      });
    } else {
      db.query('SELECT * FROM benchsci.genes WHERE gene = $1 ORDER BY figure_number ASC',
      [String(name)], function(err, table) {
        done();
        if (err) {
          return response.status(400).send({
            error: err
          })
        } else {
          return response.status(200).send(table.rows)
        }
      })
    }
  })
});

// POST /create => creates new user
app.post('/create', function(request, response) {
  var username = request.body.username;
  var password = request.body.password;

  pool.connect((err, db, done) => {
    done();
    if (err) {
      return response.status(500).send({
        error: err
      });
    } else {
      // Check if user already exists
      db.query('SELECT * FROM benchsci.users WHERE username = $1;', [String(username)],
      function(err, table) {
        done();
        if (err) {
          return response.status(400).send({
            error: err,
          })
        } else {
          // no user retrieved
          if (!table.rows.length){
            db.query('INSERT INTO benchsci.users ( username, password ) VALUES ($1,$2);',
            [String(username), String(password)], (err, table) => {
              if (err) {
                console.error('error running query', err);
                return response.status(400).send({
                  error: err
                });
              } else {
                console.log('Data Inserted');
                response.status(201).send({
                  message: 'User sucessfully created'
                })
              }
            })
          } else {
            response.status(400).send({
              message: 'User already exists'
            })
          }

        }
      })
    }
  });
});

// POST /login => authenticate user
app.post('/login', function(request, response) {
  var username = request.body.username;
  var password = request.body.password;
  pool.connect(function(err, db, done) {
    if (err) {
      console.error(err);
      response.status(500).send({
        'error': err
      });
    } else {
      db.query('SELECT * FROM benchsci.users WHERE username = $1 and password = $2',
      [String(username), String(password)], function(err, table) {
        done();
        if (err) {
          return response.status(400).send({
            error: err
          })
        } else {
          if (table.rows.length ) {
            return response.status(200).send(table.rows);
          } else {
           return response.status(400).send({error: err});
          }
        }
      })
    }
  })
});

// GET ../{username}/publications => retrieves publications saved by user
app.get('/api/users/:name/publications', function(request, response) {
  var username = request.params.name;

  pool.connect(function(err, db, done) {
    if (err) {
      console.error(err);
      response.status(500).send({
        'error': err
      });
    } else {
      // Check if user has no entries in publication table
      db.query('SELECT * FROM benchsci.userpubs WHERE username = $1;', [String(username)],
      function(err, table) {
        done();
        if (err) {
          return response.status(400).send({
            error: err,
          })
        } else {
          // user has bookmarks saved -> get publication information
          if (table.rows.length > 0 ){
            db.query('SELECT * FROM benchsci.userpubs join benchsci.genes on'
            + ' benchsci.userpubs.pub_id = benchsci.genes.id WHERE username = $1',
            [String(username)],
            function(err, table) {
              done();
              if (err) {
                return response.status(400).send({
                  error: err
                })
              } else {
                return response.status(200).send(table.rows)
              }
            });
          } else {
            return response.status(200).send({message: "no bookmarks"});
          }
        }
      })
    }
  })
});

// POST .../{username}/publications => save publication for authenticated user
app.post('/api/users/:name/publications', function(request, response) {
  var username = request.params.name;
  var password = request.body.password;
  var pub_id = request.body.pub_id;
  pool.connect(function(err, db, done) {
    if (err) {
      console.error(err);
      response.status(500).send({
        'error': err
      });
    } else {
      // Check if valid user
      db.query('SELECT * FROM benchsci.users WHERE username = $1 and password=$2;',
      [String(username),String(password)], function(err, table) {
        done();
        if (err) {
          return response.status(400).send({
            error: err
          })
        } else {
	console.log(table.rows.length);
	console.log(pub_id, username);
          if (table.rows.length > 0) {
            db.query('INSERT INTO benchsci.userpubs(pub_id, username) values ($1, $2);',
            [pub_id, String(username)], function(err, table) {
              done();
              if (err) {
                return response.status(400).send({
                  error: err
                });
              } else {
                return response.status(200).send({message:"success"});
              }
            });
          } else {
             return response.status(400).send({message:"invalid user" });
          }
        }
      });
    }
  });
});

// DELETE /{username}/publications => remove publication for authenticated user
app.delete('/api/users/:name/publications', function(request, response) {
  var username = request.params.username;
  var password = request.body.password;
  var pub_id = request.body.pubID;

  pool.connect(function(err, db, done) {
    if (err) {
      return response.status(400).send(err)
    } else {
      // Check if valid user
      db.query('SELECT * FROM benchsci.users WHERE username = $1 and password=$2',
      [username, password], function(err, table) {
        done();
        if (err) {
          return response.status(400).send({
            error: err
          })
        } else {
          db.query('DELETE FROM benchsci.userpubs WHERE username = $1 and pub_id=$3',
          [username, password, pub_id], function(err, result) {
            done();
            if (err) {
              return response.status(400).send(err)
            } else {
              return response.status(200).send({
               'message': 'Success: deleted record'
              })
            }
          })
        }
      })
    }
  });
});

app.use('*', express.static('build'));

app.listen(PORT, () => console.log('Listening on port ' + PORT));

module.exports = app;
