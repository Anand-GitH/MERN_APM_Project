var Userdb = require('../model/model');

// create and save new user
exports.create = (req,res)=>{
    // validate request

    console.log("Inside Create Span\n\n")
    const api = require('@opentelemetry/api');
    let current_span = api.trace.getSpan(api.context.active());
    let trace_id = current_span.spanContext().traceId;
    let span_id = current_span.spanContext().spanId;
    let trace_flags = current_span.spanContext().traceFlags;
    let is_remote = current_span.spanContext().isRemote;

    console.log(current_span)
    console.log(`log trace_id:”${is_remote}”`)
    console.log(`log trace_id:”${trace_id}” span_id:”${span_id}” trace_flags:”${trace_flags}”`);

    
    console.log("End of Create Span\n\n")

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

}

// retrieve and return all users/ retrive and return a single user
exports.find = (req, res)=>{

    console.log("\n\nInside Find Span \n\n")
    const api = require('@opentelemetry/api');
    let current_span = api.trace.getSpan(api.context.active());
    let trace_id = current_span.spanContext().traceId;
    let span_id = current_span.spanContext().spanId;
    let trace_flags = current_span.spanContext().traceFlags;
    let is_remote = current_span.spanContext().isRemote;

    console.log(current_span)
    console.log(`log trace_id:”${is_remote}”`)
    console.log(`log trace_id:”${trace_id}” span_id:”${span_id}” trace_flags:”${trace_flags}”`);

    
    console.log("\n\nEnd of Find Span \n\n")

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

    
}

// Update a new idetified user by user id
exports.update = (req, res)=>{

    console.log("\n\nInside update Span \n\n")
    const api = require('@opentelemetry/api');
    let current_span = api.trace.getSpan(api.context.active());
    let trace_id = current_span.spanContext().traceId;
    let span_id = current_span.spanContext().spanId;
    let trace_flags = current_span.spanContext().traceFlags;
    let is_remote = current_span.spanContext().isRemote;

    console.log(current_span)
    console.log(`log trace_id:”${is_remote}”`)
    console.log(`log trace_id:”${trace_id}” span_id:”${span_id}” trace_flags:”${trace_flags}”`);

    
    console.log("\n\nEnd of update Span \n\n")
    
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
}

// Delete a user with specified user id in the request
exports.delete = (req, res)=>{

    console.log("\n\nInside Delete Span \n\n")
    const api = require('@opentelemetry/api');
    let current_span = api.trace.getSpan(api.context.active());
    let trace_id = current_span.spanContext().traceId;
    let span_id = current_span.spanContext().spanId;
    let trace_flags = current_span.spanContext().traceFlags;
    let is_remote = current_span.spanContext().isRemote;

    console.log(current_span)
    console.log(`log trace_id:”${is_remote}”`)
    console.log(`log trace_id:”${trace_id}” span_id:”${span_id}” trace_flags:”${trace_flags}”`);

    
    console.log("\n\nEnd of Delete Span \n\n")

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
}