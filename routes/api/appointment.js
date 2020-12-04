const express = require('express');
const { ObjectId } = require('mongodb');
const uuid = require('uuid');
const appointmentRoute = express.Router();
var db = require('../../index.js')

const appointmentCollectionName = 'Appointments'
const appointmentCollection = db.collection(appointmentCollectionName)

appointmentRoute.get('/id/:id', (req, res) => {
    console.log(req.params.id)
    appointmentCollection.findOne({ _id : ObjectId(req.params.id) }, function(error, docs) {
        if(error)
            throw error;

        // console.log(docs)
        if(!docs) {
            res.status(400).json({msg: `No appointment with id of ${req.params.id}`})
        } else {
            res.send(docs);
        }
    });
});

appointmentRoute.get('/myappoint', (req, res) => {
    console.log(req.query._id)
    appointmentCollection.find({ "_id" : ObjectId(req.query._id), "name.last_name": req.query.lastName }
    ).toArray(function(error, docs) {
        if(error)
            throw error;

        if(docs.length == 0) {
            res.status(400).json(
                {msg: `No results were found for Last Name: ${req.body.last_name}` + 
                ` and Appointment: ${req.body._id}`})
        } else {
            res.send(docs);
        }
    });
});

appointmentRoute.get('/getallappoint', (req, res) => {
    console.log(req.query.type)
    var appointResp = []

    var appointments = appointmentCollection.find().toArray(function(error, docs) {
        if(error)
            throw error;

        if(docs.length == 0) {
            res.status(400).json(
                {msg: `No results were found for Last Name: ${req.body.last_name}` + 
                ` and Appointment: ${req.body._id}`})
        } else {
            
            todayDate = new Date()
            docs.forEach(appointment => {
                // console.log(appointment)
                try{
                    currAppointDate = new Date(appointment.time.date)
                    currAppointDate.setHours(todayDate.getHours())
                    currAppointDate.setMinutes(todayDate.getMinutes())
                    currAppointDate.setMilliseconds(todayDate.getMilliseconds())
                    currAppointDate.setSeconds(todayDate.getSeconds())
                    console.log("Curr " + currAppointDate)
                    console.log("Today " + todayDate)

                    if(currAppointDate <= todayDate){
                        console.log("hello")
                        if(req.query.type == "Daily") {
                            // if(currAppointDate.setTime(todayDate.getTime()) == todayDate) {
                                appointResp.push(appointment)
                            // }
                        } else if(req.query.type == "Weekly") {
                    
                        } else if(req.query.type == "Monthly") {
                    
                        }
                    }
                } catch(err) {

                }
            })
            res.json(appointResp)
        }
    });
    

    
});

appointmentRoute.post('/newappoint', (req, res) => {
    
    console.log(req.body)
    var result;
    // var data = JSON.parse(req.body)
    var id, last_name;

    if(req.body.name.last_name === '' || req.body.name.last_name == null) {
        res.status(201).json("Empty Appointment Value")
    } else {
        appointmentCollection.insertOne({
            "subject": req.body.subject,
            "notes": req.body.notes,
            "time": {
                "start_time": req.body.time.start_time,
                "end_time": req.body.time.end_time,
                "date": req.body.time.date
            },
            "name": {
                "first_name": req.body.name.first_name,
                "middle_name": req.body.name.middle_name,
                "last_name": req.body.name.last_name
            },
            "contact": {
                "phone_number": req.body.contact.phone_number,
                "email": req.body.contact.email
            }
        }, (err, result) => {
            if(err) console.log(err);
            else{
                id = result.ops[0]._id
                last_name = result.ops[0].name.last_name
            }

            res.send({id: result.ops[0]._id, lastName: result.ops[0].name.last_name});
        })
    }
    

})

module.exports = appointmentRoute;