const kafkaClient  = require('./KafkaClient');

const MQTT         = require('async-mqtt');
const CoreChannel  = require('darwin-translator-sdk/lib/CoreChannel.js');
const Configurator = require('darwin-translator-sdk/lib/Configurator.js');
const { Logger }   = require('darwin-translator-sdk/utils/Logger.js');

const utils        = require('./utils');

const logger = Logger('Translator');

class Translator {
    constructor({ translatorId, mqttEndpoint} = {}) {
        if (!translatorId) throw new Error('translatorId is required!');
        if (!mqttEndpoint) throw new Error('mqttEndpoint is required!');

        this.translatorId = translatorId;
        this.mqttEndpoint = mqttEndpoint;
    }

    async start() {
        try {
            const mqttClient = MQTT.connect(this.mqttEndpoint);

            await utils.waitForEvent(mqttClient, 'connect');

            this.coreChannel = new CoreChannel({
                mqttClient,
                translatorId : this.translatorId
            });

            await this.coreChannel.init();



            this.coreChannel.onNVAMessage(this._processCoreNVAMessage.bind(this));
        } catch (e) {
            throw new Error(e);
        }
    }

    async _processCoreNVAMessage({ nva }) {
        logger.debug('MESSAGE FROM CORE', nva);

        // Here your code
        // Do what's needed with payload
        // map to thing methods etc.
    }

    async _processThingMessage(message) {
        logger.debug('MESSAGE FROM THING', message);

        /*
            You can communicate with core or services via channels
            from darwin-translator-sdk by calling relevant methods of each one.
            For example:

            - if you send json nva:
                const coreResponse = await this.coreChannel.executeNVA({ nva: [ nva ], sourceTranslator: this.translatorId });
            - if you send string nva:
                const coreResponse = await this.coreChannel.executeNVA({ nva, sourceTranslator: this.translatorId  });
        */

        // Some logic to process thing message here
    }
}

module.exports = Translator;
