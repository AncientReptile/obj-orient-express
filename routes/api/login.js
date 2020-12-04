const express = require('express');
const { ObjectId } = require('mongodb');
const uuid = require('uuid');
const loginRoute = express.Router();
var db = require('../../index.js')

const collectionName = 'AdminLogin'
const loginCollection = db.collection(collectionName)

loginRoute.post('/login', (req, res) => {
    
    console.log(req.body)

    if(req.body.username === '' || req.body.password == null) {
        res.status(201).json("Missing Login Credentials")
    } else {
        loginCollection.find({
            "username": req.body.username,
            "password": req.body.password
        }, (err, result) => {
            if(err){
                console.log(err);
                res.status(201).json("Login Failed");
            } else {
                res.status(200).send()
            }

        })
    }
    

})

module.exports = loginRoute;