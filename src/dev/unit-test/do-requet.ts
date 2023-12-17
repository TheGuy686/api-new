require('../../../plugins/eezze/init-app');

import Request from '@eezze/classes/Request';

type METHOD = 'get' | 'put' | 'post' | 'delete';

// let idToken = 'ewogICAgImFsZyI6ICJIUzI1NiIsCiAgICAidHlwIjogIkpXVCIKfQ.ewogICAgInNpZ25hdHVyZSI6IHsKICAgICAgICAid29yZHMiOiBbCiAgICAgICAgICAgIC0yMTM3MDY1NjcxLAogICAgICAgICAgICAtMTY0NjM2ODc4LAogICAgICAgICAgICAtNjcxOTAxMzU5LAogICAgICAgICAgICAyMTIwMTQ2MTIzLAogICAgICAgICAgICAyMTE1MzE2NzIxLAogICAgICAgICAgICAtNzA4MTkyNCwKICAgICAgICAgICAgLTE3OTcyOTk4NDIsCiAgICAgICAgICAgIC00NDc2Nzk4MjAKICAgICAgICBdLAogICAgICAgICJzaWdCeXRlcyI6IDMyCiAgICB9LAogICAgInVzZXJJZCI6IDE0NiwKICAgICJmaXJzdE5hbWUiOiAiSm9zZXBoIiwKICAgICJsYXN0TmFtZSI6ICJDb29rZSIsCiAgICAidXNlcm5hbWUiOiAiVGhlR3V5NjgiLAogICAgImVtYWlsIjogInJ5YW5qY29va2VAaG90bWFpbC5jb20iLAogICAgImVtYWlsVmVyaWZpZWQiOiAxLAogICAgImlzcyI6ICJodHRwOi8vbG9jYWxob3N0OjMwMDEiLAogICAgImlhdCI6IDE2MzQ2NDc1NTU2MjQsCiAgICAiZXhwIjogOTAwMDAwLAogICAgImV4cEF0IjogMTYzNDY0ODQ1NTYyNAp9.qZeZx42oZyyhG8-3p4eUC3a1NW24HD631OHVjPPp9RE';
const idToken = 'eyJzaWciOiIxN2MwNTM1NWM5NzM3ZGNhZjg2MTVkN2Q3OTJlYTk2ZGI2N2MyMzIwMTQ0OGYzNDhjNzEwZTRkYTY0MTQ1NTZmIiwiYWxnIjoiSFMyNTYiLCJ0eXAiOiJKV1QiLCJ0eXBlIjoiOWZkOTliNTBhNmE5OThiNWFmMzMyOTUwYzlkY2Q3NGY5YTYyY2IwMWQ3ZTRjZmE4MGU2NGIwMWY2MTdlMmY3MyJ9.eyJwYXlsb2FkIjp7InVzZXJJZCI6MTQ3LCJmaXJzdE5hbWUiOiJKb2UiLCJsYXN0TmFtZSI6IkJsb2dzIiwidXNlcm5hbWUiOiJSeWFuQ29va2UiLCJlbWFpbCI6InJ5YW5qY29va2VAaG90bWFpbC5jb20iLCJlbWFpbFZlcmlmaWVkIjoxLCJyb2xlcyI6IltcIlJPTEVfVVNFUlwiXSJ9LCJzaWduYXR1cmUiOiIxN2MwNTM1NWM5NzM3ZGNhZjg2MTVkN2Q3OTJlYTk2ZGI2N2MyMzIwMTQ0OGYzNDhjNzEwZTRkYTY0MTQ1NTZmIiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDozMDAxIiwiaWF0IjoxNjM0OTA5MjAyMTUyLCJleHAiOjkwMDAwMCwiZXhwQXQiOjE2MzQ5MTAxMDIxNTJ9.ps-AP43_A95BwZLgOLo0RlPCHG9JPXtflIn41nO8cpc';
const refreshToken = 'eyJzaWciOiIzYjQ5YWVjYmI1NDFjM2NlODE0MGY3NzEzYTBmMGNlZGIwY2I3YWZkODM3ZTljYjE5Y2VlZTYwNTJiZTU5MmEwIiwiYWxnIjoiSFMyNTYiLCJ0eXAiOiJKV1QiLCJ0eXBlIjoiYzQ0ZTcwNzM5YzgyOTFlMzY0MjIxMGQwNmU0M2IyMDJlMTUyYTg2NjRhYWI3NjUzMDc1NmQ1NWM1OTJjZmUyZSJ9.eyJwYXlsb2FkIjp7InVzZXJJZCI6MTQ3LCJmaXJzdE5hbWUiOiJKb2UiLCJsYXN0TmFtZSI6IkJsb2dzIiwidXNlcm5hbWUiOiJSeWFuQ29va2UiLCJlbWFpbCI6InJ5YW5qY29va2VAaG90bWFpbC5jb20iLCJlbWFpbFZlcmlmaWVkIjoxLCJyb2xlcyI6IltcIlJPTEVfVVNFUlwiXSJ9LCJzaWduYXR1cmUiOiIzYjQ5YWVjYmI1NDFjM2NlODE0MGY3NzEzYTBmMGNlZGIwY2I3YWZkODM3ZTljYjE5Y2VlZTYwNTJiZTU5MmEwIiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDozMDAxIiwiaWF0IjoxNjM2NzM2OTc3Nzc4LCJleHAiOjYwNDgwMDAwMCwiZXhwQXQiOjE2MzczNDE3Nzc3Nzh9.KOctxUSJ8Ku8GqEs_JgSUdwQrUoad87FJTreXXnKCOU';

const apiVersion = 1.0, host = 'http://localhost:2000';

async function e(method: METHOD, path: string, params: any = {}, headers: any = {}) {
    const results: any = await Request[method](path, params, undefined, headers);

    console.log(' ----------------------------------------------- ');
    console.log('         ');
    console.log('METHOD: ', method);
    console.log('PATH: ', path);
    console.log('RESULTS: ', results.toObject());

    console.log(' ------------------------ \n\n\n');

    return results;
}

function authHeaders(token: string) {
    return {Authorization: token};
}

(async () => {
    console.clear();

    await new Promise((resolve) => setTimeout(resolve, 1500));

    let res;

    res = await e('post', `${host}/v${apiVersion}/auth/login`, {
        email: 'ryanjcooke@hotmail.com',
        password: 'Password!23!*$%^',
    });

    const authHeads = authHeaders(res.toObject().idToken);

    // res = await e('post', `${host}/v${apiVersion}/auth/register`, {
    //     email: `2ryanjoseph@hotmail.com`,
    //     username: 'TheGuy682',
    //     firstName: 'Joseph',
    //     lastName: 'Cooke',
    //     password: 'Password!23!*',
    // });

    res = await e('put', `${host}/v${apiVersion}/auth/token`, {
        refreshToken,
    });

    // if (!(res?.status > 199 && res?.status < 300)) {
    //     console.error(`\n\n\n   There was an error and couldn't retrieve a new login token\n\n\n`);
    //     return;
    // }


    // let authHeaders = {Authorization: idToken};

    // res = await e('get', `${host}/v${apiVersion}/auth/users?userId=146`, {}, authHeaders);

    // if (!res.success) {
    //     console.log('Registration failed');
    //     return;
    // }

    // await e('get', `${host}/v${apiVersion}/auth/user`, {}, {Authorization: res.toObject().idToken});

    // await e('get', `${host}/v${apiVersion}/auth/users`, {}, authHeads);

    // await e('put', `${host}/v${apiVersion}/auth/user`, {
    //     userId: '146',
    //     firstName: 'Some',
    //     lastName: 'Idiot',
    // }, authHeaders);

    // await e('delete', `${host}/v${apiVersion}/auth/user`, {}, authHeaders);

    // REGISTER
    // await e('post', `${host}/v${apiVersion}/auth/register`, {
    //     email: `ryanjoseph${Math.floor(Math.random() * 400)}@gmail.com`,
    //     username: 'TheGuy' + (Math.floor(Math.random() * 400)),
    //     firstName: 'Joseph',
    //     lastName: 'Cooke',
    //     password: 'Password!23!*',
    // });

    // await e('put', `${host}/v${apiVersion}/auth/user`, {
    //     userId: '146',
    //     email: `ryanjcooke@hotmail.com`,
    //     username: 'TheGuy',
    //     firstName: 'Joseph',
    //     lastName: 'Cooke',
    //     password: 'Password!23!*',
    // });

    // await e('post', `${host}/v${apiVersion}/send-mail`, {
    //     to:['ryanjcooke@hotmail.com'],
    //     from: 'ryan@multithreadlabs.io',
    //     subject: 'This is a test subject',
    //     template: 'veryify-account',
    //     templateVars: {
    //         token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjkyLCJpYXQiOjE2MzQyMDY3MDgsImV4cCI6MTYzNDIxMDMwOH0.pWjaSx7goWl2D6UvNRg3oHkFZOxvqRALEmM_M1gHtmk'
    //     },
    // });

    const extra = '';
    const token = 'ewogICAgInNpZyI6ICI2MTdiMTJkMTU0MWNkZWNiYjkxM2U0YTFlY2RhY2RhMzM3ZDg4ZmFhZGNmNDczNzNiM2NkM2ZkODYwMmM2Mzg2IiwKICAgICJhbGciOiAiSFMyNTYiLAogICAgInR5cCI6ICJKV1QiCn0.ewogICAgInBheWxvYWQiOiB7CiAgICAgICAgInVzZXJJZCI6IDE0NwogICAgfSwKICAgICJzaWduYXR1cmUiOiAiNjE3YjEyZDE1NDFjZGVjYmI5MTNlNGExZWNkYWNkYTMzN2Q4OGZhYWRjZjQ3MzczYjNjZDNmZDg2MDJjNjM4NiIsCiAgICAiaXNzIjogImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMSIsCiAgICAiaWF0IjogMTYzNDg5NjAxOTg0NQp9.3X-tSRxwyMWSxp3RQyj4BI_7_Ivxuf-UL9phlOy_o-M' + extra
    // let refreshToken = 'ewogICAgImFsZyI6ICJIUzI1NiIsCiAgICAidHlwIjogIkpXVCIKfQ.ewogICAgInVzZXJJZCI6IDE0NiwKICAgICJmaXJzdE5hbWUiOiAiSm9zZXBoIiwKICAgICJsYXN0TmFtZSI6ICJDb29rZSIsCiAgICAidXNlcm5hbWUiOiAiVGhlR3V5NjgiLAogICAgImVtYWlsIjogInJ5YW5qY29va2VAaG90bWFpbC5jb20iLAogICAgImVtYWlsVmVyaWZpZWQiOiAxLAogICAgImlzcyI6ICJodHRwOi8vbG9jYWxob3N0OjMwMDEiLAogICAgImlhdCI6IDE2MzQ1OTU5Mzk4NTksCiAgICAiZXhwIjogOTAwMDAwLAogICAgImV4cEF0IjogMTYzNDU5NjgzOTg1OQp9._PBazUN3AM44NeMNIeu9VFADKAg1Ti4RyTSZ_MSRWL0';

    // await e('get', `${host}/v${apiVersion}/auth/verify-email?token=` + token);

//     await e('put', `${host}/v${apiVersion}/auth/forgot-password`, {
//         email: 'ryanjcooke@hotmail.com',
//     });
// return
    // await e('post', `${host}/v${apiVersion}/auth/send-verify-account-email`, {
    //     email: 'ryanjcooke@hotmail.com',
    // });

    const resetPasswordToken = 'eyJzaWciOiJlMGM5MDFkMGYzMWZlYjEyM2U3OTI0YWNkODM1NTk2OTRkODkyYzMyNWM4YmNlNGJhNWVlZDY2NDg4MDNlNGU1IiwiYWxnIjoiSFMyNTYiLCJ0eXAiOiJKV1QiLCJ0eXBlIjoiMDA0ODc1NDRiNDlhZjNjMTlkNGM2OTVlM2Y2YmJkMTZlYTg3ZTU5MTVlM2I2NGMzNDZjMDUyNzg1NmI0Y2VmOSJ9.eyJwYXlsb2FkIjp7InVzZXJJZCI6MTQ3fSwic2lnbmF0dXJlIjoiZTBjOTAxZDBmMzFmZWIxMjNlNzkyNGFjZDgzNTU5Njk0ZDg5MmMzMjVjOGJjZTRiYTVlZWQ2NjQ4ODAzZTRlNSIsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMSIsImlhdCI6MTYzNDkwODg2MzEyMCwiZXhwIjozMDAwMDAsImV4cEF0IjoxNjM0OTA5MTYzMTIwfQ.x14ZKbXDj4CRiNQlw0NILWIV9OX-FawIKuaAGFUDbR4';

    // await e('put', `${host}/v${apiVersion}/auth/reset-password`, {
    //     token: resetPasswordToken,
    //     password: 'Password!23!*$%^',
    //     passwordConfirm: 'Password!23!*$%^',
    // }, authHeaders(token));

    // await e('get', `${host}/v${apiVersion}/gmail/get-auth-url`);
    // await e('get', `${host}/v${apiVersion}/gmail/get-auth-tokens?code=4/0AX4XfWiDHJDEsYJVQKOwFYg2MFLxEFqhrFHelq2RkzoNwsPfd81bN2PXKzKn2s70Tx8Ryw`);

    // await e('post', `${host}/v${apiVersion}/gmail/send-mail`, {
    //     to:[
    //         'ryanjcooke@hotmail.com',
    //         'ryanjcooke@hotmail.com',
    //         'ryanjcooke@hotmail.com',
    //     ],
    //     // from: 'ryan@multithreadlabs.io',
    //     from: 'ryanjosephwesley@gmail.com',
    //     subject: 'This is a test subject',
    //     body: `
    //         This is just a test body of text which I will try to send.
    //         <a href="https://google.com"></a>
    //     `
    // });

    // await e('get', `${host}/v${apiVersion}/role/all`);
    // await e('get', `${host}/v${apiVersion}/role?roleId=role-ryan`);
    // await e('delete', `${host}/v${apiVersion}/role?roleId=role-ryan`);
    // await e('post', `${host}/v${apiVersion}/role`, {
    //     key: 'role-new',
    //     roleId: 'role-new',
    //     role: 'ROLE_NEW',
    // });

    // await e('put', `${host}/v${apiVersion}/role`, {
    //     key: 'role-new',
    //     roleId: 'role-new',
    //     role: 'ROLE_NEW2',
    // });

    // await e('put', `${host}/v${apiVersion}/generate/controller/all`, {});

    // await e('put', `${host}/v${apiVersion}/generate/controller`, {
    //     "serviceId": "express-authentication",
    //     "restful": [
    //         {
    //             "urlParams": [],
    //             "name": "Retrieve Auth User",
    //             "description": "This is an example of how to get an authenticated user",
    //             "method": "get",
    //             "path": "/user",
    //             "operationId": "retrieveAuthUser",
    //             "requestBody": ""
    //         },
    //         {
    //             "urlParams": [
    //                 {
    //                     "required": true,
    //                     "relation": "url-parameter-email-verify-token"
    //                 }
    //             ],
    //             "name": "Verify Email",
    //             "description": "This endpoint will verify the users email",
    //             "method": "get",
    //             "path": "/auth/verify-email",
    //             "operationId": "verifyEmail",
    //             "requestBody": ""
    //         },
    //         {
    //             "name": "Login",
    //             "description": "This is a login example",
    //             "method": "post",
    //             "path": "/login",
    //             "operationId": "login",
    //             "requestBody": "request-body-login",
    //             "urlParams": []
    //         },
    //         {
    //             "name": "Register",
    //             "description": "This is a simple example of how to register with express",
    //             "method": "post",
    //             "path": "/register",
    //             "operationId": "postRegister",
    //             "urlParams": [],
    //             "requestBody": "request-body-register"
    //         },
    //         {
    //             "name": "Refresh Token",
    //             "description": "This is an example of how to refresh a login token with express",
    //             "method": "put",
    //             "path": "/auth/token",
    //             "operationId": "refreshToken",
    //             "requestBody": "request-body-refresh-token",
    //             "urlParams": []
    //         },
    //         {
    //             "name": "Forgot Password",
    //             "description": "This endpoint will send and email to the given email which will have a link that will reset the password",
    //             "method": "put",
    //             "path": "/auth/forgot-password",
    //             "operationId": "forgotPassword",
    //             "requestBody": "request-body-forgot-password",
    //             "urlParams": []
    //         },
    //         {
    //             "name": "Refresh Password",
    //             "description": "This endpoint will reset a user password",
    //             "method": "put",
    //             "path": "/auth/reset-password",
    //             "operationId": "refreshPassword",
    //             "requestBody": "request-body-reset-password",
    //             "urlParams": []
    //         },
    //         {
    //             "name": "Remove Auth User",
    //             "description": "This is an example of how to delete a user account",
    //             "method": "delete",
    //             "path": "/auth/user",
    //             "operationId": "removeAuthUser",
    //             "requestBody": "",
    //             "urlParams": [
    //                 {
    //                     "required": false,
    //                     "relation": "url-parameter-user-id"
    //                 }
    //             ]
    //         }
    //     ],
    //     "ws": {}
    // });

    // await e('post', `${host}/v${apiVersion}/project`, {
    //     projectId: 'eezze-test',
    //     name: 'Eezze Rest Api',
    //     description: 'This is the main API that will take care of all the authentication and basic controls over the clients projects',
    //     industry: 'SASS',
    // }, authHeads);

    await e('post', `${host}/v${apiVersion}/project/dev/boot-gen-server`, {
        projectId: 'eezze-test',
    }, authHeads);

})();