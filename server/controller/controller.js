const api = require('@opentelemetry/api');
const tracer = require('../../tracing')('anand-example');
const http = require('http');

var Userdb = require('../model/model');

// create and save new user
exports.create = (req,res)=>{
    // validate request

    console.log("\n\nInside create Span \n\n")
    console.log("Inside req header:"+ JSON.stringify(req.headers))
    //const currentSpan = api.trace.getActiveSpan();
    // display traceid in the terminal
    //const traceId = currentSpan.spanContext().traceId;
    //console.log(`traceId: ${traceId}`);
    const span = tracer.startSpan('handleRequest', {
      kind: 1, // server
      attributes: { key: 'value' },
    });
    // Annotate our span to capture metadata about the operation
    span.addEvent('invoking create request');
    

    if(!req.body){
        res.status(400).send({ message : "Content can not be emtpy!"});
        return;
    }

    // new user
    const user = new Userdb({
        name : req.body.name,
        email : req.body.email,
        gender: req.body.gender,
        status : req.body.status
    })

    // save user in the database
    user
        .save(user)
        .then(data => {
            //res.send(data)
            res.redirect('/add-user');
        })
        .catch(err =>{
            res.status(500).send({
                message : err.message || "Some error occurred while creating a create operation"
            });
        });
    span.end();
}

// retrieve and return all users/ retrive and return a single user
exports.find = (req, res)=>{


    console.log("\n\nInside find Span \n\n")
    console.log("Inside req header:"+ JSON.stringify(req.headers))
    const currentSpan = api.trace.getActiveSpan();
    // display trace id in the terminal
    const traceId = currentSpan.spanContext().traceId;
    console.log(`traceId: ${traceId}`);
    const span = tracer.startSpan('handleRequest', {
      kind: 1, // server
      attributes: { key: 'value' },
    });
    // Annotate our span to capture metadata about the operation
    span.addEvent('invoking find request');
    

    if(req.query.id){
        const id = req.query.id;

        Userdb.findById(id)
            .then(data =>{
                if(!data){
                    res.status(404).send({ message : "Not found user with id "+ id})
                }else{
                    res.send(data)
                }
            })
            .catch(err =>{
                res.status(500).send({ message: "Erro retrieving user with id " + id})
            })

    }else{
        Userdb.find({})
            .then(users => {
                res.send(users)
            })
            .catch(err => {
                res.status(500).send({ message : err.message || "Error Occurred while retriving user information" })
            })
    }

    span.end();
}

// Update a new idetified user by user id
exports.update = (req, res)=>{

    console.log("\n\nInside Update Span \n\n")
    console.log("Inside req header:"+ JSON.stringify(req.headers))
    //const currentSpan = api.trace.getActiveSpan();
    // display traceid in the terminal
    //const traceId = currentSpan.spanContext().traceId;
    //console.log(`traceId: ${traceId}`);
    const span = tracer.startSpan('handleRequest', {
      kind: 1, // server
      attributes: { key: 'value' },
    });
    // Annotate our span to capture metadata about the operation
    span.addEvent('invoking update request');  //Logs for span : exceptions, SQL or time additional info for the span in APM log 
    
    if(!req.body){
        return res
            .status(400)
            .send({ message : "Data to update can not be empty"})
    }

    const id = req.params.id;
    Userdb.findByIdAndUpdate(id, req.body, { useFindAndModify: false})
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Update user with ${id}. Maybe user not found!`})
            }else{
                console.log("Successfully Updated")
                res.send(data)
            }
        })
        .catch(err =>{
            res.status(500).send({ message : "Error Update user information"})
        })

    span.end();
}

// Delete a user with specified user id in the request
exports.delete = (req, res)=>{

    console.log("\n\nInside Delete Span \n\n")
    console.log("Inside req header:"+ JSON.stringify(req.headers))
    


    const currentSpan = api.trace.getActiveSpan();
    // display traceid in the terminal
    const traceId = currentSpan.spanContext().traceId;
    console.log(`traceId: ${traceId}`);
    const span = tracer.startSpan('handleRequest', {
      kind: 1, // server
      attributes: { key: 'value' },
    });
    // Annotate our span to capture metadata about the operation
    span.addEvent('invoking delete request');
    

    if(!req.body){
        return res
            .status(400)
            .send({ message : "Data to update can not be empty"})
    }

    const id = req.params.id;
    Userdb.findByIdAndDelete(id)
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Delete with id ${id}. Maybe id is wrong`})
            }else{
                res.send({
                    message : "User was deleted successfully!"
                })
            }
        })
        .catch(err =>{
            res.status(500).send({
                message: "Could not delete User with id=" + id
            });
        });
    span.end();
}