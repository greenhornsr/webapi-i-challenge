// implement your API here
const express = require('express');

const server = express();
server.use(express.json());

const db = require('./data/db.js');


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

// Returns an array of all the user objects contained in the database.
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
    if(!newuser.name || !newuser.bio) {
        res.status(400).json({ success: false, message: "Must include a name and bio!"})
    }
    db.insert(newuser)
    .then(user => {
        res.status(201).json({ success: true, user });
    })
    .catch(err => {
        res.status(500).json({ success: false, message: "There was an error while saving the user to the database", err })
    })
})


// Returns the user object with the specified id.
server.get('/api/users/:id', (req, res) => {
    const {id} = req.params;
    db.findById (id)
    .then(user => {
        if(user) {
            res.status(201).json({ success: true, user });
        }else {
            res.status(404).json({ success: false, message: "The user with the specified ID does not exist." })
        }
    })
    .catch(err => {
        res.status(500).json({ success: false, message: "The user information could not be retrieved.", err })
    })
})

// Removes the user with the specified id and returns the deleted user.
server.delete('/api/users/:id', (req, res) => {
    const {id} = req.params;
    db.remove(id)
    .then(deleted => {
        if(deleted) {
            res.status(204).end()
        } else {
            res.status(404).json({ success: false, message: "The user with the specified ID does not exist."})
        }
    })
    .catch(err => {
        res.status(500).json({ success: false, message: "The user could not be removed", err })
    })
})

// Updates the user with the specified id using data from the request body. Returns the modified document, NOT the original.
server.put('/api/users/:id', (req, res) => {
    const {id} = req.params;
    const changes = req.body;

    db.update(id, changes)
    .then(updated => {
        if(updated) {
            res.status(200).json({ success: true, updated })
        } else {
            res.status(404).json({ success: false, message: "Cannot find the user!"})
        }
    })
    .catch(err => {
        res.status(500).json({ success: false, err })
    })
})

server.listen(4000, () => {
    console.log(`\n*** Server is running on http://localhost:4000 ***\n`);
});