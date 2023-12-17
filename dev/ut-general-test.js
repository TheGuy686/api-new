const Request = require('../dist/plugins/eezze/classes/Request').default;

(() => {

    setInterval(async () => {
        console.clear();

        const res = await Request.get(`http://localhost:2002/v1/log/test`);

        console.log('Res: ', res);
    }, 1500);

})();