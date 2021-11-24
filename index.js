const express = require('express'),
      morgan = require('morgan');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');


const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Director = Models.Director;


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('common'));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/test',
  {useUnifiedTopology: true});



app.get('/', (req, res) => {
  res.send('Welcome to my myFlix!');
});

// Get a list of all the movies.
app.get('/movies', (req, res) => {
  Movies.find()
    .then((movie) => {
      res.status(201).json(movie);
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
app.get('/movies/:title', (req, res) => {
   Movies.findOne({Title: req.params.title})
   .then((movie) => {
    res.json(movie); 
   })
   .catch((err) => {
     console.error(err);
     res.status(500).send("Error: " + err);
   });     
    });

  // Return data about a genre (description) by name/title (e.g., “Thriller”).
app.get('/movies/genre/:name', (req, res) => {
  Movies.findOne({"Genre.Name" : req.params.name})
    .then((genre) => {
      res.json(genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

  // Return data about a director (bio, birth year, death year) by name.
  app.get('/movies/director/:name', (req, res) => {
    Movies.findOne({"Director.Name" : req.params.name})
      .then((director) => {
        res.json(director);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

  // Get all users
app.get("/users", (req, res) => {
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
app.get('/users/:Username', (req, res) => {
  Users.findOne({Username: req.params.Username})
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

  // Allow new users to register.
  app.post('/users', (req, res) => {
    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + 'already exists');
        } else {
          Users
            .create({
              Username: req.body.Username,
              Password: req.body.Password,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then((user) =>{res.status(201).json(user); })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  });

  // Update a user's info, by username
  app.put('/users/:Username', (req, res) => {
    Users.findOneAndUpdate({Username: req.params.Username}, {$set:
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

  // Allow users to update their user info (username, password, email, date of birth).
app.put('/newUser/:id/info', (req, res) => {
    res.send('Successful PUT request user info updated.');
  });

  // Allow users to add a movie to their list of favorites (showing only a text that a movie has been added—more on this later)
app.post('/newUser/:id/favorites', (req, res) => {
    res.send('Successful POST request movie has been added to favorites.');
  });

  // Allow users to remove a movie from their list of favorites (showing only a text that a movie has been removed—more on this later)
app.delete('/newUser/:id/favorites', (req, res) => {
    res.send(
      'Successful DELETE request movie has been deleted from user list of favorites.');
    });

    // Allow existing users to deregister
app.delete('/newUser', (req, res) => {
    res.send('Successful DELETE request existing user has been deregistered.');
  });

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});