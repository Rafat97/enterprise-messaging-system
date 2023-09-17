# SWAGGER: 
`rest-api` root url. example: `http://localhost:8000/` if you are run given docker definitions.

## `v1/messages/delayed-message`

### For `kafka` driver with unique job
```
curl -X 'POST' \
  'http://localhost:8000/v1/messages/delayed-message' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "driverName": "kafka",
  "driverConfig": null,
  "eventName": "string",
  "option": {
    "jobId": "string",
    "priority": 1
  },
  "data": {
    "send": "hello world"
  },
  "delay": 10
}'
```
### For `http` driver with unique job
```
curl -X 'POST' \
  'http://localhost:8000/v1/messages/delayed-message' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "driverName": "http",
  "driverConfig": null,
  "eventName": "string",
  "option": {
    "jobId": "string",
    "priority": 1
  },
  "data": {
    "send": "hello world"
  },
  "delay": 10
}'
```
### For `http` driver with custom driver info & not unique job
```
curl -X 'POST' \
  'http://localhost:8000/v1/messages/delayed-message' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "driverName": "http",
  "driverConfig": {
     "url": "/post",
     "baseURL": "https://postman-echo.com"
  }
  "eventName": "string",
  "option": {
    "priority": 1
  },
  "data": {
    "send": "hello world"
  },
  "delay": 10
}'
```

## `v1/messages/without-delayed-message`

### For `kafka` driver with unique job
```
curl -X 'POST' \
  'http://localhost:8000/v1/messages/without-delayed-message' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "driverName": "kafka",
  "driverConfig": null,
  "eventName": "string",
  "option": {
    "jobId": "string",
    "priority": 1
  },
  "data": {
    "send": "hello world"
  }
}'
```
### For `http` driver with unique job
```
curl -X 'POST' \
  'http://localhost:8000/v1/messages/without-delayed-message' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "driverName": "http",
  "driverConfig": null,
  "eventName": "string",
  "option": {
    "jobId": "string",
    "priority": 1
  },
  "data": {
    "send": "hello world"
  }
}'
```
### For `http` driver with custom driver info & not unique job
```
curl -X 'POST' \
  'http://localhost:8000/v1/messages/without-delayed-message' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "driverName": "http",
  "driverConfig": {
     "url": "/post",
     "baseURL": "https://postman-echo.com"
  }
  "eventName": "string",
  "option": {
    "priority": 1
  },
  "data": {
    "send": "hello world"
  }
}'
```


