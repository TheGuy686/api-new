import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { StringArray, String, Int, Json } from '@eezze/decorators/models/types';


@EActionInput()
export default class PublishServGroupInput extends BaseActionInput {
	@Int({
		input: (adm: ActionDataManager) => adm.request.auth?.user?.id,
		message: 'PublishServGroup "createdBy" was not set',
	})
	createdBy: number;

	@String({
		input: (adm: ActionDataManager) => adm.request.requestBody?.projectId,
		message: 'PublishServGroup "projectId" was not set',
	})
	projectId: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.scope,
		validate: (value) =>  [ 'internal', 'store' ].includes(value),
		message: 'PublishServGroup "scope" was not a valid scope, Expected "internal, store"',
	})
	scope: string;

	@StringArray({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.serviceGroups,
		message: 'PublishServGroup "serviceGroups" was not set',
	})
	serviceGroups: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.form?.name,
		message: 'PublishServGroup "name" was not set',
	})
	name: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.form?.description,
		message: 'PublishServGroup "description" was not set',
	})
	description: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.form?.shortFunction,
		message: 'PublishServGroup "shortFunction" was not set',
	})
	shortFunction: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.form?.sgFunction,
		message: 'PublishServGroup "sgFunction" was not set',
	})
	sgFunction: string;

	@String({
		input: (adm: ActionDataManager) => adm.request.requestBody?.form?.category,
		message: 'PublishServGroup "category" was not set',
	})
	category: string;

	@String({
		input: (adm: ActionDataManager) => adm.request.requestBody?.form?.subcategoryIns ?? adm.request.requestBody?.form?.subcategory,
		message: 'PublishServGroup "subcategory" was not set',
	})
	subcategory: string;

	@Json({
		input: (adm: ActionDataManager) => adm.request.requestBody?.overrides,
		message: 'PublishServGroup "overrides" was not set',
	})
	overrides: string;

	@String({
		input: (adm: ActionDataManager) => (adm.request.requestBody?.form?.tags ?? '').replace(/,/g, ' '),
		message: 'PublishServGroup "tags" was not set',
	})
	tags: string;

	// @String({
	// 	input: (adm: ActionDataManager) => adm.request.requestBody?.categoryThree,
	// 	message: 'PublishServGroup "categoryThree" was not set',
	// })
	// categoryThree: string;

	// @String({
	// 	input: (adm: ActionDataManager) => adm.request.requestBody?.categoryFour,
	// 	message: 'PublishServGroup "categoryFour" was not set',
	// })
	// categoryFour: string;

	// @String({
	// 	input: (adm: ActionDataManager) => adm.request.requestBody?.categoryFive,
	// 	message: 'PublishServGroup "categoryFive" was not set',
	// })
	// categoryFive: string;

	// @String({
	// 	input: (adm: ActionDataManager) => adm.request.requestBody?.categorySix,
	// 	message: 'PublishServGroup "categorySix" was not set',
	// })
	// categorySix: string;
}
