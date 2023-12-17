import { isPromise } from '../../libs/ObjectMethods';
import { serialize } from 'class-transformer';
import { kebabCase, pascalCase } from '../../libs/StringMethods';
import { RelationRefI } from '../../interfaces/RelationsI';
import { EntityPropsI } from '../../interfaces/EntityPropsI';
import { ActionDataManager } from '../../classes';

import BaseModel from '../../base/models/BaseModel';
import PDC from '../../classes/ProjectDependancyCaches';

import { Graph, alg } from 'graphlib';

const VAR_TYPES = {
    boolean: Boolean,
    string: String,
    number: Number,
}

interface Relationship {
    column: string | undefined;
    joinOn: string[];
    type: string;
    owner: string | undefined;
    direction: string;
    table: string;
}

interface Model {
    [key: string]: any;
    CHILD_RELATIONSHIPS?: { [key: string]: Relationship };
    RELATIONSHIPS?: { [key: string]: Relationship };
}

function processPropsToValue(out: any, props: any, propertyKey: any, value: any) {
    if (typeof props.serializeProperty != 'undefined' && !(!!props.serializeProperty)) {
        return;
    }

    if (props?.serializePropsToOutput) return Object.assign(out, value);

    out[propertyKey] = value;
}

class ProcessRelations {

    /**
     * Checks if object or array has attributes.
     *
     * Used in recursive object relation.
     *
     * @param obj object or array
     * @param attribute name of attribute
     * @returns
     */
    static hasAttributes(obj: any, attribute: string): boolean {
        if (typeof obj[attribute] !== 'undefined'
            || (typeof obj[attribute] === 'object' && Object.keys(obj[attribute]).length > 0)
        ) {
            return true;
        }
        return false;
    }

    /**
     * Recursively set all relations for the related models.
     *
     * @param modelName
     * @param obj
     * @param parent
     */
    static setAllRelations(modelName: string, obj: any, parent: any) {
        if (PDC.relationHasChildren(modelName)) {
            const relation = PDC.relation(modelName);

            for (const attribute of Object.keys(relation.relations)) {
                const properties = relation.relations[attribute];

                if (this.hasAttributes(obj, attribute)) {
                    if (Array.isArray(parent)) {
                        for (const parentObj of parent) {
                            this.setRelation(properties, attribute, obj, parentObj);
                        }

                        for (const parentObj of parent) {
                            this.setAllRelations(properties.name, obj[attribute], parentObj[attribute]);
                        }
                    }
                    else {
                        this.setRelation(properties, attribute, obj, parent);
                        // in case the attribute only contains a primitive value.
                        if (typeof obj[attribute] === 'object') this.setAllRelations(properties.name, obj[attribute], parent[attribute]);
                    }
                }
                else if (Array.isArray(obj)) {
                    for (let index = 0; index < obj.length; index++) {
                        const objItem = obj[index];

                        if (this.hasAttributes(objItem, attribute)) {
                            if (Array.isArray(parent)) {
                                this.setRelation(properties, attribute, objItem, parent[index]);
                                this.setAllRelations(properties.name, objItem[attribute], parent[index][attribute]);
                            }
                            else {
                                this.setRelation(properties, attribute, objItem, parent);
                                this.setAllRelations(properties.name, objItem[attribute], parent[attribute]);
                            }
                        }
                    }
                }
            }
        }
    }

    static setRelation(properties: RelationRefI, attribute: string, obj: any, parent: any) {
        const modelPath = '../../../../src/models/';
        const modelImport = require(modelPath + kebabCase(properties.name)).default;
        let modelObjs;

        if (Array.isArray(obj[attribute])) {
            modelObjs = [];

            for (const objAtr of obj[attribute]) {
                modelObjs.push(new modelImport(objAtr));
            }
        }
        else if (typeof obj[attribute] !== 'object' && typeof properties.column === 'string') {
            parent[attribute] = obj[attribute];
            return; // done.
        }
        else {
            modelObjs = new modelImport(obj[attribute])
        }

        /**
         * Naming convention for relationship function naming:
         *
         * - 'set' in front of pascalCase attribute name.
         */
        if (PDC.relationHasChildren(properties.name)) {
            const functionName = `set${pascalCase(attribute)}`;

            if (!parent[functionName]) {
                throw new Error(`"${functionName}" didn't exist on "${parent.__className}"`);
            }

            if (Array.isArray(modelObjs)) {
                for (const modelObj of modelObjs) {
                    parent[functionName](modelObj);
                }
            }
            else {
                parent[functionName](modelObjs);
            }
        }
    }
}

export function EModel() {
    return function <T extends new (...args: any[]) => {}>(constr: T) {

        const clssName = constr.name;

        constr.prototype.mainClassName = clssName;

        Object.defineProperty(constr, 'modelProps', { value: PDC.getEntityProps(clssName), writable: false });
        Object.defineProperty(constr, 'metadata', {
            value: {
                name: clssName,
            },
            writable: false,
        });

        return class ExtendedModel extends constr {
            __className: string = clssName;

            constructor(...args: any[]) {
                super(...args);

                Object.defineProperty(this, 'meta_data', { value: { type: clssName, columns: {} } });
            }

            static getParentName() { return constr.name }

            static purgeNull(obj: any) {
                for (const key of Object.keys(obj)) {
                    if (obj[key] === null) delete obj[key];
                }
                return obj;
            }

            static convertAliases(ob: any, modelName: string = constr.name) {
                const newObj: { [key: string]: any } = {};
                const entityProperties = PDC.getEntityProps(modelName);

                for (const key of Object.keys(ob)) {
                    if (key.includes(modelName)) {
                        const property = key.replace(`${modelName}_`, '')

                        newObj[property] = ob[key];
                        delete ob[key];
                    }
                    else if (key.includes('_')) {
                        const childModel = key.slice(0, key.lastIndexOf('_'));

                        // replace child model properties
                        for (const entityKey in entityProperties) {
                            const prop = entityProperties[entityKey];

                            if (prop.type === childModel) {
                                if (typeof newObj[entityKey] !== 'object') newObj[entityKey] = this.convertAliases(ob, childModel);
                            }
                        }
                    }
                    // no conversion needed for this object
                    else return ob;
                }

                return newObj;
            }

            /**
             *
             * @param obj
             * @returns
             */
            static fromObj(obj: any) {
                let parent;

                obj = this.purgeNull(obj);
                obj = this.convertAliases(obj);

                parent = new ExtendedModel(obj);

                ProcessRelations.setAllRelations(constr.name, obj, parent);

                return parent;
            }

            static fromObjs(objs: any[]) {
                const out: any[] = [];

                (Array.isArray(objs) ? objs : Object.values(objs)).forEach(function (obj: any) {
                    out.push(ExtendedModel.fromObj(obj));
                });

                return out;
            }

            /**
             * Remove unwanted data properties from the given `obj`
             *
             * @param obj data to be used for updating database entry.
             * @param entityProperties all entity properties
             * @returns
             */
            public cleanUpdateData(obj: any, entityProperties: EntityPropsI = PDC.getEntityProps(constr.name)) {
                for (const objKey of Object.keys(obj)) {
                    const objValue = obj[objKey];
                    const entityProp = entityProperties[objKey];

                    // 1. Transient data is not stored in a database, only calculated.
                    if (entityProp.isTransient) {
                        delete obj[objKey];
                        continue;
                    }

                    // 2. delete relational objects that should not be stored.
                    if (entityProp.isEntity
                        && (
                            typeof objValue === 'undefined'
                            ||
                            (Array.isArray(objValue) && objValue.length === 0)
                            ||
                            (typeof objValue === 'object')
                        )
                    ) {
                        delete obj[objKey];
                    }
                    // 3. rename relational properties that have primitive values, they're foreignkeys
                    else if (entityProp.isEntity && typeof objValue !== 'object' && typeof objValue !== 'undefined') {
                        const relations = PDC.relation(constr.name).relations;

                        obj[relations[objKey].column] = objValue;
                        delete obj[objKey];
                    }
                }

                return obj;
            }

            /**
             * Returns a Map of dependencies.
             * 
             * @param models model set
             * @returns 
             */
            private buildDependencyGraph(models: Record<string, Model>[]): Map<string, string[]> {
                const graph = new Map<string, string[]>();
        
                models.forEach(modelRecord => {
                    const modelName = Object.keys(modelRecord)[0];
                    const model = modelRecord[modelName];
        
                    const relationships = model.CHILD_RELATIONSHIPS || model.RELATIONSHIPS || {};
        
                    Object.keys(relationships).forEach(relatedModel => {
                        const dependency = relationships[relatedModel].direction === 'input' ? relatedModel : modelName;
                        const dependent = relationships[relatedModel].direction === 'input' ? modelName : relatedModel;
        
                        if (!graph.has(dependency)) {
                            graph.set(dependency, []);
                        }
                        if (!graph.get(dependency)!.includes(dependent)) {
                            graph.get(dependency)!.push(dependent);
                        }
                    });
                });
        
                return graph;
            }
        
            /**
             * Sort the graph such that it's in the correct dependent ordering.
             * 
             * @param graph dependency graph
             * @returns 
             */
            private topologicalSort(graph: Map<string, string[]>): string[] {
                const sorted: string[] = [];
                const visited: Set<string> = new Set();
                const temp: Set<string> = new Set();
        
                const visit = (node: string, path: string[] = []) => {
                    if (visited.has(node)) return;
        
                    if (temp.has(node)) {
                        console.info(`Cyclic dependency detected: ${path.join(' -> ')} -> ${node}`);
                        return; // Skip this node to avoid infinite loop
                    }
        
                    temp.add(node);
                    graph.get(node)?.forEach(nextNode => visit(nextNode, [...path, node]));
                    temp.delete(node);
                    visited.add(node);
                    sorted.push(node);
                };
        
                Array.from(graph.keys()).forEach(node => visit(node));
        
                return sorted;
            }        
        
            /**
             * Order the models such that they're correctly positioned for foreignkeys to be injected into the next model.
             * 
             * @param models model set
             * @returns 
             */
            public sortModels(models: Record<string, Model>[]): Record<string, Model>[] {
                const graph = this.buildDependencyGraph(models);
                const modelOrder = this.topologicalSort(graph);
        
                const modelInstances: Record<string, number> = {};
                const sortedModels: Record<string, Model>[] = [];
        
                modelOrder.forEach(modelName => {
                    models.filter(model => Object.keys(model)[0] === modelName).forEach(model => {
                        modelInstances[modelName] = (modelInstances[modelName] || 0) + 1;
                        const instanceName = `${modelName}_${modelInstances[modelName]}`;
                        sortedModels.push({ [instanceName]: model[modelName] });
                    });
                });

                // Handle standalone models that have no dependencies
                models.forEach(model => {
                    const modelName = Object.keys(model)[0];
                    if (!modelInstances[modelName]) {
                        modelInstances[modelName] = 1;
                        const instanceName = `${modelName}_1`;
                        sortedModels.push({ [instanceName]: model[modelName] });
                    } else if (graph.has(modelName) && graph.get(modelName)!.length === 0) {
                        // Increment instance for standalone models which are already in the graph but have no dependencies
                        modelInstances[modelName]++;
                        const instanceName = `${modelName}_${modelInstances[modelName]}`;
                        sortedModels.push({ [instanceName]: model[modelName] });
                    }
                });
        
                return sortedModels;
            }        
        
            /**
             * Creates a structure model of the data to be inserted and compares it with the relationship data and identity properties.
             *
             * for each object in the array model, create an array / object structure that can be inserted.
             *
             * ! The structure of the data `obj` must resemble the model and its relationships, otherwise the conversion will fail.
             *
             * Returns table and key information (primary key, foreign key etc.) about the datastructure to be inserted, in a relational format.
             *
             * @param obj given data to insert.
             * @param identityProperties
             */
            public getInsertUpdateStructureModel(
                objs: any,
                isReplace: boolean = false,
                identityProperties: string[] = ExtendedModel.getIdentityProperties(constr.name),
                entityProperties: EntityPropsI = PDC.getEntityProps(constr.name),
                modelName: string = constr.name,
            ): object {
                let result: any[] = [];
                const objItem: any = { [modelName]: {} };

                if (!Array.isArray(objs)) objs = [objs]; // keep the code uniform, any input is an array

                // loop over the given object(s) to insert.
                for (const obj of objs) {
                    const parameterKeys: string[] = Object.keys(obj);

                    // loop over the parameters keys given in this object
                    for (const key of Object.keys(entityProperties)) {
                        const entityItem = entityProperties[key];
                        const value: any = obj[key];
                        // const isDefaultValue: boolean = typeof entityItem.defaultValue !== 'undefined' && entityItem.defaultValue === value ? true : false;

                        // in case the value does not exist, but it's an entity.
                        // there may be child relationships, store foreign keys if any.
                        if (entityItem.isEntity && typeof value === 'undefined') {
                            const childRelations = PDC.relation(modelName);
                            const childRelationship = childRelations.relations[key];

                            if (typeof childRelationship === 'object') {

                                // capture child relationship data, this is used to ensure correct insert order.
                                if ( (childRelationship.type === 'ManyToOne' || childRelationship.type === 'OneToOne') && typeof childRelationship.column !== 'undefined') {
                                    objItem[modelName][childRelationship.column] = 0
                                }

                                if (typeof objItem[modelName][PDC.CHILD_RELATIONSHIP] === 'undefined') objItem[modelName][PDC.CHILD_RELATIONSHIP] = {};

                                objItem[modelName][PDC.CHILD_RELATIONSHIP][childRelationship.name] = {
                                    [childRelationship.type]: {
                                        column: childRelationship.column,
                                        joinOn: childRelationship.joinOn,
                                        type: childRelationship.type,
                                        owner: childRelationship.owner,
                                        direction: childRelationship.direction,
                                        table: PDC.getTableName(childRelationship.name)
                                    }
                                };
                            }
                        }

                        // Transient properties are not stored in the Database, ignore them.
                        if (entityItem.isTransient) continue;

                        // if there's no value, we can skip processing.
                        if (typeof value === 'undefined') continue;

                        // Empty array?, skip.
                        if (Array.isArray(value) && value.length === 0) continue;

                        // change the model if any identity property is found, and make sure the property exists in this model.
                        if (this.isIdIncluded(identityProperties, entityProperties, key, isReplace)) {
                            const childModelName = entityProperties[key].type;
                            const pdcRelations = PDC.relation(modelName);

                            if (typeof pdcRelations !== 'undefined') { // avoids errors with potential models that have no relationships defined.
                                const parentRelationship: any = pdcRelations.relations[key];

                                if (parentRelationship) {
                                    // in case the value is a primitive type, string, number etc. we can ignore the relationship.
                                    // if value is an object or an array, process as normal.
                                    if (!(typeof value === 'object' || Array.isArray(value)) && typeof parentRelationship.column === 'string') {
                                        objItem[modelName][parentRelationship.column] = value;
                                        // in some cases, the key is different than the relationship column, delete it.
                                        if (key !== parentRelationship.column) delete objItem[modelName][key];

                                        continue;
                                    }

                                    if (typeof objItem[modelName].RELATIONSHIPS === 'undefined') objItem[modelName].RELATIONSHIPS = {};
                                    // relationship description with parent object.
                                    objItem[modelName].RELATIONSHIPS[childModelName] = {
                                        [parentRelationship.type]: {
                                            column: parentRelationship.column,
                                            joinOn: parentRelationship.joinOn,
                                            type: parentRelationship.type,
                                            owner: parentRelationship.owner,
                                            direction: parentRelationship.direction,
                                            table: PDC.getTableName(parentRelationship.name)
                                        } as { column: string, joinOn: any[], type: string, table: string }
                                    };

                                    // add the foreign key, if any
                                    if (typeof parentRelationship === 'object' && parentRelationship.type === 'OneToOne') {
                                        // only add when it's the model "owning" the foreignKey as defined in the 'column' property.
                                        if (parentRelationship.column !== undefined) {
                                            objItem[modelName][parentRelationship.column] = 0;
                                        }
                                    }

                                    if (this.isForeignKey(value, parentRelationship, PDC.getEntityProps(parentRelationship.name))) {
                                        const foreignKeyOverride: string = parentRelationship.column;
                                        const identifierColumn = parentRelationship.joinOn[0];

                                        objItem[modelName][foreignKeyOverride] = value[identifierColumn];
                                        continue; // we do not need to process any further.
                                    }
                                    else if (Array.isArray(obj[key])) {
                                        // relationship child data `ModelProperties`, either an array or an object.
                                        for (const iterateObj of obj[key]) {
                                            result = result.concat(this.getInsertUpdateStructureModel(
                                                iterateObj,
                                                isReplace,
                                                identityProperties,
                                                PDC.getEntityProps(childModelName),
                                                childModelName
                                            ));
                                        }
                                    }
                                    else {
                                        result = result.concat(this.getInsertUpdateStructureModel(
                                            obj[key],
                                            isReplace,
                                            identityProperties,
                                            PDC.getEntityProps(childModelName),
                                            childModelName
                                        ));
                                    }
                                }
                            }
                        }
                        else {
                            objItem[modelName][key] = value;
                        }
                    }

                    result.push(objItem);
                }

                return result;
            }

            /**
             * If the joinOn keys match all the parentObj keys, then this is a foreign key insert only.
             *
             * If true, the column (foreignKey) should be set as the value.
             *
             * Foreign key only
             *
             * @param parentObj
             * @param parentRelationship
             * @returns
             */
            private isForeignKey(parentObj: any, parentRelationship: any, entityProperties: EntityPropsI): boolean {
                if (parentRelationship.type === 'ManyToOne' || parentRelationship.type === 'OneToOne') {
                    const ignoreKeys: string[] = [];

                    // 1. determine default objects to ignore, if any.
                    for (const objKey of Object.keys(parentObj)) {
                        const entProp = entityProperties[objKey];
                        let objValue = parentObj[objKey];
                        if (objValue === '[]') objValue = [];

                        const isDefaultValue = typeof entProp !== 'undefined' && typeof entProp.defaultValue !== 'undefined'
                            && (
                                (entProp.defaultValue === objValue)
                                ||
                                (Array.isArray(entProp.defaultValue) && Array.isArray(objValue) && objValue.length === 0)
                                ||
                                (typeof entProp.defaultValue === 'object' && typeof objValue === 'object' && Object.keys(objValue).length === 0)
                            );

                        const isEmptyEntityObject = typeof entProp !== 'undefined' && entProp.isEntity
                            && ((Array.isArray(objValue) && objValue.length === 0) || (typeof objValue === 'object' && Object.keys(objValue).length === 0))

                        if (isDefaultValue) ignoreKeys.push(objKey);
                        if (isEmptyEntityObject) delete parentObj[objKey];
                    }

                    // 2. determine identifiers.
                    for (const objKey of Object.keys(parentObj)) {
                        for (const joinKey of parentRelationship.joinOn) {
                            if (ignoreKeys.includes(objKey)) continue;
                            if (objKey !== joinKey) return false;
                        }
                    }

                    return true;
                }

                return false;
            }

            private isIdIncluded(identityProperties: string[], entityProperties: EntityPropsI, key: string, isReplace: boolean): boolean {
                for (const idProperty of identityProperties) {
                    // exact match identity property name with the key.
                    if (idProperty.includes('.')) {
                        for (const idProp of idProperty.split('.')) {
                            if (idProp === key && typeof entityProperties[key] !== 'undefined' && !isReplace && entityProperties[key].isEntity) return true;
                        }
                    }
                    else {
                        if (idProperty === key && typeof entityProperties[key] !== 'undefined' && !isReplace && entityProperties[key].isEntity) return true;
                    }
                }

                return false;
            }

            static getIdentityProperties(modelName: string, path: string = '', models: string[] = [], currentDepth: number = 0, maximumDepth: number = 4): string[] {
                const UID = 'uid';
                const entityProperties = PDC.getEntityProps(modelName);
                let columns: string[] = [];

                models.push(modelName);

                for (const col in entityProperties) {
                    const columnObj = entityProperties[col];

                    if (columnObj.isEntity && !models.includes(columnObj.type) && currentDepth < maximumDepth) {
                        columns = columns.concat(this.getIdentityProperties(columnObj.type, `${path}${columnObj.name}.`, models, currentDepth + 1));
                    }
                    else if (columnObj.type === UID) {
                        columns.push(`${path}${columnObj.name}`);
                    }
                }

                return columns;
            }

            /**
             * De-duplication recursive process.
             *
             * Takes a set of SQL result objects 'objs', the identity properties for that result set 'identityProperties', the current unique object for that recursion 'uniqueObj'.
             *
             * Converts the 'objs' to unique objects using a path grouping (identity properties grouped by object)
             * to ensure all potential unique objects within the parent object of the parent loop are captured recursively.
             *
             * @param objs - set of SQL results
             * @param uniqueObj - unique object of the recursion loop, starts off 'undefined'.
             * @param identityProperties - string array of identity properties in relation to the 'uniqueObj', representing the depth of the recursion and how to compare objects with each other.
             *
             * @returns - de-duplicated set of results
             */
            static deDuplicate(objs: any[], uniqueObj: any, identityProperties: string[] = this.getIdentityProperties(constr.name)): any[] {

                // 1.   get all the basic identity and path properties for this result set.
                const currentId = identityProperties[0]; // for all objs records, the first record is the primary UID.
                const uniqueIds: any = []; // capture the unique ID values for this run.
                const duplicateResults: any = []; // all duplicate records for this run.
                const uniquePaths = new Set<string>(); // set of unique path names for this run.
                const parentIdProperty = currentId.includes('.') ? currentId.slice(currentId.lastIndexOf('.') + 1, currentId.length) : currentId;
                const path = currentId.includes('.') ? currentId.slice(0, currentId.lastIndexOf('.')) : '';

                let uniqueResults: any[] = [];
                let newResultSet: any[] = [];

                // 2. Remove current ID from the list
                identityProperties.splice(
                    identityProperties.findIndex(item => {
                        if (item === currentId) return true
                        else return false
                    }), 1);

                // 3. generate updated unique paths.
                for (const prop of identityProperties) {
                    if (path === '') {
                        // a. first run
                        if (prop.includes('.')) {
                            uniquePaths.add(prop.slice(path.length, prop.indexOf('.')));
                        }
                    }
                    else {
                        // b. inside the recursion.
                        if (prop.includes('.') && prop.includes(path)) {
                            const pathRemoved = prop.slice(path.length + 1, prop.length);

                            uniquePaths.add(pathRemoved.slice(0, pathRemoved.indexOf('.')));
                        }
                    }
                }

                // 4a. navigate duplicates to the path and create a new result set; newResultSet.
                for (let index = 0; index < objs.length; index++) {
                    let duplicate;

                    if (path !== '') duplicate = objs[index][path];
                    else duplicate = objs[index];

                    // path can be optional, and thus undefined. Ignore the path and return result.
                    if (duplicate === undefined) return uniqueObj;

                    if (Array.isArray(duplicate)) {
                        newResultSet = newResultSet.concat(duplicate);
                    }
                    else {
                        newResultSet.push(duplicate);
                    }
                }

                // 4b. we need to make sure the inner values are part of the result to be filtered to avoid missing unique objects inside of the duplicate parent object.
                if (typeof uniqueObj !== 'undefined'
                    && path !== ''
                    && Array.isArray(uniqueObj[path])) newResultSet = newResultSet.concat(uniqueObj[path]);

                // 5. if calculate uniques and duplicates, recursively resolve.
                if (newResultSet.length > 0) {

                    // 6.  get the unique primary records, and all of the duplicate records
                    uniqueResults = newResultSet.filter(element => {
                        const isDuplicate = uniqueIds.includes(element[parentIdProperty]);

                        if (!isDuplicate) {
                            uniqueIds.push(element[parentIdProperty]);

                            return true;
                        }
                        else {
                            duplicateResults.push(element);
                        }

                        return false;
                    });

                    // 7. process by unique result.
                    for (let index = 0; index < uniqueResults.length; index++) {
                        const element = uniqueResults[index];
                        const duplicates: any[] = [];

                        // 8. create the duplicate result set for this 'element'.
                        for (const duplicate of duplicateResults) {
                            if (duplicate[parentIdProperty] === element[parentIdProperty]) duplicates.push(duplicate);
                        }

                        // 9. create a set of unique paths, resolve all inner duplicates.
                        for (const uniquePath of uniquePaths) {
                            const secondLevelIds: string[] = [];
                            const pathLength = path === '' ? 0 : path.length + 1;

                            // 10. create the identifiers for the new recursive loop for this uniquePath.
                            for (const idProp of identityProperties) {
                                const idName = idProp.includes('.') ? idProp.slice(idProp.lastIndexOf('.') + 1, idProp.length) : idProp;
                                const pathName = idProp.slice(pathLength, idProp.lastIndexOf('.'));

                                if (pathName.includes(uniquePath)) secondLevelIds.push(`${pathName}.${idName}`)
                            }

                            // 11. create the results for this uniquePath and identifier.
                            if (path !== '') {
                                // a. inside the recursion
                                if (Array.isArray(uniqueObj[path])) {
                                    uniqueObj[path][index] = this.deDuplicate(duplicates, element, secondLevelIds);
                                }
                                else {
                                    uniqueObj[path] = element;
                                }
                            }
                            else {
                                // b. if first run, there's no path value.
                                uniqueResults[index] = this.deDuplicate(duplicates, element, secondLevelIds);
                            }
                        }
                    }
                }

                // 12. return results, if first run return the unique array of objects. on subsequent runs return and object or array depending on recursion depth.
                if (typeof uniqueObj === 'undefined') return uniqueResults;   // return first level results at the end of the recursion.

                // if the uniqueObj path is an Array and there are no more identity properties, store the uniqueResults array in the path.
                if (Array.isArray(uniqueObj[path]) && identityProperties.length === 0) {
                    uniqueObj[path] = uniqueResults;
                }

                return uniqueObj; // return individual results within the recursion.
            }

            /**
             * Example:
                [
                    {
                        key: 'url-params',
                        title: 'Url Params',
                        children: [
                            {
                                key: 'some-param-1',
                                title: 'Some Param 1'
                            },
                            {
                                key: 'some-param-2',
                                title: 'Some Param 2'
                            },
                        ]
                    }
                ]
             *
             * @param modelName
             * @param path
             * @param models
             * @param currentDepth
             * @param maximumDepth
             * @returns
             */
            static getReturnStructure(modelName: string = constr.name, models: string[] = [], currentDepth: number = 0, maximumDepth: number = 4) {
                const entityProperties = PDC.getEntityProps(modelName);
                const entityArray: any[] = [];

                models.push(modelName);

                for (const col in entityProperties) {
                    const propertyObject: { key: string, title: string, children?: any[] } = { key: '', title: '' };
                    const columnObj = entityProperties[col];

                    propertyObject.key = kebabCase(columnObj.name);
                    propertyObject.title = columnObj.name;

                    if (columnObj.isEntity && !models.includes(columnObj.type) && currentDepth < maximumDepth) {
                        propertyObject.children = [];
                        propertyObject.children = this.getReturnStructure(columnObj.type, models, currentDepth + 1);
                    }

                    entityArray.push(propertyObject);
                }

                return entityArray;
            }

            async serialize(ignoreWhereProps: boolean = false, serializeAll: boolean = false, adm: ActionDataManager, parent: string = '') {
                let self: any = this,
                    out: any = {},
                    ignoreKeys: string[] = ['_srcId'];

                try {
                    // first we get all the properties that have been registered with a valid model property decorator
                    // these are compileted into an object in the main BaseModel class via the method "initClassKeyRefs"
                    // method in the @eezze/decorators/models/types file
                    const modelKeys = BaseModel.getClassProperties(constr.name);

                    if (ignoreWhereProps) {
                        ignoreKeys = ignoreKeys.concat(BaseModel._getUIDKeys(this) as string[]);
                    }

                    // then need to loop over each of the properies in the modelKeys array and set all
                    // the properties of the out object to the the class property "getters" or the getter
                    // over rides in the class if they exist
                    for (const k in modelKeys) {
                        if (typeof self[k] == 'undefined') {
                            // console.log('CONTINUED ON: ', k, 1);
                            continue;
                        }
                        // @Rolf - anther reference - Bug where we are loosing the "id" key on replace
                        if (ignoreKeys.includes(k) && !serializeAll) {
                            // console.log('CONTINUED ON: ', k, 2);
                            continue;
                        }

                        if (self[k] == undefined) {
                            // console.log('CONTINUED ON: ', k, 3);
                            continue;
                        }

                        if (self[k] === '') {
                            // console.log('CONTINUED ON: ', k, 4);
                            continue;
                        }

                        let props: any = self._propertyDecoratorArgs[k] ?? {}, propValue;

                        // if the property is a secret then it should never be serialized.
                        // there are cases where we need to serialize everything, so we use
                        // the serialize all arg to do so
                        if (props.isSecret && !serializeAll) {
                            // console.log('CONTINUED FROM HERE: ', serializeAll, k);
                            continue;
                        }

                        // return the value of the serializer "cb" / getter override
                        // @Todo @Ryan in case k === 'values', this will evaluate to true(!!)
                        if (typeof self._serializeKeyOverrides[k] == 'function') {
                            const cb = self._serializeKeyOverrides[k];

                            /**
                             * the self refers in this case to the ExtendedModel object and NOT the EezzeRequest.
                             */
                            // here is where we take care of the async getters / serializers
                            if (isPromise(cb)) propValue = await cb(
                                self,
                                adm,
                                'EActionInput:decorator: serialize: promise'
                            );
                            // this is the non async varient
                            else propValue = cb(
                                self,
                                adm,
                                'EActionInput:decorator: serialize: none promise'
                            );
                        }
                        // set to the class value for default
                        else {
                            if (PDC.relationExists(constr.name, k)) {
                                const relations = PDC.relation(constr.name).relations;

                                if (typeof relations[k] !== 'undefined' && typeof self[k] === 'object') {
                                    let uniqueSet: Set<string>; // Set of string values, ensures unique values within MTM, MTO relations

                                    switch (relations[k].type) {
                                        case 'OneToOne':

                                            // bi-direction one-to-one, ignore reverse
                                            if (parent !== k) propValue = await self[k].serialize(ignoreWhereProps, serializeAll, adm, k);
                                            else continue;

                                            break;

                                        case 'ManyToOne':
                                            propValue = await self[k].serialize(ignoreWhereProps, serializeAll, adm);

                                            break;

                                        case 'OneToMany':
                                            propValue = [];
                                            uniqueSet = new Set<string>();

                                            for (const obj of self[k]) {
                                                uniqueSet.add(JSON.stringify(await obj.serialize(ignoreWhereProps, serializeAll, adm)));
                                            }

                                            for (const item of uniqueSet) {
                                                propValue.push(JSON.parse(item));
                                            }

                                            break;

                                        case 'ManyToMany':
                                            propValue = [];
                                            uniqueSet = new Set<string>();

                                            for (const obj of self[k]) {
                                                uniqueSet.add(JSON.stringify(await obj.serialize(ignoreWhereProps, serializeAll, adm)));
                                            }

                                            for (const item of uniqueSet) {
                                                propValue.push(JSON.parse(item));
                                            }

                                            break;

                                        default:
                                            propValue = self[k];
                                    }
                                }
                                // in case we just need to set the foreignKey, ignore object serialization
                                else if (typeof relations[k] !== 'undefined' && typeof self[k] !== 'object') {
                                    propValue = self[k];
                                }
                            }
                            else {
                                propValue = self[k];
                            }
                        }

                        // here we need to propcess the value based on the stored props (i.e. if a custom serializer)
                        // function exists in th passed props then we call the callback to trasform the value from here
                        processPropsToValue(out, props, k, propValue);
                    }

                    return out;
                }
                catch (e) {
                    console.log('EAction Decorator ERROR: ', e.message);
                    const message = `Error serializing model: ${constr.name}: ${e.message}`;
                    console.log(message);
                    self.logger.error(message, 'EAction Decorator ERROR: catch', adm);
                    return {};
                }
            }
            getWhereKeys() {
                return Object.keys(BaseModel._getUID(this));
            }
            toJson() { return serialize(this) }
            updateNonWhereProps(obj: any) {
                const whereKeys = this.getWhereKeys(), self: any = this;

                for (const k in obj) {
                    if (whereKeys.includes(k)) continue;
                    self[k] = obj[k];
                }
            }
        };
    }
}

export * from './types';