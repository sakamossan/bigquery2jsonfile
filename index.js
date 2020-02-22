const fs = require('fs');
const { BigQuery } = require('@google-cloud/bigquery');
const { Storage } = require('@google-cloud/storage');
const camelcaseKeys = require('camelcase-keys');

class BigQuery2JsonFile {
  constructor(options) {
    this.sql = options.sql;
    this.output = options.output;
    this.camelcase = options.camelcase;
    this.transformFunction = options.transform || (a => a);  // option used when called from nodejs program

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

  async extract() {
    const sqlString = await (new Promise((resolve, reject) =>
      fs.readFile(
        this.sql,
        (err, data) => err ? reject(err) : resolve(data.toString())
      )
    ));
    const [result] = await this.bigquery.query(sqlString);
    return result;
  }

  transform (a) {
    a = this.camelcase ? camelcaseKeys(a) : a;
    return this.transformFunction(a)
  }

  load(data) {
    const content = JSON.stringify(data)
    if (!this.output) {
      process.stdout.write(content);
    } else if (this.output.startsWith('gs://')) {
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
    return this.extract()
      .then(data => this.transform(data))
      .then(data => this.load(data))
  }
}

exports.BigQuery2JsonFile = BigQuery2JsonFile;
