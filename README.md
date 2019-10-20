# bigquery2jsonfile

Query bigquery to generate a properly typed json file.  
Do what you can't do with the gcloud/bq command.


## usage

```bash
$ bigquery2jsonfile \
  --sql ./path/to/query.sql \
  --output ./path/to/output.json \
  --camelcase \
  --project_id myproj-123456 \
  --scope https://www.googleapis.com/auth/drive.readonly \
  --service_account_credential_file ./path/to/credential.json
```
