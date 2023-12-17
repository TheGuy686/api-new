// nodemon -e js,ts --exec 'node ./plugins/eezze/services/stats-service.js' 
console.clear();

const { decompress } = require('shrink-string');
const { execFile } = require('node:child_process');

const child = execFile('node', [__dirname + '/get-system-info.js'], async (error, stdout, stderr) => {
    if (error) {
      throw error;
    }
    console.log('OUTSIDE HERE: ', stdout.length);
});

let counter = 0;

// const service = createService('get-system-info.js');

setInterval(() => {

    counter++;

    console.log('Getting to here: ', counter);

}, 800);

console.log('hello there');
