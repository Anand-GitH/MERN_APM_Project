'use strict';

const opentelemetry = require('@opentelemetry/api');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { MongoDBInstrumentation } = require('@opentelemetry/instrumentation-mongodb');
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');
const { OTLPTraceExporter } = require("@opentelemetry/exporter-trace-otlp-http");

const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api');

//For troubleshooting, set the log level to DiagLogLevel.DEBUG
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

module.exports = (serviceName) => {
  const provider = new NodeTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
    })}), exporter = new OTLPTraceExporter({
      url: "https://aaaadcdobxuhuaaaaaaaaacc74.apm-agt.us-ashburn-1.oci.oraclecloud.com/20200101/opentelemetry/private/v1/traces",
      headers: {
        Authorization: "dataKey GO6KPBXOAIYHQHMX5MLYJT74YS4WHIJQ",
      },

  });

const { B3Propagator, B3InjectEncoding } = require('@opentelemetry/propagator-b3');
//opentelemetry.propagation.setGlobalPropagator(new B3Propagator());

  provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

  // Initialize the OpenTelemetry APIs to use the NodeTracerProvider bindings
  provider.register({
    propagator: new B3Propagator()
  })

  registerInstrumentations({
    // // when boostraping with lerna for testing purposes
    instrumentations: [
      new HttpInstrumentation(),
      new ExpressInstrumentation(),
      new MongoDBInstrumentation(),
    ],
  });

  return opentelemetry.trace.getTracer('anand-example');
};