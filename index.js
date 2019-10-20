#!/usr/bin/env node
'use strict';
const fs = require('fs');
const program = require('commander')
const { BigQuery } = require('@google-cloud/bigquery');
const camelcaseKeys = require('camelcase-keys');

program
  .version('0.0.1', '-v, --version')
  .option('--sql <filepath>', 'sql-file path')
  .option('--output <filepath>', 'output file path')
  .option('--project_id <projectId>', 'GCP project id')
  .option('--scope [scope]', 'requesting extra oauth scopes')
  .option('--service_account_credential_file <filepath>', 'service account credential file path')
  .option('--camelcase', 'convert to camelcase')
  .parse(process.argv)

const {
  sql,
  output,
  camelcase,
  project_id,
  scope,
  service_account_credential_file,
} = program;

const bigquery = new BigQuery({
  projectId: project_id,
  credentials: require(service_account_credential_file),
  scopes: [scope],
})

const sqlString = fs.readFileSync(sql).toString();
bigquery.query(sqlString)
  .then(result => {
    const transformFn = camelcase ? camelcaseKeys : (a) => a;
    const got = transformFn(result[0]);
    fs.writeFileSync(output, JSON.stringify(got))
  })
  .catch(console.error)
