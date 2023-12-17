import { kebabCase } from '../../libs/StringMethods';
import Logger from '../../classes/Logger';
import MySql from './MySql';
import DynamoDb from './DynamoDb';
import SmtpEmailService from './SmtpEmailService';
import FileStorage from './FileStorage';
import WsIntegration from './WsIntegration';
import RestIntegration from './RestIntegration';
import PDC from '../../classes/ProjectDependancyCaches';
import ConnectionServer from '../../base/ConnectionServer';
import ConnectionAWS from '../../base/ConnectionAWS';

import { DSArgsI } from '../../interfaces/DSArgsI';

export default class Datasource {
	_srcId: string = '_ds';

	db: MySql | DynamoDb;
	source: SmtpEmailService | FileStorage | any;
	type: string;
	props: any;

	private _propsInternal: any;

	public get propsInternal(): any { return this._propsInternal }

	/**
	 * General Rules:
	 *
	 * 		1. All settings from the DS will override the "connection" settings
	 * 		2. There must be a set of rules that will allow us to connect to everything in the dockers when running on a server.
	 *         This is why we check if the instance of connection is of "ConnectionServer" type as the access of each dependency can be different
	 *
	 */
	connection: E_CONNECTION;

	constructor(args: DSArgsI, srcName: string, logger: Logger) {
		this.type = args.datasourceType;

		const type = kebabCase(args.datasourceType);

		try {
			if (args.connection) this.connection = PDC.getConnectionIns(args.connection);
		}
		catch (err) {
			throw Error(`Err1: Connection: ${args.connection}, initialization error: ${err.message}`)
		}

		switch (type) {
			case 'mysql':
				const mysqlProps = this.getConnectionProperties(args, logger);

				if (!mysqlProps?.port) mysqlProps.port = 3306;

				this.props = {
					className: srcName,
					host: mysqlProps.host,
					database: mysqlProps?.database,
					user: mysqlProps.auth?.user,
					password: mysqlProps.auth?.pass,
					port: mysqlProps.port,
					includeDatabase: mysqlProps?.includeDatabase,
				};

				this.db = new MySql(this.props, logger);

				break;

			case 'smtp-mail-service':
				const smtpProps = this.getConnectionProperties(args, logger);

				this.props = {
					className: srcName,
					host: smtpProps.host,
					port: smtpProps.port,
					secure: smtpProps.secure,
					auth: smtpProps.auth,
					isThridParty: typeof this.connection != 'object',
				};

				this.source = new SmtpEmailService(this.props, logger);
				break;

			case 'file-storage':
				let fsHost = this.connection?.host;

				// @Bug - This is wrong. This should be the external Url instead of just IP
				if (this.connection instanceof ConnectionServer && this.connection.isDefaultHost) {
					fsHost = `${this.connection.ip}`;
				}

				this.props = {
					className: srcName,
					host: fsHost,
					fileType: args?.fileType,
					rootPath: args?.rootPath,
				};

				this.source = new FileStorage(this.props, logger);
				break;

			case 'ws-integration':
				const wsProps = this.getConnectionProperties(args, logger);

				this.props = {
					className: srcName,
					url: wsProps.url,
					host: wsProps.host,
					port: wsProps.port,
					path: wsProps?.path,
					headers: wsProps?.headers,
					secure: wsProps?.secure,
				};

				this.source = new WsIntegration(
					logger,
					wsProps.url,
					this.props.headers,
				);

				break;

			case 'rest':
				const restProps = this.getConnectionProperties(args, logger);

				this.props = {
					className: srcName,
					alias: restProps.alias,
					host: restProps.host,
					port: restProps.port,
					path: restProps.path,
					secure: restProps?.secure,
				};

				this.source = new RestIntegration(
					logger,
					restProps.url,
				);

				break;
		}

		this._propsInternal = {...this.props};

		Object.freeze(this.props);
		Object.freeze(this._propsInternal);
	}

	getConnectionProperties(args: DSArgsI, logger: Logger) {
		try {
			// HOST

			const hasHost = typeof args?.host == 'string';

			let host = hasHost ? args?.host : this.connection?.host;

			let alias = args?.alias ? args?.alias : this.connection?.alias ? this.connection?.alias : '';

			if (this.connection instanceof ConnectionServer) {
				if (this.connection.isDefaultHost && !hasHost) {
					host = `${this.connection.ip}`; // e.g. 0.0.0.0 or localhost
				}
				else {
					host = `${this.connection.externalHostName}`; // public ip / dns name (.e.g. app.eezze.io)
				}
			}
			else if (this.connection instanceof ConnectionAWS) {
				if (this.connection.type === 'aliased-network') {
					// @Ryan - remember to check: this.connection.isDefaultHost
					if (hasHost) {
						host = `${args.host}`; // e.g. 0.0.0.0 or localhost
					}
					else {
						host = `${this.connection.networkAlias}`;
					}
				}
			}

			// PORT

			const port = args?.port ?? this.connection.port ?? '';
			const protocol = args?.protocol ?? this.connection?.protocol;
			const secureProtocol = args?.secureProtocol ?? this.connection?.secureProtocol;

			// AUTH

			const user = args?.user ?? this.connection?.user;
			const password = args?.password ?? this.connection?.password;

			// PROTOCOL

			let isSecure = false;

			if (this.connection instanceof ConnectionServer && this.connection?.isDev) {
				if (typeof args.devIsSecure == 'boolean') {
					isSecure = args.devIsSecure;
				}
				else if (typeof this.connection.secure == 'boolean') {
					isSecure = this.connection.secure;
				}
			}
			else {
				if (typeof args.secure == 'boolean') {
					isSecure = args.secure;
				}
				else if (this.connection instanceof ConnectionServer && typeof this.connection.secure == 'boolean') {
					isSecure = this.connection.secure;
				}
			}

			// PATH

			let path = '';

			if (typeof args.path == 'string') {
				path = args.path;
			}
			else if (this.connection instanceof ConnectionServer && typeof this.connection.path == 'string') {
				path = this.connection.path;
			}

			// URL

			const url = `${isSecure ? secureProtocol : protocol}://${host}${port ? `:${port}` : ''}${path}`;

			return {
				url,
				host,
				port,
				secure: isSecure,
				path,
				alias,
				headers: args?.headers,
				auth: {
					user,
					pass: password,
				},
				database: args?.databaseName,
				includeDatabase: !!args?.includeDatabase
			};

		}
		catch (err) {
			throw `Err1: getConnectionProperties: ${args.connection}, initialization error: ${err.message}`;
		}
	}
}