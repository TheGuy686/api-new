import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import EJson from '@eezze/classes/logic/json';
import { EActionInput } from '@eezze/decorators';
import { Emails,  String, Json } from '@eezze/decorators/models/types';

interface EMAIL_VAR_PAIRSI {[key: string]: any;}

@EActionInput()
export default class SendMailActionInput extends BaseActionInput {
	@Emails({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.to,
	})
	protected to: string[];

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.from,
	})
	protected from: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.fromFirstName,
	})
	protected fromFirstName: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.fromLastName,
	})
	protected fromLastName: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.subject,
	})
	protected subject: string;

	@String({
		input: (adm: ActionDataManager) => adm.request.requestBody?.body,
	})
	protected body: string;

	@String({
		input: (adm: ActionDataManager) => adm.request.requestBody?.template,
	})
	protected template: string;

	@Json({
		input: (adm: ActionDataManager) => adm.request.requestBody?.templateVars,
	})
	protected templateVars: EMAIL_VAR_PAIRSI;
}