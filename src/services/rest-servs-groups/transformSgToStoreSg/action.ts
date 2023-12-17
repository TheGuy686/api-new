import { EAction, GetOne, Do, ReplaceOne, CreateOne, GetList, DataTransformer, ServiceCaller, Query } from '@eezze/decorators';
import { ActionDataManager } from '@eezze/classes';
import { EArray, ESet } from '@eezze/classes/logic';
import { DS_DB_TYPES } from '@eezze/global-consts';
import BaseAction from '@eezze/base/action/BaseAction';
import EJson from '@eezze/classes/logic/json';

/**
 */
@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.ServiceGroupRepo',
})
export default class TransformSgToStoreSgAction extends BaseAction {
	@GetOne({
		failOnEmpty: true,
		checkOn: [ 'id' ],
		onSuccess: (adm: ActionDataManager) => {
			const sg = {...adm.result};

			delete sg.id;
			delete sg.projectId;

			ESet(adm.stash, 'serviceGroup', {
				...sg,
				srcId: adm.input.id,
				metadata: JSON.parse(sg.metadata),
				services: [],
			});
		},
	})
	@GetList({
		repo: 'Mysql.ServiceRepo',
		checkOn: [ 'serviceGroupId' ],
		input: (adm: ActionDataManager) => ({ serviceGroupId: adm.result?.id }),
		onSuccess: (adm: ActionDataManager) => {
			const services = adm.result.map((ser: any) => {
				delete ser.id;
				delete ser.serviceGroupId;
				delete ser.projectId;
				return ser;
			});

			ESet(adm.stash.serviceGroup, 'services', services);
		},
	})
	@DataTransformer({
		output: (adm: ActionDataManager) => {
			try {
				const result: any = {
					requiredConTypes: [],
					roles: [],
					connections: [],
					dssIds: [],
					datasources: [],
					serviceConfigurables: [],
					credentials: [],
					values: [],
					entities: {},
					entityKeys: [],
					requiredDeps: {}
				};

				if (adm.stash?.serviceGroup?.metadata?.wsDs) {
					result.dssIds.push(adm.stash?.serviceGroup?.metadata?.wsDs);
				}

				if (adm.stash?.serviceGroup?.metadata?.restDs) {
					result.dssIds.push(adm.stash?.serviceGroup?.metadata?.restDs);
				}

				const services = adm.stash.serviceGroup.services;

				for (const ser of services) {
					const def = EJson.parseKeyObject(ser, 'definition');
					const logic = JSON.parse(ser.logic);
					const roles = result.roles.concat(def?.roles ?? []);

					if (roles.length > 0 && result.roles.length > 0) {
						result.roles = EArray.mergeUnique(roles, result.roles);
					}
					else result.roles = [...roles];

					for (const ai of logic) {
						const ds = ai?.schema?.datasource;
						const tpl = ai?.schema?.template;
						const ent = ai?.schema?.entity;

						if (ds && !result.datasources.includes(ds)) {
							result.datasources.push(ds);
						}

						if (tpl && !result.serviceConfigurables.includes(tpl)) {
							result.serviceConfigurables.push(tpl);
						}

						if (ds && typeof result.entities[ds] == 'undefined') {
							result.entities[ds] = [];
						}

						if (ent && !result.entities[ds].includes(ent)) {
							result.entities[ds].push(ent);

							if (!result.entityKeys.includes(ent)) {
								result.entityKeys.push(ent);
							}
						}
					}
				}

				ESet(adm.stash, 'deps', result);

				return result;
			}
			catch (err) {
				ESet(adm.stash, 'deps', {});
				return {};
			}
		}
	})
	@Query({
		failOnEmpty: (adm: ActionDataManager) => adm.stash?.deps?.datasources.length > 0,
		repo: 'Mysql.DatasourceRepo',
		query: (adm: ActionDataManager) => `
				SELECT datasource.id,
					   datasource.key,
					   datasource.type,
					   datasource.name,
					   datasource.description,
					   datasource.metadata,
					   datasource.initModel
				  FROM datasource AS datasource
				 WHERE datasource.key IN('${adm.stash?.deps?.datasources.length > 0 ? adm.stash?.deps?.datasources.join('\', \'') : ''}')
				    OR datasource.id  IN('${adm.stash?.deps?.dssIds.length > 0 ? adm.stash?.deps?.dssIds.join('\', \'') : ''}')
		`,
		onSuccess: (adm: ActionDataManager) => {
			const dss: any = [];
			const dssDict: any = {};
			const conns: any[] = [];
			const creds: any[] = [];
			const credValues: any = {};

			for (const ds of adm.result) {
				const id = `${ds.id}`;
				const key = `${ds.key}`;
				const md = EJson.parseKeyObject(ds, 'metadata');
				const im = ds?.initModel !== '[]' ? JSON.parse(ds?.initModel) : [];

				if (typeof md?.connection != 'undefined') {
					conns.push(md?.connection);
				}

				if (typeof md?.credentials != 'undefined') {
					creds.push(md?.credentials);

					// here we loop over each of the values in the metadata object and just
					// check on which is uppercase numberic and underscores (this is a very
					// crude way of getting the values out of the MD object but its fast)
					for (const k in md) {
						// this is becase if the value is only numeric then it cant be a key
						if (/[0-9]+/.test(md[k])) continue;
						// when the value is lowercase then we don't need to include it here
						// as anything that is a reference to a cred vault or a value then 
						// the keys will always be an uppercase value.
						if (/[a-z0-9]+/.test(md[k])) continue;
						if (!/[A-Z0-9_]+/.test(md[k])) continue;

						if (typeof credValues[md?.credentials] == 'undefined') {
							credValues[md?.credentials] = {};
						}

						credValues[md?.credentials][k] = md[k];
					}
				}

				const dsEnts = adm.stash.deps.entities?.[key] ?? [];

				ESet(ds, 'initModel', im.filter((ent: any) => dsEnts.includes(ent.id)));
				ESet(ds, 'initModel', JSON.stringify(ds.initModel));

				delete ds.id;

				dssDict[id] = ds;
				dss.push(ds);
			}

			ESet(adm.stash.deps, 'connections', conns);
			ESet(adm.stash.deps, 'credentials', creds);
			ESet(adm.stash.deps, 'credentialValues', credValues);
			ESet(adm.stash, 'datasources', dss);
		},
	})
	@Query({
		failOnEmpty: (adm: ActionDataManager) => adm.stash?.deps?.connections.length > 0,
		repo: 'Mysql.ConnectionRepo',
		query: (adm: ActionDataManager) => `
			SELECT connection.name,
			       connection.description,
			       connection.type,
				   connection.metadata,
				   connection.state
			  FROM connection connection
			 WHERE connection.id IN(${adm.stash?.deps?.connections.length > 0 ? adm.stash?.deps?.connections.join(', ') : "''"})
		`,
		onSuccess: (adm: ActionDataManager) => {
			const conns: any[] = [];

			let con: any;

			for (con of adm.result) {
				const md = EJson.parseKeyObject(con, 'metadata');

				if (Array.isArray(md?.serviceTypes)) {
					ESet(
						adm.stash.deps,
						'requiredConTypes',
						EArray.mergeUnique(adm.stash.deps.requiredConTypes, md?.serviceTypes)
					);
				}
			}

			ESet(adm.stash, 'connections', adm.result);
		},
	})
	@Query({
		failOnEmpty: (adm: ActionDataManager) => adm.stash?.deps?.credentials.length > 0,
		repo: 'Mysql.CredentialsVaultRepo',
		query: (adm: ActionDataManager) => `
			SELECT credentials_vault.id,
			       credentials_vault.name,
				   credentials_vault.description,
				   credentials_vault.accessibleTo,
				   credentials_vault.updatableTo,
				   credentials_vault.keyValues,
				   credentials_vault.createdAt,
				   credentials_vault.createdBy,
				   credentials_vault.updatedAt,
				   credentials_vault.updatedBy,
				   credentials_vault.active
			  FROM credentials_vault credentials_vault
			 WHERE credentials_vault.id IN(${adm.stash?.deps?.credentials.length > 0 ? adm.stash?.deps?.credentials.join(', ') : "''"})
		`,
		onSuccess: (adm: ActionDataManager) => {
			ESet(adm.stash, 'credentials', adm.result.map((cred: any) => {
				const kvs = EJson.parseKeyObject(cred, 'keyValues');
				const kvsIn = [];
				const credVals = Object.values(adm.stash.deps.credentialValues?.[cred.id] ?? []);	

				// here we need to clear out the value of the key value items in the vault to
				// make sure we don't accidently publish someones credentials to the app store
				for (const kv of kvs) {
					if (!credVals.includes(kv.key)) continue;
					kv.value = '';
					kvsIn.push(kv);
				}

				cred.keyValues = EJson.stringify(kvsIn, true);

				if (Array.isArray(cred?.accessibleTo)) {
					ESet(
						adm.stash.deps,
						'roles',
						EArray.mergeUnique(adm.stash.deps.roles, cred.accessibleTo)
					);
				}

				if (Array.isArray(cred?.updatableTo)) {
					ESet(
						adm.stash.deps,
						'roles',
						EArray.mergeUnique(adm.stash.deps.roles, cred.updatableTo),
					);
				}

				return cred;
			}));
		},
	})
	@Query({
		failOnEmpty: (adm: ActionDataManager) => adm.stash?.deps?.serviceConfigurables.length > 0,
		repo: 'Mysql.ServiceConfigRepo',
		query: (adm: ActionDataManager) => `
			SELECT service_config.name,
				   service_config.description,
				   service_config.type,
				   service_config.metadata,
				   service_config.active
			  FROM service_config AS service_config
			 WHERE service_config.id IN(${adm.stash?.deps?.serviceConfigurables.length > 0 ? adm.stash?.deps?.serviceConfigurables.join(', ') : "''"})
		`,
		onSuccess: (adm: ActionDataManager) => {
			ESet(adm.stash, 'serviceConfigs', adm.result);
		},
	})
	@Query({
		failOnEmpty: (adm: ActionDataManager) => adm.stash?.deps?.values.length > 0,
		repo: 'Mysql.ValueStoreRepo',
		query: (adm: ActionDataManager) => `
			SELECT value_store.key,
				   value_store.value,
				   value_store.type
		      FROM value_store value_store
		     WHERE value_store.id IN(${adm.stash?.deps?.values.length > 0 ? adm.stash?.deps?.values.join(', ') : "''"})
		`,
		onSuccess: (adm: ActionDataManager) => {
			ESet(adm.stash, 'values', adm.result);
		},
	})
	@Query({
		failOnEmpty: (adm: ActionDataManager) => adm.stash?.deps?.roles.length > 0,
		repo: 'Mysql.RoleRepo',
		query: (adm: ActionDataManager) => `
			SELECT role.role,
				   role.description,
				   role.active
			  FROM role role
			 WHERE role.id IN(${adm.stash?.deps?.roles.length > 0 ? adm.stash?.deps?.roles.join(', ') : "''"})
		`,
		onSuccess: (adm: ActionDataManager) => {
			ESet(adm.stash, 'roles', adm.result);
		},
	})
	@Do({
		run: (adm: ActionDataManager) => {
			try {
				const sg = {
					deps: {
						credentialValues: adm.stash.deps.credentialValues,
						requiredConTypes: adm.stash.deps.requiredConTypes,
					},
					serviceGroup: adm.stash.serviceGroup,
					connections: adm.stash.connections ?? [],
					vault: adm.stash.credentials ?? [],
					valueStore: adm.stash.values ?? [],
					serviceConfigs: adm.stash.serviceConfigs ?? [],
					roles: adm.stash.roles ?? [],
					datasources: adm.stash.datasources ?? [],
				};

				adm.setResult(sg);
			}
			catch (err) { return {} }
		}
	})
	async _exec() {}
}