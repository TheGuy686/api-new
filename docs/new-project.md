* project service rest API is not working
* How models work
* Fix naming issue in the controller ws service to name the controller.ws.ts properly according to the type

* Make project folder in /userId/ProjectId/ and all the stuff should go inside this folder for perticular project

* Need service to create project specific environment for the project  inside project folder

* In command decorator command error need to be logged.

* In command decorator if the command have some variable path for example in below command the userId and projectId. The variables are not converting to actual path.
```
command: `cp -a /home/swapnil/eezze-backend-boilerplate/. ${process.env['PROJECTS_FILE_ROOT']}\${ userId }/\${ projectId }/`
```


* How the boilerplate project will be copied to the user project 
