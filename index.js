const express = require('express'),
  morgan = require('morgan');

const app = express();

app.use(morgan('common'));
app.use(express.static('public'));


 let MyMovies = [
    {
        title: 'Shrek',
        genre: ['Animation', 'Family Film'],
        director: ['Andrew Adamson', 'Vicky Jenson'],
        year: '2001'
    },
    {
        title: 'Shrek 2',
        genre: ['Animation', 'Family Film'],
        director: ['Andrew Adamson', 'Kelly Asbury', 'Conrad Vernon'],
        year: '2004'
    },
    {
        title: 'Shrek the Third',
        genre: ['Animation', 'Family Film'],
        director: ['Chris Miller'],
        year: '2007'
    },
    {
        title: 'Shrek Forever After',
        genre : ['Animation', 'Family Film'],
        director: ['Mike Mitchell'],
        yeat: '2010'
    },
    {
        title: 'How to Train Your Dragon',
        genre: ['Adventure', 'Animation'],
        director: ['Chris Sanders', 'Dean DeBlois'],
        year: '2010'
    },
    {
        title: 'How to Train Your Dragon 2',
        genre: ['Adventure', 'Animation'],
        director: ['Dean DeBlois'],
        year: '2014'
    },
    {
        title: 'How to Train Your Dragon 3',
        genre: ['Adventure', 'Animation'],
        director: ['Dean DeBlois'],
        year: '2019'
    },
    {
        title: 'The Hitman’s Bodyguard',
        genre: ['Action', 'Comedy'],
        director: ['Patrick Hughes'],
        year: '2017'
    },
    {
        title: 'Hitmans Wifes Bodyguard',
        genre: ['Action', 'Comedy'],
        director: ['Patrick Hughes'],
        year: '2021'
    },
    {   
        title: 'Deadpool',
        genre: ['Action', 'Comedy'],
        director: ['Tim Miller'],
        year: '2016'
    },
];

app.get('/', (req, res) => {
  res.send('Welcome to my myFlix!');
});

app.get ('/movies', (req, res) => {
    res.send(MyMovies);
});

app.get('/secreturl', (req, res) => {
  res.send('This is a secret url with super top-secret content.');
});

app.get('/documentation', (req, res) => {
	res.sendFile('public/documentation.html', { root: __dirname });
});

// Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user.
app.get('/movies/:title', (req, res) => {
    res.send(
      'Successful GET request returning data about a single movies by title to the user.'
    );
  });

  // Return data about a genre (description) by name/title (e.g., “Thriller”).
app.get('/movies/:title/genre', (req, res) => {
    res.send('Successful GET request returning data about a genre.');
  });

  // Return data about a director (bio, birth year, death year) by name.
app.get('/movies/director/:name', (req, res) => {
    res.send('Successful GET request returning data about a director.');
  });

  // Allow new users to register.
app.post('/newUser', (req, res) => {
    res.send('Successful POST request user was able to register.');
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