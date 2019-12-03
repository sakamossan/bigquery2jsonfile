const fs = require('fs');
const { BigQuery } = require('@google-cloud/bigquery');
const camelcaseKeys = require('camelcase-keys');

class BigQuery2JsonFile {
  constructor(options) {
    this.sql = options.sql;
    this.output = options.output;
    this.camelcase = options.camelcase;

    const {project_id, scope, service_account_credential_file} = options;
    this.bigquery = new BigQuery({
      projectId: project_id,
      credentials: require(service_account_credential_file),
      scopes: [scope],
    });
  }

  extract() {
    const sqlString = fs.readFileSync(this.sql).toString();
    return this.bigquery.query(sqlString).then(result => this.transform(result[0]))
  }

  transform (a) {
    return this.camelcase ? camelcaseKeys(a) : a;
  }

  load(data) {
    fs.writeFileSync(this.output, JSON.stringify(data))
  }

  run() {
    return this.extract().then(data => this.load(data))
  }
}

exports.BigQuery2JsonFile = BigQuery2JsonFile;
