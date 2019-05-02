module.exports = {
    translatorId : process.env.TRANSLATOR_ID || 'Transaction_Translator',
    storagePath  : process.env.STORAGE_PATH || 'etc/',
    mqttEndpoint : process.env.MQTT_ENDPOINT || 'tcp://localhost:1883'

};
