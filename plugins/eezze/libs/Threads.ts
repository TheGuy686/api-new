import { isPromise } from './ObjectMethods';

const { execFile } = require('node:child_process');

export function createService(file: string) {
    return {
        run: (cb: (result?: any, err?: any, error?: any) => any) => {
            execFile('node', [ file ], { shell: true }, async (error: any, stdout: any, stderr: any) => {
                try {
                    if (isPromise(cb)) {
                        await cb(stdout, stderr);

                        return true;
                    }
                    else {
                        cb(stdout, stderr);
                        return true;
                    }
                }
                catch (err) {
                    console.log(`"createService->run()->Error: ${err.message}`, err);
                    return false;
                }
            });
        }
    }
}