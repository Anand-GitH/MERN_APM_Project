// tracing.js
'use strict'
const process = require('process');
const opentelemetry = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');

const exporterOptions = { 
   url: "https://aaaadcdobxuhuaaaaaaaaacc74.apm-agt.us-ashburn-1.oci.oraclecloud.com/20200101/opentelemetry/public/v1/traces",
   headers: {"Authorization": "dataKey 4K6NPN3ZZ77RV2OFILQBMJ77L3PBP7Z7"},
  }
   
//const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api');

// For troubleshooting, set the log level to DiagLogLevel.DEBUG
// diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

const traceExporter = new OTLPTraceExporter(exporterOptions);
const sdk = new opentelemetry.NodeSDK({
   traceExporter,
   instrumentations: [getNodeAutoInstrumentations()],
   resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: 'crud_app'
      })
});

// initialize the SDK and register with the OpenTelemetry API
// this enables the API to record telemetry

sdk.start()

// gracefully shut down the SDK on process exit
process.on('SIGTERM', () => {
   sdk.shutdown()
 .then(() => console.log('Tracing terminated'))
 .catch((error) => console.log('Error terminating tracing', error))
 .finally(() => process.exit(0));
 });
