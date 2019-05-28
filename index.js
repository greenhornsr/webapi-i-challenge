// implement your API here
const express = require('express');

const server = express();

const db = require('./data/db.js')

// Endpoints
// requests are routed to the correct `request handler function` based on 
    // the URL and HTTP verb on the request.
server.get('/', (req, res) => {
  // name is not important (could be request, response), position is.
res.send('Hello World!');
  // .send() is a helper method that is part of the response object
});

// send response to get request with current date
server.get('/now', (req, res) => {
    const now = new Date().toISOString();
    res.status(200).send(now);
})

server.get('/api/users', (req, res) => {
    db.find()
    .then(users => {
        res.status(200).json(users)
    })
    .catch(err => {
        res.status(500).json({ success: false, err })
    })
})

// Creates a user using the information sent inside the request body.
server.post('/api/users', (req, res) => {
    const newuser = req.body;
    db.insert(newuser)
    .then(user => {
        res.status(201).json({ success: true, user });
    })
    .catch(err => {
        res.status(500).json({
            success: false,
            err,
        })
    })
})

server.listen(4000, () => {
    console.log(`\n*** Server is running on http://localhost:4000 ***\n`);
});