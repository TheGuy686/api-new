Create Service
------------

### Steps for creating REST API's ###

* Step 1 – Create Datasource

  create **json-db-{entity}.ts** file in  **/src/datasources/** directory

  **Note*** entity must be singular & lowercase

📦src \
 ┣ 📂datasources \
 ┃ ┣ 📜json-db-controller.ts


```javascript
    import { EDataSource } from '@eezze/decorators';
    
    EDataSource({
    datasourceType: 'FileStorage',
    rootPath: process.env['PROJECTS_FILE_ROOT'],
    fileType: 'json',
    fileName: 'controller.json',
    })

    export default class JsonDbController {}
 ```
 
  **Note*** The class name format JsonDb{entity} where entity must be singular capitalcase
  fileName format {entity}.json where entity must be singular lowercase


* Step 2 – Create Model

  create index.ts file in **/src/models/{var1}-model** directory

  **note*** - var1 must be singular & lowercase

>Directory Structure \
  📦src \
 ┣ 📂models \
 ┃ ┣ 📂controller-model \
 ┃ ┃ ┗ 📜index.ts

```javascript
    import { BaseModel } from '@eezze/base';
    import { EModel, UID, String, Text, Json } from '@eezze/decorators/models';
     @EModel()
    export default class ControllerModel extends BaseModel {
    	@UID({
    		bindProps: ['key'],
    	})
    	key: string;
     	@String() controllerId: string;
     	@String() type: string;
     	@String() name: string;
     	@Text()
    	description: string;
     	constructor(args: any) {
    		super();
     		this.controllerId = args.controllerId;
    		this.key = args.key;
    		this.type = args.type;
    		this.name = args.name;
    		this.description = args.description;
    	}
    }
```
  
  **Note*** the class name format {var}Model where var must be singular capitalcase


* Step 3 – Create Repo

  create **{entity}-repo.ts** file in **/src/repos/file-storage** directory

  **note*** - Above entity must be singular & lowercase

>Directory Structure \
📦src \
 ┣ 📂repos \
 ┃ ┗ 📂file-storage \
 ┃ ┃ ┣ 📜controller-repo.ts

**controller-repo.ts**
```javascript
    import JsonKeyStorage from '@eezze/base/datasources/JsonKeyStorage';
    import { ERepository } from '@eezze/decorators';
    @ERepository({
        datasourceType: 'FileStorage',
        datasource: 'json-db-controller',
        targetEntity: 'Controller',
    })
    export default class ControllerRepository extends JsonKeyStorage {
        static getController(controllerId: string) {
            return this.findOneBy(controllerId);
        }
        static async createController(controllerId: string, updateValues: any) {
            return await this.create(controllerId, updateValues);
        }
        static updateController(controllerId: string, updateValues: any) {
            return this.update(controllerId, updateValues);
        }
        static getAllControllers() {
            return this.fetchAll();
        }
        static deleteController(controllerId: string) {
            return this.remove(controllerId);
        }
    }
```

  **Note*** the class name format {var}Repository where var must be singular capitalcase  


### Create Rest CRUD Operation ###

To add new rest service

* Create a directory in **rest-{serviceName}** in **/src/services/** directory 

    **note*** - Above serviceName must be plural, lowercase & kebabcase
    Eg. - /src/services/rest-controllers

* Under this newly created directory add new files **controler.rest.ts** and **config.yaml**

**controler.rest.ts**
```javascript
    import { RestController } from '@eezze/base';
    import { EController, EGet, EPost, EPut, EDelete } from '@eezze/decorators';   
    @EController({
        server: 'eezze-project-api'
    })
    export default class RestControllersController extends RestController {}
        @EGet({ path: '/controller/all' }) static async readControllerAll() {}   
        @EPost({ path: '/controller' }) static async createController() {}  
        @EPut({ path: '/controller' }) static async updateController() {}       
        @EDelete({ path: '/controller' }) static async deleteController() {}
    }
```

  **Note*** the class name format Rest{serviceName}Controller serviceName var must be plural capitalcase  

  **config.yaml**
```yaml
        name:  Controller
        description: This is controller
        version: 1.0
        license: Proprietary
        author: Eezzy
```

* Create a directory for each action **create{actionName}**
    
    **note*** - Above actionName must be singular, capitalcase

* Create directory **action** with three files **action-input.ts**, **index.ts** and **model.ts**

>Directory Structure \
📦src \
 ┗ 📂services \
 ┃ ┣ 📂rest-controllers \
 ┃ ┃ ┣ 📂createController \
 ┃ ┃ ┃ ┣ 📂action \
 ┃ ┃ ┃ ┃ ┣ 📜action-input.ts \
 ┃ ┃ ┃ ┃ ┣ 📜index.ts \
 ┃ ┃ ┃ ┃ ┗ 📜model.ts \
 ┃ ┃ ┃ ┗ 📜service.ts

**action-input.ts**

```javascript
    import BaseActionInput from '@eezze/base/BaseActionInput';
    import { EActionInput } from '@eezze/decorators';
    import { SetterContextI, String, Text, Json, Boolean } from '@eezze/decorators/models/types';
    @EActionInput()
    export default class CreateControllerInput extends BaseActionInput {
        @String({
            required: true,
            map: (context: SetterContextI) => context?.req?.requestBody?.controllerId,
            message: 'Controller "controllerId" was not set',
        })
        controllerId: string;
       
        @String({
            required: true,
            map: (context: SetterContextI) => context?.req?.requestBody?.key,
            message: 'Controller "key" was not set',
        })
        key: string;
        
        @String({
            required: true,
            map: (context: SetterContextI) => context?.req?.requestBody?.type,
            message: 'Controller "type" was not set',
        })
        type: string;
    }
```

  **Note*** The class name format Create{serviceName}Input where serviceName must be singular capitalcase  

**index.ts**

```javascript
    import { EAction, CreateOne, ServiceCaller } from '@eezze/decorators';
    import BaseAction from '@eezze/base/action/BaseAction';
    import { E_REQUEST } from '@eezze/global';  
    
    @EAction({
	    targetRepo: 'FileStorage.ControllerRepo',
    })
    
    export default class CreateControllerAction extends BaseAction {
	    @CreateOne({ keyOn: 'key' })
	    async _exec() { }
    }
```

  **Note*** The targetRepo name format FileStorage.{serviceName}Repo where serviceName must be singular capitalcase  
  The class name format Create{serviceName}Action where serviceName must be singular capitalcase

**model.ts**

```javascript
    import { EModelAction, When } from '@eezze/decorators';
    import { UnauthResponse } from '@eezze/classes/ActionResponses';
    import BaseModelAction from '@eezze/base/action/BaseModelAction';
   
    @EModelAction({ targetEntity: 'Controller' })
   
    export default class ModelAction extends BaseModelAction {}
```

  **Note*** The targetEntity name format must be singular capitalcase



* Step 4 – Create entry of each service in  **/src/service-configurables/render-templates/services.json** file

>Directory Structure \
📦src \
 ┗ 📂service-configurables \
 ┃ ┣ 📂render-templates \
 ┃ ┃ ┣ 📜services.json \


```json
  {
    "ServiceId": "rest-controllers",
    "OperationId": "createController",
    "Method": "POST",
    "Path": "/controller",
    "Entity": "Controller",
    "Type": "REST",
    "MainActionHandlerName": "CreateOne",
    "UrlParameters": "",
    "ActionInput": "controllerId|key|type|name|description|keyValueItems",
    "ActionInputTypes": "string|string|string|string|text|json",
    "ActionInputRequired": "true|true|true|true|false|false"
  }
 ```
 
  **Note*** The ServiceId name format JsonDb{entity} where entity must be singular lowercase kebabcase


* Step 5 – Create entry of each service in  **/src/service-configurables/render-templates/models.json** file

>Directory Structure \
📦src \
 ┗ 📂service-configurables \
 ┃ ┣ 📂render-templates \
 ┃ ┃ ┣ 📜models.json


```json
  {
    "Model": "controllerId|key|type|name|description|items|operationId",
    "ModelTypes": "string|string|string|string|text|json|string",
    "ModelExamples": "",
    "ModelRequired": "true|true|true|true|false|false|false|false",
    "Entity": "Controller",
    "Key": "controllerId"
  }
 ```
 
>  **Note*** The Entity name must be singular Capitalcase



#### Sample Request for CRUD - Create Operation ####

```json
Method : POST
Path : /v1/controller
Request_Body : {
    "controllerId": "my-controller2",
    "key": "my-controller2",
    "type": "test",
    "name": "My Controller2",
    "description": "This is a controller Example",
    "keyValueItems": [
        {
            "method": "GET",
            "path": "/controller",
            "operationId": "readControllerAll"
        },
        {
            "method": "PUT",
            "path": "/controller",
            "operationId": "updateController"
        },
        {
            "method": "POST",
            "path": "/controller",
            "operationId": "createController"
        },
        {
            "method": "DELETE",
            "path": "/controller",
            "operationId": "deleteController"
        }
    ]
}
```






### creating Websocket API ###

To add new WS service

* Create a directory in **ws-gen-{serviceName}** in **/src/services/** directory 

    **note*** - Above serviceName must be plural, lowercase & kebabcase
    Eg. - /src/services/ws-gen-controllers

* Under this newly created directory add new files **controler.ws.ts** and **config.yaml**

**controler.ws.ts**
```javascript
    import { WsController } from '@eezze/base';
    import { SocketController, On } from '@eezze/decorators';

    @SocketController({
    	server: 'generation-ws-server',
    })
    export default class WsGenControllersController extends WsController {
    	@On({ event: 'generate-controller-all' })
    	async generateControllerAll() {}

    	@On({ event: 'generate-controller-refresh' })
    	async generateControllerRefresh() {}

    	@On({ event: 'generate-controller-create' })
    	async generateControllerCreate() {}

    	@On({ event: 'generate-controller-delete' })
    	async generateControllerDelete() {}

    	@On({ event: 'generate-controller-update' })
    	async generateControllerUpdate() {}
    }
```

  **Note*** the class name format WsGen{serviceName}Controller serviceName var must be plural capitalcase  

  **config.yaml**
```yaml
        name:  Controller
        description: This is controller
        version: 1.0
        license: Proprietary
        author: Eezzy
```

* Create a directory for each event **generate{actionName}**
    
    **note*** - Above actionName must be singular, capitalcase \
    Eg. - generateControllerCreate


* Create file **service.ts**

**service.ts**
```javascript
    import { BaseService } from '@eezze/base';
    import { EService } from '@eezze/decorators';

    @EService()
    export default class GenerateControllerCreateService extends BaseService {
        async run() {
            return await this.action.run();
        }
    }
```

* Create directory **action** with three files **action-input.ts**, **index.ts** and **model.ts**

>Directory Structure \
📦src \
 ┗ 📂services \
 ┃ ┣ 📂rest-controllers \
 ┃ ┃ ┣ 📂createController \
 ┃ ┃ ┃ ┣ 📂action \
 ┃ ┃ ┃ ┃ ┣ 📜action-input.ts \
 ┃ ┃ ┃ ┃ ┣ 📜index.ts \
 ┃ ┃ ┃ ┃ ┗ 📜model.ts \
 ┃ ┃ ┃ ┗ 📜service.ts

**action-input.ts**

```javascript
    import BaseActionInput from '@eezze/base/BaseActionInput';
    import { EActionInput } from '@eezze/decorators';
    import { SetterContextI, String, Text, Json } from '@eezze/decorators/models/types';

    @EActionInput()
    export default class GenerateControllerCreateInput extends BaseActionInput {
        @String({
            map: (deps: any) => deps?.req?.requestBody?.serviceId,
        })
        private serviceId: string;

        @String({
            map: (deps: any) => deps?.req?.requestBody?.operationId,
        })
        private operationId: string;

        @String({
            map: (deps: any) => deps?.req?.requestBody?.type,
        })
        private type: string;

        @Json({
            map: (deps: any) => deps?.req?.requestBody?.restful,
        })
        private restful: string;

        @Json({
            map: (deps: any) => deps?.req?.requestBody?.ws,
        })
        private ws: string;

        @String({
            map: (deps: any) => deps?.req?.requestBody?.description,
        })
        private description: string;

        @Json({
            map: (deps: any) => deps?.req?.requestBody?.keyValueItems,
        })
        private keyValueItems: string;
    }
```

  **Note*** The class name format Create{serviceName}Input where serviceName must be singular capitalcase  

**index.ts**

```javascript
    import BaseAction from '@eezze/base/action/BaseAction';
    import { EAction, RenderTemplate } from '@eezze/decorators';
    import { pascalCase } from '@eezze/libs/StringMethods'
    @EAction({
        targetRepo: 'FileStorage.ControllerRepo',
    })
    export default class GenerateControllerCreateAction extends BaseAction {
        @RenderTemplate({
                        templateName: 'controller',
            toPath: `${process.env['PROJECTS_FILE_ROOT']}src/services/\${ serviceId | kebabCase }/controller.ts`,
            templateVars: (item: any) => ({
                serviceId: pascalCase(item?.serviceId),
                operationId: item?.operationId,
                items: JSON.parse(item?.keyValueItems),
                type: item?.type,
                restful: item?.restful != undefined ? JSON.parse(item.restful) : undefined,
                ws: item?.ws != undefined ? JSON.parse(item.ws) : undefined,
            }),
        })
        @RenderTemplate({
                        templateName: 'controller.config.yaml',
            toPath: `${process.env['PROJECTS_FILE_ROOT']}src/services/\${ serviceId | kebabCase }/config.yaml`,
            templateVars: (item: any) => ({
                serviceId: pascalCase(item?.serviceId),
                description: item?.description
            }),
        })
        async _exec() { }
    }
```

  **Note*** The targetRepo name format FileStorage.{serviceName}Repo where serviceName must be singular capitalcase  
  The class name format Create{serviceName}Action where serviceName must be singular capitalcase

**model.ts**

```javascript
    import { EModelAction, When } from '@eezze/decorators';
    import { UnauthResponse } from '@eezze/classes/ActionResponses';
    import BaseModelAction from '@eezze/base/action/BaseModelAction';

    @EModelAction({ targetEntity: 'Controller' })
    export default class ModelAction extends BaseModelAction {}
```

  **Note*** The targetEntity name format must be singular capitalcase
