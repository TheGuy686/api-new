## Service Creation Errors ##

##### Error
```
Find service error:  Repo with key: "FileStorage.ServiceName" did not exist

[CRITICAL]:  COULD NOT FIND SERVICE AT: services/ServiceName/operationName/service
```

##### Cause

This is caused due to the incorrect naming

---

##### Error
```
CANT FIND:  file-storage  :  cmss-repo FileStorage.Cmss

[CRITICAL]:  ERROR GETTING REPO PROPS FOR
```

##### Cause
This is caused due to the incorrect naming of datasource

---

##### Error
```
[ERROR]:  ActionName:descriptor-override repo.save: undefined

Error caching props for action input:  ActionName
```

##### Cause

This is caused due to the incorrect naming of calss name in the /services/action/index.ts file

---


## Rendering Templates ##

If the files are not renderi using the 



---

## API Errors ##


Getting 

Rest API response

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Error</title>
</head>
<body>
<pre>Cannot POST /v1/cms</pre>
</body>
</html>
```

Your rest service is not created properly - 
This error is usually caused incorrect naming


Rest API response

```json
{
    "statusCode": 500,
    "success": false,
    "error": {
        "error": "Internal server error"
    }
}
```
Server crashed due to internal error




### Error Codes and Messages

| Error Code   |        Error       |        Cause        |
|--------------|--------------------|--------------------|
| --- | Find service error | Incorrect naming |
| --- | Model with key: "ModelName" did not exist | Model is missing / Model name is incorrect  |
| --- | CRITICAL ERROR GETTING REPO PROPS FOR | Repo is missing / Rero name is incorrect |
| --- | [ERROR]:  CreateOne:descriptor-override repo.save: undefined / Error caching props for action input:  CreateCmsActions | In service index.ts class name is incorrect |


###

service not updating on serviceId
action not updating on actionId
role     @GetAll() not working