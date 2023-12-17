import { exec } from 'child_process';

export function eexec (command: string) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
console.log(stdout, stderr);
            // git operations throw a command failed when there's nothing to commit?!
            if (error && !(/On branch master/.test(stdout)) ) {
                resolve({
                    success: false,
                    error: error.message,
                });
                return;
            }

            // npm, debugger, git, curl, git push new branch
            if (stderr && !(/npm WARN/.test(stderr) || /Debugger attached/.test(stderr) || /hint/.test(stderr) || /% Total/.test(stderr) || /[new branch]/.test(stderr)) ) {
                resolve({
                    success: false,
                    error: stderr,
                });
                return;
            }

            resolve({
                success: true,
                stdout,
            });
        });
    });
}

export async function checkPort (port: number) {
    try {
        // @Ryan - Bug - This won't work on windows or mac. This needs to be cross platform
        const res = await eexec(`lsof -i :${port}`) as string;

        let out: any = [], headers: string[];

        res.split('\n').filter((line: string) => {
            if (line == '') return;

            line = line.replace(/[ ]+/g, ' ');

            if (!headers) {
                headers = line.split(' ');
                return;
            }

            const map: any = {};

            line.split(' ').map((element: string, index: number) => {
                map[headers[index]] = element;
            });

            out.push(map);
            // console.log(`Line: ${out.length} Elements: ${out[out.length - 1].length}`);
        });

        return out;
    }
    catch (e) {
        throw `Command->checkPort - Error: Could not check port. "${e.message}"`;
    }
}