const opentelemetry = require('@opentelemetry/api');
const {SpanKind, ROOT_CONTEXT} = require("@opentelemetry/api");
const { CompositePropagator } = require("@opentelemetry/core");
const ocilog= require("../../ocilogginganalytics")
const api = require("@opentelemetry/api");
const trace = require("@opentelemetry/api")

var Userdb = require('../model/model');
var log=ocilog.getlogger();

// create and save new user
exports.create = (req,res)=>{
    // validate request

    log.debug("Inside create method: Start of Create Method")
    
    //Code to add span attributes
    /*
    const tracer = opentelemetry.trace.getTracer();
    const childSpan = tracer.startSpan(
        'ServerSpanCreate',
      );

    // Set the created span as active in the deserialized context.
    childSpan.setAttribute('DebugEventName','Create')
    childSpan.setAttribute('DebugTraceId',childSpan.spanContext().traceId)
    childSpan.setAttribute('DebugSpanId',childSpan.spanContext().spanId)
    */

    if(!req.body){
        res.status(400).send({ message : "Content can not be emtpy!"});
        log.error("Inside create method: Message content can not be empty");
        return;
    }

    log.debug("Inside create method: created the user record with user status:"+req.body.status);

    // new user
    const user = new Userdb({
        name : req.body.name,
        email : req.body.email,
        gender: req.body.gender,
        status : req.body.status
    })

    log.debug("Inside create method: Saving the record into the database");

    // save user in the database
    user
        .save(user)
        .then(data => {
            res.send(data)
            log.debug("Inside create method: Record successfully saved");
            //res.redirect('/add-user');
        })
        .catch(err =>{
            log.error("Inside create method: Some error occurred while creating a create operation "+ err.message )
            res.status(500).send({
                message : err.message || "Some error occurred while creating a create operation"
            });
        });

    //End the span created
    /*
    childSpan.end();
    */
}

// retrieve and return all users/ retrive and return a single user
exports.find = (req, res)=>{

    
    log.debug("Inside find method: Start of Find Method");
    //Code to add span attributes
    /*
    const tracer = opentelemetry.trace.getTracer();
    const childSpan = tracer.startSpan(
        'ServerSpanFind',
      );

    // Set the created span as active in the deserialized context.
    childSpan.setAttribute('DebugEventName','Find')
    childSpan.setAttribute('DebugTraceId',childSpan.spanContext().traceId)
    childSpan.setAttribute('DebugSpanId',childSpan.spanContext().spanId)
    */


    log.debug("Inside find method:Querying record:"+req.query.id);

    if(req.query.id){
        const id = req.query.id;

        Userdb.findById(id)
            .then(data =>{
                if(!data){
                    log.error("Inside find method: Not found the user with id "+id);
                    res.status(404).send({ message : "Not found user with id "+id})
                }else{
                    log.debug("Inside find method: Record found");
                    res.send(data)
                }
            })
            .catch(err =>{
                log.error("Inside find method: Error retrieving user with id " + id);
                res.status(500).send({ message: "Error retrieving user with id " + id})
            })

    }else{
        Userdb.find({})
            .then(users => {
                log.debug("Inside find method: Retrieve all records");
                res.send(users)
            })
            .catch(err => {
                log.error("Inside find method: Error Occurred while retrieving user information");
                res.status(500).send({ message : err.message || "Error Occurred while retrieving user information" })
            })
    }

    //End the span created
    /*
    childSpan.end();
    */
}

// Update a new idetified user by user id
exports.update = (req, res)=>{

    
    log.debug("Inside update method: start of update Method")

   //Code to add span attributes
    /*
    const tracer = opentelemetry.trace.getTracer();
    const childSpan = tracer.startSpan(
        'ServerSpanUpdate',
      );

    // Set the created span as active in the deserialized context.
    childSpan.setAttribute('DebugEventName','Update')
    childSpan.setAttribute('DebugTraceId',childSpan.spanContext().traceId)
    childSpan.setAttribute('DebugSpanId',childSpan.spanContext().spanId)
    */



    if(!req.body){
        log.error("Inside update method: Message content can not be empty");
        return res
            .status(400)
            .send({ message : "Data to update can not be empty"})
    }

    const id = req.params.id;
    Userdb.findByIdAndUpdate(id, req.body, { useFindAndModify: false})
        .then(data => {
            if(!data){
                log.error("Inside update method: Cannot Update user with ${id}. Maybe user not found!");
                res.status(404).send({ message : `Cannot Update user with ${id}. Maybe user not found!`})
            }else{
                log.debug("Inside update method: Found record and updated the record");
                //console.log("Successfully Updated")
                res.send(data)
            }
        })
        .catch(err =>{
            log.error("Inside update method: Error Update user information");
            res.status(500).send({ message : "Error Update user information"})
        })

    //End the span created
    /*
    childSpan.end();
    */
}

// Delete a user with specified user id in the request
exports.delete = (req, res)=>{

   
    log.debug("Inside delete method: start of delete");

    //Code to add span attributes
    /*
    const tracer = opentelemetry.trace.getTracer();
    const childSpan = tracer.startSpan(
        'ServerSpanDelete',
      );

    // Set the created span as active in the deserialized context.
    childSpan.setAttribute('DebugEventName','Delete')
    childSpan.setAttribute('DebugTraceId',childSpan.spanContext().traceId)
    childSpan.setAttribute('DebugSpanId',childSpan.spanContext().spanId)
    */

    if(!req.body){
        log.debug("Inside delete method: Data to update can not be empty");
        return res
            .status(400)
            .send({ message : "Data to update can not be empty"})
    }

    const id = req.params.id;
    Userdb.findByIdAndDelete(id)
        .then(data => {
            if(!data){
                log.error("Inside delete method:" + `Cannot Delete with id ${id}. Maybe id is wrong`);
                res.status(404).send({ message : `Cannot Delete with id ${id}. Maybe id is wrong`})
            }else{
                log.debug("Inside delete method: User was deleted successfully!");
                res.send({
                    message : "User was deleted successfully!"
                })
            }
        })
        .catch(err =>{
            log.error("Inside delete method: Could not delete User "+ id);
            res.status(500).send({
                message: "Could not delete User with id=" + id
            });
        });
   //End the span created
   /*
    childSpan.end();
   */
}
