const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Record = require("../models/record");

router.get("/", (req, res, next) => {
  Record.find()
    .select('login round _id')
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        record: docs.map(doc => {
          return {
            login: doc.login,
            round: doc.round,
            id: doc._id,
            url: {
              request: {
                type: 'GET',
                url: 'http://localhost:3001/record/' + doc._id
              }
            }
          }
        })
      };
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.post("/", (req, res, next) => {
  const record = new Record({
    _id: new mongoose.Types.ObjectId(),
    login: req.body.login,
    round: req.body.round
  });
  record
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Created product successfully",
        createdProduct: {
          login: result.login,
          round: result.round,
          _id: result._id,
          request: {
            type: 'GET',
            url: 'http://localhost:3001/record/' + result._id
          }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.get("/:login", (req, res, next) => {
  const login = req.params.login;
  Record.findById(login)
  .select('login round _id')
  .exec()
  .then(doc => {     
    if (doc) {
      res.status(200).json({
        ercord: doc,
        request: {
          type: 'GET',          
          url: 'http://localhost:3001/record/'
        }
      });
    } else {
      res.status(404).json({message: 'No valid entry found for provided ID'});
    }   
  })
  .catch(err => { 
    console.log(err); 
    res.status(500).json({error: err});
  });    
});

router.patch("/:login", (req, res, next) => {
  const login = req.params.login;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Record.update({ login: login }, { $set: updateOps })
    .exec()
    .then(result => {      
      res.status(200).json({
        message: 'Product updated',
        request: {
          type: 'GET',
          url: 'http://localhost:3001/record/' + login
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.delete("/:login", (req, res, next) => {
  const login = req.params.login;
  Record.remove({ login: login })
    .exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;
