const fs = require('fs');
const { BigQuery } = require('@google-cloud/bigquery');
const { Storage } = require('@google-cloud/storage');
const camelcaseKeys = require('camelcase-keys');

class BigQuery2JsonFile {
  constructor(options) {
    this.sql = options.sql;
    this.output = options.output;
    this.camelcase = options.camelcase;
    this.transformFunction = options.transform || (a => a);

    const {project_id, scope, service_account_credential_file} = options;
    this.bigquery = new BigQuery({
      projectId: project_id,
      credentials: require(service_account_credential_file),
      scopes: [scope],
    });
    this.storage = new Storage({
      projectId: project_id,
      keyFilename: service_account_credential_file
    })
  }

  extract() {
    const sqlString = fs.readFileSync(this.sql).toString();
    return this.bigquery.query(sqlString).then(result => this.transform(result[0]))
  }

  transform (a) {
    a = this.camelcase ? camelcaseKeys(a) : a;
    return this.transformFunction(a)
  }

  load(data) {
    const content = JSON.stringify(data)
    if (this.output.startsWith('gs://')) {
      const [bucketName, ...keys] = this.output.replace("gs://", "").split("/");
      return this.storage
        .bucket(bucketName)
        .file(keys.join("/"))
        .save(content, {
          contentType: "application/json",
        })
    } else {
      return new Promise((resolve, reject) =>
        fs.writeFile(
          this.output,
          content,
          err => err ? reject(err) : resolve())
      )
    }
  }

  run() {
    return this.extract().then(data => this.load(data))
  }
}

exports.BigQuery2JsonFile = BigQuery2JsonFile;
