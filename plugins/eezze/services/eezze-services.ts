import { Request } from '../classes';

export default class EezzeServices {
    static async doStateUpdate(connection: number | string, state: string, token: string) {
        try {
            const res: any = await Request.put(
                `${process.env.EEZZE_HOST}/v1/connection/state`,
                {
                    id: connection,
                    state,
                },
                null,

                // { authorization: token }
            );
        }
        catch (err) {
            console.log(`doStateUpdate->Error: `, err);
        }
    }
}