import { EConnection } from '@eezze/decorators';

@EConnection({
    id: 1,
    types: [ 'installable-services' ],
    //alias: 'eezze.io',
    // here we need to have the authentication as a metadata type of input with variable inputs
    // meaning can need to have an interface which is key values etc or one interface with loads of variable inputs
    // and then we need to do validation based on the type of input
    // port: 8080,
    // host: '25.5.5.54'
})
export default class ServerDefaultConnection {}