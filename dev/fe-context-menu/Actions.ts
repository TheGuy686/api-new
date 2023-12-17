import { MenuStateInner, ServiceEACII } from './MenuState';
import { label } from './StateLogger';

class BaseAction {
	protected static runLCOnProp(prop: string, src: any, menuState: MenuStateInner, out: any[]) {
		if (src[prop]) {
			if (Array.isArray(src[prop])) {
				if (src[prop].length > 0) {
					out.push({
						mappingType: 'object',
						prop: prop,
						value: src[prop],
						returns: 'object',
					});
				}
			}
			else {
				out.push({
					mappingType: 'prop',
					prop: prop,
					value: src[prop],
					returns: src[prop]?.type
				});
			}
		}
	}

	protected static processCommon(aci: ServiceEACII, menuState: MenuStateInner, out: any[]) {
		const sch = aci?.schema;

		this.runLCOnProp('output', aci, menuState, out);
		this.runLCOnProp('onSuccess', sch, menuState, out);
	}
}

export class ActionDatabase extends BaseAction {
	/**
	 * 1. checkOn (whereKeys)
	 * 2. input (whereValues)
	 * 3. errorOnEmpty
	 *  ---- common ----
	 * 4. output
	 * 5. onSuccess
	 */
	public static getOne(aci: ServiceEACII, menuState: MenuStateInner, out: any[]) {
		if (menuState.debug) {
			label('Database->GetOne');
		}

		const sch = aci?.schema;
		
		// this.runLCOnProp('checkOn', sch, menuState, out);
		this.runLCOnProp('input', sch, menuState, out);
		this.runLCOnProp('errorOnEmpty', sch, menuState, out);

		this.processCommon(aci, menuState, out);
	}

	/**
	 * 1. input (values)
	 * 2. errorOnEmpty
	 * ---- common ----
	 * 3. output
	 * 4. onSuccess
	 */
	public static createOne(aci: ServiceEACII, menuState: MenuStateInner, out: any[]) {
		if (menuState.debug) {
			label('Database->CreateOne');
		}

		const sch = aci?.schema;

		this.runLCOnProp('input', sch, menuState, out);
		this.runLCOnProp('errorOnEmpty', sch, menuState, out);

		this.processCommon(aci, menuState, out);
	}

	/**
	 * 1. input (values)
	 * 2. errorOnEmpty
	 * ---- common ----
	 * 3. output
	 * 4. onSuccess
	 */
	public static replaceOne(aci: ServiceEACII, menuState: MenuStateInner, out: any[]) {
		if (menuState.debug) {
			label('Database->ReplaceOne');
		}

		this.processCommon(aci, menuState, out);

		const sch = aci?.schema;

		this.runLCOnProp('input', sch, menuState, out);
		this.runLCOnProp('errorOnEmpty', sch, menuState, out);
	}

	/**
	 * 1. input (values)
	 * 2. errorOnEmpty
	 * ---- common ----
	 * 3. output
	 * 4. onSuccess
	 */
	public static updateOne(aci: ServiceEACII, menuState: MenuStateInner, out: any[]) {
		if (menuState.debug) {
			label('Database->UpdateOne');
		}

		const sch = aci?.schema;

		this.runLCOnProp('input', sch, menuState, out);
		this.runLCOnProp('errorOnEmpty', sch, menuState, out);

		this.processCommon(aci, menuState, out);
	}

	/**
	 * 1. checkOn (whereKeys) - deleteOn (should be)
	 * 2. input (whereValues)
	 * ---- common ----
	 * 3. output
	 * 4. onSuccess
	 */
	public static deleteOne(aci: ServiceEACII, menuState: MenuStateInner, out: any[]) {
		if (menuState.debug) {
			label('Database->DeleteOne');
		}
		
		const sch = aci?.schema;
		
		// this.runLCOnProp('checkOn', sch, menuState, out);
		this.runLCOnProp('input', sch, menuState, out);
		
		this.processCommon(aci, menuState, out);
	}

	/**
	 * 1. checkOn
	 * 2. input (whereValues)
	 * 3. columns
	 * 4. errorOnEmpty
	 * ---- common ----
	 * 5. output
	 * 6. onSuccess
	 */
	public static getList(aci: ServiceEACII, menuState: MenuStateInner, out: any[]) {
		if (menuState.debug) {
			label('Database->GetList');
		}
		
		const sch = aci?.schema;
		
		// this.runLCOnProp('checkOn', sch, menuState, out);
		this.runLCOnProp('input', sch, menuState, out);
		this.runLCOnProp('columns', sch, menuState, out);
		this.runLCOnProp('errorOnEmpty', sch, menuState, out);
		
		this.processCommon(aci, menuState, out);
	}

	/**
	 * 1. checkOn
	 * 2. input (whereValues)
	 * 3. withValues
	 * ---- common ----
	 * 4. output
	 * 5. onSuccess
	 */
	public static getOneAndUpdate(aci: ServiceEACII, menuState: MenuStateInner, out: any[]) {
		if (menuState.debug) {
			label('Database->GetOneAndUpdate');
		}

		const sch = aci?.schema;

		// this.runLCOnProp('checkOn', sch, menuState, out);
		this.runLCOnProp('input', sch, menuState, out);
		this.runLCOnProp('withValues', sch, menuState, out);

		this.processCommon(aci, menuState, out);
	}

	/**
	 * 1. checkOn
	 * 2. input (whereValues)
	 * 3. withValues
	 * ---- common ----
	 * 4. output
	 * 5. onSuccess 
	 */
	public static createIfNotExists(aci: ServiceEACII, menuState: MenuStateInner, out: any[]) {
		if (menuState.debug) {
			label('Database->CreateIfNotExists');
		}

		const sch = aci?.schema;

		// this.runLCOnProp('checkOn', sch, menuState, out);
		this.runLCOnProp('input', sch, menuState, out);
		this.runLCOnProp('withValues', sch, menuState, out);

		this.processCommon(aci, menuState, out);
	}
}

export class ActionFiles extends BaseAction {
	/**
	 * 1. folder
	 * 2. fileName
	 * 3. content
	 * ---- common ----
	 * 4. output
	 * 5. onSuccess 
	 */
	public static save(aci: ServiceEACII, menuState: MenuStateInner, out: any[]) {
		if (menuState.debug) {
			label('Files->Save');
		}

		const sch = aci?.schema;

		this.runLCOnProp('folder', sch, menuState, out);
		this.runLCOnProp('fileName', sch, menuState, out);
		this.runLCOnProp('content', sch, menuState, out);

		this.processCommon(aci, menuState, out);
	}

	/**
	 * 1. folder 
	 * 2. fileName
	 * ---- common ----
	 * 3. output
	 * 4. onSuccess 
	 */
	public static read(aci: ServiceEACII, menuState: MenuStateInner, out: any[]) {
		if (menuState.debug) {
			label('Files->Read');
		}

		const sch = aci?.schema;

		this.runLCOnProp('folder', sch, menuState, out);
		this.runLCOnProp('fileName', sch, menuState, out);

		this.processCommon(aci, menuState, out);
	}

	/**
	 * 1. folder
	 * 2. fileName
	 * ---- common ----
	 * 3. output
	 * 4. onSuccess 
	 */
	public static delete(aci: ServiceEACII, menuState: MenuStateInner, out: any[]) {
		if (menuState.debug) {
			label('Files->Delete');
		}

		const sch = aci?.schema;

		this.runLCOnProp('folder', sch, menuState, out);
		this.runLCOnProp('fileName', sch, menuState, out);

		this.processCommon(aci, menuState, out);
	}
}

export class ActionLogic extends BaseAction {
	/**
	 * 1. 
	 * . output
	 * . onSuccess 
	 */
	public static list(aci: ServiceEACII, menuState: MenuStateInner, out: any[]) {
		if (menuState.debug) {
			label('Logic->List');
		}

		this.processCommon(aci, menuState, out);
	}

	/**
	 * 1. 
	 * . output
	 * . onSuccess 
	 */
	public static dataTransformer(aci: ServiceEACII, menuState: MenuStateInner, out: any[]) {
		if (menuState.debug) {
			label('Logic->DataTransformer');
		}

		this.processCommon(aci, menuState, out);
	}

	/**
	 * 1. 
	 * . output
	 * . onSuccess 
	 */
	public static do(aci: ServiceEACII, menuState: MenuStateInner, out: any[]) {
		if (menuState.debug) {
			label('Logic->Do');
		}

		this.processCommon(aci, menuState, out);
	}

	/**
	 * 1. 
	 * . output
	 * . onSuccess 
	 */
	public static when(aci: ServiceEACII, menuState: MenuStateInner, out: any[]) {
		if (menuState.debug) {
			label('Logic->When');
		}

		this.processCommon(aci, menuState, out);
	}
}

export class ActionEmail extends BaseAction {
	/**
	 * 1. to
	 * 2. from
	 * 3. fromFirstName
	 * 4. fromLastName
	 * 5. subject
	 * 6. template
	 * 7. templateVars
	 * ---- common ----
	 * 8. output
	 * 9. onSuccess 
	 */
	public static sendSmtpEmail(aci: ServiceEACII, menuState: MenuStateInner, out: any[]) {
		if (menuState.debug) {
			label('Email->SendSmtpEmail');
		}

		const sch = aci?.schema;

		this.runLCOnProp('to', sch, menuState, out);
		this.runLCOnProp('from', sch, menuState, out);
		this.runLCOnProp('fromFirstName', sch, menuState, out);
		this.runLCOnProp('fromLastName', sch, menuState, out);
		this.runLCOnProp('subject', sch, menuState, out);
		this.runLCOnProp('template', sch, menuState, out);
		this.runLCOnProp('templateVars', sch, menuState, out);

		this.processCommon(aci, menuState, out);
	}
}

export class ActionResponse extends BaseAction {
	/**
	 * 1. url
	 */
	public static redirect(aci: ServiceEACII, menuState: MenuStateInner, out: any[]) {
		if (menuState.debug) {
			label('Response->Redirect');
		}

		const sch = aci?.schema;

		this.runLCOnProp('url', sch, menuState, out);

		this.processCommon(aci, menuState, out);
	}
}

export class ActionServer extends BaseAction {
	/**
	 * 1. headers
	 * 2. urlParams
	 * 3. requestBody
	 * ---- common ----
	 * 4. output
	 * 5. onSuccess 
	 */
	public static restAction(aci: ServiceEACII, menuState: MenuStateInner, out: any[]) {
		if (menuState.debug) {
			label('Server->RestAction');
		}

		const sch = aci?.schema;

		this.runLCOnProp('headers', sch, menuState, out);
		this.runLCOnProp('urlParams', sch, menuState, out);
		this.runLCOnProp('requestBody', sch, menuState, out);

		this.processCommon(aci, menuState, out);
	}

	/**
	 * 1. urlParams
	 * 2. requestBody
	 * ---- common ----
	 * 3. output
	 * 4. onSuccess 
	 */
	public static socketAction(aci: ServiceEACII, menuState: MenuStateInner, out: any[]) {
		if (menuState.debug) {
			label('Server->SocketAction');
		}

		const sch = aci?.schema;

		this.runLCOnProp('urlParams', sch, menuState, out);
		this.runLCOnProp('requestBody', sch, menuState, out);
		
		this.processCommon(aci, menuState, out);
	}
}

export class ActionMisc extends BaseAction {
	/**
	 * 1. templateVars 
	 * ---- common ----
	 * 2. output
	 * 3. onSuccess 
	 */
	public static renderTemplate(aci: ServiceEACII, menuState: MenuStateInner, out: any[]) {
		if (menuState.debug) {
			label('Misc->RenderTemplate');
		}

		this.runLCOnProp('templateVars', aci?.schema, menuState, out);

		this.processCommon(aci, menuState, out);
	}

	/**
	 * 1. command
	 * 2. rootFolder
	 * ---- common ----
	 * 3. output
	 * 4. onSuccess 
	 */
	public static command(aci: ServiceEACII, menuState: MenuStateInner, out: any[]) {
		if (menuState.debug) {
			label('Misc->Command');
		}

		const sch = aci?.schema;

		this.runLCOnProp('command', sch, menuState, out);
		this.runLCOnProp('rootFolder', sch, menuState, out);

		this.processCommon(aci, menuState, out);
	}

	/**
	 * 1. actionListSource
	 * 2. headers
	 * 3. urlParams
	 * 4. requestBody
	 * ---- common ----
	 * 5. output
	 * 6. onSuccess 
	 */
	public static serviceCaller(aci: ServiceEACII, menuState: MenuStateInner, out: any[]) {
		if (menuState.debug) {
			label('Misc->ServiceCaller');
		}

		const sch = aci?.schema;

		this.runLCOnProp('actionListSource', sch, menuState, out);
		this.runLCOnProp('headers', sch, menuState, out);
		this.runLCOnProp('urlParams', sch, menuState, out);
		this.runLCOnProp('requestBody', sch, menuState, out);

		this.processCommon(aci, menuState, out);
	}

	/**
	 * 1.output
	 */
	public static success(aci: ServiceEACII, menuState: MenuStateInner, out: any[]) {
		if (menuState.debug) {
			label('Misc->Success');
		}

		this.runLCOnProp('output', aci?.schema, menuState, out);

		this.processCommon(aci, menuState, out);
	}

	/**
	 * 1. output
	 */
	public static error(aci: ServiceEACII, menuState: MenuStateInner, out: any[]) {
		if (menuState.debug) {
			label('Misc->Error');
		}

		this.runLCOnProp('output', aci?.schema, menuState, out);

		this.processCommon(aci, menuState, out);
	}
}