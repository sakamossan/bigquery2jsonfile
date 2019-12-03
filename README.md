# bigquery2jsonfile

Query bigquery to generate a properly typed json file or gcs object.


## usage

### output to localfile

```bash
$ npm install bigquery2jsonfile
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
$ npm install bigquery2jsonfile
$ npx bigquery2jsonfile \
  --sql ./path/to/query.sql \
  --output gs://your-bucket-name/path/to/output.json \
  --project_id myproj-123456 \
  --scope https://www.googleapis.com/auth/drive.readonly \
  --service_account_credential_file ./path/to/credential.json
```
