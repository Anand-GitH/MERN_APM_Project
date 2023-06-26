const opentelemetry = require('@opentelemetry/api');
const {SpanKind, ROOT_CONTEXT} = require("@opentelemetry/api");
const { CompositePropagator } = require("@opentelemetry/core");
const api = require("@opentelemetry/api");
const trace = require("@opentelemetry/api")



var Userdb = require('../model/model');

// create and save new user
exports.create = (req,res)=>{
    // validate request

    console.log("Inside Create Span\n\n")
    console.log("Inside req header:"+ JSON.stringify(req.headers))
    const remoteCtx = opentelemetry.propagation.extract(ROOT_CONTEXT, req.headers);
    const tracer = opentelemetry.trace.getTracer();
    const childSpan = tracer.startSpan(
        'ServerSpanCreate:Anand', 
        remoteCtx
      );

    // Set the created span as active in the deserialized context.
    console.log("After CTX:"+opentelemetry.context.active())
    console.log("After span in CTX:"+opentelemetry.context.active())
    childSpan.setAttribute('DebugEventName','Find')
    childSpan.setAttribute('DebugTraceId',childSpan.spanContext().traceId)
    childSpan.setAttribute('DebugSpanId',childSpan.spanContext().spanId)

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
    childSpan.end();
}

// retrieve and return all users/ retrive and return a single user
exports.find = (req, res)=>{

    console.log("\n\nInside Find Span \n\n")
    console.log("Inside req header:"+ JSON.stringify(req.headers))
    const remoteCtx = opentelemetry.propagation.extract(ROOT_CONTEXT, req.headers);
    const tracer = opentelemetry.trace.getTracer();
    const childSpan = tracer.startSpan(
        'ServerSpanFind:Anand', 
        remoteCtx
      );

    // Set the created span as active in the deserialized context.
    console.log("After CTX:"+opentelemetry.context.active())
    console.log("After span in CTX:"+opentelemetry.context.active())
    childSpan.setAttribute('DebugEventName','Find')
    childSpan.setAttribute('DebugTraceId',childSpan.spanContext().traceId)
    childSpan.setAttribute('DebugSpanId',childSpan.spanContext().spanId)



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

    childSpan.end();
}

// Update a new idetified user by user id
exports.update = (req, res)=>{

    console.log("\n\nInside update Span \n\n")
    console.log("Inside req header:"+ JSON.stringify(req.headers))
    const remoteCtx = opentelemetry.propagation.extract(ROOT_CONTEXT, req.headers);
    const tracer = opentelemetry.trace.getTracer();
    const childSpan = tracer.startSpan(
        'ServerSpanUpdate:Anand', 
        remoteCtx
      );

    // Set the created span as active in the deserialized context.
    console.log("After CTX:"+opentelemetry.context.active())
    console.log("After span in CTX:"+opentelemetry.context.active())
    childSpan.setAttribute('DebugEventName','Find')
    childSpan.setAttribute('DebugTraceId',childSpan.spanContext().traceId)
    childSpan.setAttribute('DebugSpanId',childSpan.spanContext().spanId)



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

    childSpan.end();
}

// Delete a user with specified user id in the request
exports.delete = (req, res)=>{

    console.log("\n\nInside Delete Span \n\n")
    console.log("Inside req header:"+ JSON.stringify(req.headers))
    const remoteCtx = opentelemetry.propagation.extract(ROOT_CONTEXT, req.headers);
    const tracer = opentelemetry.trace.getTracer();
    const childSpan = tracer.startSpan(
        'ServerSpanDelete:Anand', 
        remoteCtx
      );

    // Set the created span as active in the deserialized context.
    console.log("After CTX:"+opentelemetry.context.active())
    console.log("After span in CTX:"+opentelemetry.context.active())
    childSpan.setAttribute('DebugEventName','Find')
    childSpan.setAttribute('DebugTraceId',childSpan.spanContext().traceId)
    childSpan.setAttribute('DebugSpanId',childSpan.spanContext().spanId)

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
    childSpan.end();
}
