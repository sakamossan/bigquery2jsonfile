# bigquery2jsonfile

Query bigquery to generate a properly typed json (to file or gcs object).


## usage

### install

```bash
$ npm install bigquery2jsonfile
```

### output to stdout

```bash
$ npx bigquery2jsonfile \
  --sql ./path/to/query.sql \
  --camelcase \
  --project_id myproj-123456 \
  --scope https://www.googleapis.com/auth/drive.readonly \
  --service_account_credential_file ./path/to/credential.json
  | jq . \
  | tee /tmp/_.json
```

### output to localfile

```bash
$ npx bigquery2jsonfile \
  --sql ./path/to/query.sql \
  --output ./path/to/output.json \
  --camelcase \
  --project_id myproj-123456 \
  --scope https://www.googleapis.com/auth/drive.readonly \
  --service_account_credential_file ./path/to/credential.json
```

### output to google cloud storage 

```bash
$ npx bigquery2jsonfile \
  --sql ./path/to/query.sql \
  --output gs://your-bucket-name/path/to/output.json \
  --project_id myproj-123456 \
  --scope https://www.googleapis.com/auth/drive.readonly \
  --service_account_credential_file ./path/to/credential.json
```

use service account passed as a `--service_account_credential_file` option for uploading
