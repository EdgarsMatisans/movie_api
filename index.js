const express = require('express'),
  morgan = require('morgan');

const app = express();

app.use(morgan('common'));
app.use(express.static('public'));


 let MyMovies = [
    {
        title: 'Shrek',
        year: '2001'
    },
    {
        title: 'Shrek 2',
        year: '2004'
    },
    {
        title: 'Shrek the Third',
        year: '2007'
    },
    {
        title: 'Shrek Forever After',
        yeat: '2010'
    },
    {
        title: 'How to Train Your Dragon',
        year: '2010'
    },
    {
        title: 'How to Train Your Dragon 2',
        year: '2014'
    },
    {
        title: 'How to Train Your Dragon3',
        year: '2019'
    },
    {
        title: 'The Hitman’s Bodyguard',
        year: '2017'
    },
    {
        title: 'Hitmans Wifes Bodyguard',
        year: '2021'
    },
    {   
        title: 'Deadpool',
        year: '2016'
    },
];

app.get('/', (req, res) => {
  res.send('Welcome to my myFlix!');
});

app.get('/secreturl', (req, res) => {
  res.send('This is a secret url with super top-secret content.');
});

app.get('/documentation', (req, res) => {
	res.sendFile('public/documentation.html', { root: __dirname });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});