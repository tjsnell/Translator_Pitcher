const { Logger }   = require('darwin-translator-sdk/utils/Logger.js');


const logger = Logger('Translator');

class ThingClient {
    constructor(args) {
        logger.debug('Instance of ThingClient created with args', args);
    }

    async init() {
        // Initiate your client here, make connection, etc.
        logger.debug('ThingClient initialized successfully');
    }

    _send(payload) {
        // implement method to use it everywhere to interact with your thing
        logger.debug('THING CLIENT SEND', payload);
    }

    onMessage(handler) {
        // add you handler
        // or use you own approach
        // of handling messages
    }
}

module.exports = ThingClient;
