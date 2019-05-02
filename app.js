require('dotenv').config()
const utils = require('./lib/utils');
const Translator = require('./lib/Translator.js');
const { translatorId, storagePath, mqttEndpoint } = require('./etc/processEnvConfig.js');
const { Logger }   = require('darwin-translator-sdk/utils/Logger.js');


const logger = Logger('Translator');

async function main() {

    const translator = new Translator({
        translatorId,
        mqttEndpoint
    });

    logger.info(`STARTING THING TRANSLATOR ${translatorId}`);
    await translator.start();
    logger.info(`STARTED THING TRANSLATOR ${translatorId}`);
}

main().catch(e => logger.error(e));
