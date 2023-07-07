const opentelemetry = require('@opentelemetry/api');
const {SpanKind, ROOT_CONTEXT} = require("@opentelemetry/api");
const { CompositePropagator } = require("@opentelemetry/core");
const api = require("@opentelemetry/api");
const trace = require("@opentelemetry/api")
const { LoggerProvider, BatchLogRecordProcessor,ConsoleLogRecordExporter } = require('@opentelemetry/sdk-logs');
const { OTLPLogExporter } = require('@opentelemetry/exporter-logs-otlp-http');
const { SeverityNumber } = require('@opentelemetry/api-logs');

// exporter options. see all options in OTLPExporterNodeConfigBase
const collectorOptions = {
  url: 'http://localhost:4318/v1/logs', // url is optional and can be omitted - default is /v1/logs
  concurrencyLimit: 1, // an optional limit on pending requests
};
const logExporter = new OTLPLogExporter(collectorOptions);
const loggerProvider = new LoggerProvider();

loggerProvider.addLogRecordProcessor(new BatchLogRecordProcessor(logExporter));
//loggerProvider.addLogRecordProcessor(new BatchLogRecordProcessor(new ConsoleLogRecordExporter()));

const logger = loggerProvider.getLogger('default', '1.0.0');

// Emit a log
logger.emit({
    severityNumber: SeverityNumber.INFO,
    severityText: 'info',
    body: 'this is a log body',
    attributes: { 'log.type': 'custom' },
  });

var Userdb = require('../model/model');

// create and save new user
exports.create = (req,res)=>{
    // validate request

    // Emit a log
logger.emit({
    severityNumber: SeverityNumber.INFO,
    severityText: 'info',
    body: 'Inside Create',
    attributes: { 'log.type': 'custom' },
  });

    /*const remoteCtx = opentelemetry.propagation.extract(ROOT_CONTEXT, req.headers);
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
    childSpan.setAttribute('DebugSpanId',childSpan.spanContext().spanId)*/

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
            res.send(data)
            //res.redirect('/add-user');
        })
        .catch(err =>{
            res.status(500).send({
                message : err.message || "Some error occurred while creating a create operation"
            });
        });
    //childSpan.end();
}

// retrieve and return all users/ retrive and return a single user
exports.find = (req, res)=>{

    logger.emit({
        severityNumber: SeverityNumber.INFO,
        severityText: 'info',
        body: 'Inside Find',
        attributes: { 'log.type': 'custom' },
      });
    console.log(SeverityNumber.INFO,"Info","\n\nInside Find Span \n\n")
    console.log(SeverityNumber.INFO,"Info","Inside req header:"+ JSON.stringify(req.headers))
    /*const remoteCtx = opentelemetry.propagation.extract(ROOT_CONTEXT, req.headers);
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
    childSpan.setAttribute('DebugSpanId',childSpan.spanContext().spanId)*/



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

    //childSpan.end();
}

// Update a new idetified user by user id
exports.update = (req, res)=>{

    logger.emit({
        severityNumber: SeverityNumber.INFO,
        severityText: 'info',
        body: 'Inside Update',
        attributes: { 'log.type': 'custom' },
      });

    console.log(SeverityNumber.INFO,"Info","\n\nInside update Span \n\n")
    console.log(SeverityNumber.INFO,"Info","Inside req header:"+ JSON.stringify(req.headers))
    /*const remoteCtx = opentelemetry.propagation.extract(ROOT_CONTEXT, req.headers);
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
    childSpan.setAttribute('DebugSpanId',childSpan.spanContext().spanId)*/



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

    //childSpan.end();
}

// Delete a user with specified user id in the request
exports.delete = (req, res)=>{

    logger.emit({
        severityNumber: SeverityNumber.INFO,
        severityText: 'info',
        body: 'Inside Delete',
        attributes: { 'log.type': 'custom' },
      });

    console.log(SeverityNumber.INFO,"Info","\n\nInside Delete Span \n\n")
    console.log(SeverityNumber.INFO,"Info","Inside req header:"+ JSON.stringify(req.headers))
    /*const remoteCtx = opentelemetry.propagation.extract(ROOT_CONTEXT, req.headers);
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
    childSpan.setAttribute('DebugSpanId',childSpan.spanContext().spanId)*/

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
    //childSpan.end();
}
