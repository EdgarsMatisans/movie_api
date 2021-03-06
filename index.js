const express = require('express'),
      morgan = require('morgan');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');

const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Director = Models.Director;

const CONNECTION_URI = process.env.CONNECTION_URI || "mongodb://localhost:27017/test";
  mongoose.connect(CONNECTION_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('common'));
app.use(express.static('public'));


const cors = require("cors");
let allowedOrigins = ['http://localhost:8080', 'http://testsite.com', 'http://localhost:1234', 'https://objective-einstein-1a3f36.netlify.app',
'https://61d36a5ccacc69000810e7c7--objective-einstein-1a3f36.netlify.app'];

app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn’t found on the list of allowed origins
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}));

let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');


app.get('/', (req, res) => {
  res.send('Welcome to my myFlix!');
});

// Get a list of all the movies.
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


app.get('/secreturl', (req, res) => {
  res.send('This is a secret url with super top-secret content.');
});

app.get('/documentation', (req, res) => {
	res.sendFile('public/documentation.html', { root: __dirname });
});

// Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user.
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ Title: req.params.Title })
  .then((movie) => {
    res.json(movie);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

  // Return data about a genre (description) by name/title (e.g., “Thriller”).
app.get('/movies/genre/:name', passport.authenticate("jwt", { session: false }), (req, res) => {
  Movies.findOne({"Genre.Name" : req.params.name})
    .then((genre) => {
      res.json(genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Get all directors
app.get('/directors', passport.authenticate('jwt', { session: false }), (req, res) => {
  Directors.find()
  .then((directors) => {
    res.status(200).json(directors);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

  // Return data about a director (bio, birth year, death year) by name.
  app.get('/directors/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
    Directors.findOne({ Name: req.params.Name })
    .then((director) => {
      res.json(director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  });
//Get all genres
  app.get('/genres', passport.authenticate('jwt', { session: false }), (req, res) => {
    Genres.find()
    .then((genres) => {
      res.status(200).json(genres);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  });

  //Get Genre by name
app.get('/genres/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Genres.findOne({ Name: req.params.Name })
  .then((genre) => {
    res.json(genre);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

  // Get all users
  app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

// Get a user by username
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

  // Allow new users to register.
  app.post("/users",
  [ //validates user input data when registering
    check('Username', 'Username is required').isLength({ min: 5 }),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], (req, res) => {

    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    //hashing the password user enters
    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username }) //checks if the user already exists
      .then(user => {
        if (user) {
          //then responds this if user exists
          return res.status(400).send(req.body.Username + "already exists");
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
            .then(user => {
              res.status(201).json(user);
            })
            .catch(error => {
              console.error(error);
              res.status(500).send("Error: " + error);
            });
        }
      })
      .catch(error => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  });

  // Update a user's info, by username

  app.put('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {$set:
      {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }
    },
    {new: true}, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if(err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
  });

  // Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({Username: req.params.Username}, {
     $push: {FavoriteMovies: req.params.MovieID}
   },
   {new: true}, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// Allow users to remove a movie from their list of favorites
app.delete('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({Username: req.params.Username}, {
     $pull: {FavoriteMovies: req.params.MovieID}
   },
   {new: true}, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// Delete a user by username
app.delete('/users/:Username', (req, res) => {
  Users.findOneAndRemove({Username: req.params.Username})
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke:" + err);
  });


  const port = process.env.PORT || 8080;
  app.listen(port, '0.0.0.0',() => {
   console.log('Listening on Port ' + port);
  });
