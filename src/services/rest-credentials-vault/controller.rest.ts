import { RestController } from '@eezze/base';
import { EController, EGet, EPost, EPut, EDelete } from '@eezze/decorators';

@EController({
	server: 'eezze-project-api',
})
export default class RestCredentialsVaultController extends RestController {
	@EGet({ path: '/credentials-vault' }) static async readCredentialsVault() {}

	@EGet({ path: '/credentials-vault/all' }) static async readAllCredentialsVaults() {}

	@EPost({ path: '/credentials-vault' }) static async createCredentialsVault() {}

	@EPut({ path: '/credentials-vault' }) static async updateCredentialsVault() {}

	@EDelete({ path: '/credentials-vault' }) static async deleteCredentialsVault() {}
}
