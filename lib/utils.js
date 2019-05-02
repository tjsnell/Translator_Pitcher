const fs = require('fs')
const util = require('util')
const path = require('path')

const LIVR = require('livr') // if you don`t need config, you can remove this require
const {Logger} = require('darwin-translator-sdk/utils/Logger.js')

const {storagePath} = require('../etc/processEnvConfig.js') // if you don`t need config, you can remove this require


const logger = Logger('Translator')

function waitForEvent(emitter, eventName) {
    return new Promise((resolve) => {
        emitter.on(eventName, resolve)
    })
}


// json utils
function parse(jsonString) {
    try {
        return JSON.parse(jsonString)
    } catch (e) {
        return null
    }
}

function stringify(obj) {
    return typeof obj === 'string' ? obj : JSON.stringify(obj)
}

// json utils end



async function exists(filePath) {
    return new Promise(res => {
        fs.access(filePath, fs.constants.F_OK, (err) => {
            return err ? res(false) : res(true)
        })
    })
}

async function loadOrCreateConfig(configStoragePath = storagePath, encoding = 'utf8') {
    const remoteConfigPath = path.join(configStoragePath, 'config.json')
    const fileExists = await exists(remoteConfigPath)
    let schema

    if (fileExists) {
        try {
            const file = await readFile(remoteConfigPath, encoding)
            const configValidated = await validateConfig(file, schema)

            if (configValidated && !configValidated.error) {
                return {
                    translatorConfig: JSON.parse(file),
                    schema: JSON.parse(schema)
                }
            }
        } catch (e) {
            logger.error('Can\'t read file: ', e)
        }
    }

    const localConfigPath = path.join('etc', 'config.json')
    const localConfig = await readFile(localConfigPath, encoding)
    const localConfigValidated = await validateConfig(localConfig, schema)

    if (localConfigValidated && !localConfigValidated.error) {
        await writeFile(remoteConfigPath, localConfig)
        return {
            translatorConfig: JSON.parse(localConfig),
            schema: JSON.parse(schema)
        }
    }

    return null
}

function setField(path = "", data, obj = {}) {
    let objToSet = JSON.parse(JSON.stringify(obj))

    if (!objToSet) objToSet = {}

    const pathArr = path.split('.')
    const field = pathArr[0]
    const newPath = pathArr.slice(1).join('.')

    if (newPath.length > 0) {
        objToSet[field] = setField(newPath, data, objToSet[field])
    } else {
        objToSet[field] = data
    }

    return objToSet
}

function getConfigShapedSchema(schema, pathField, dataField, dataModifier = (data) => data) {
    const fields = schema.fields

    return fields
        ? fields.reduce((schemaResult, field) => {
            const path = field[pathField]
            const data = dataModifier(field[dataField])

            return setField(path, data, schemaResult)
        }, null)
        : null
}


function convertToLIVRValidations(data = {}) {
    const livrValidations = []

    for (const validator in data) {
        if (!data.hasOwnProperty(validator)) continue

        if (data[validator] && typeof data[validator] === 'boolean') {
            livrValidations.push(validator)
        } else if (data[validator]) {
            livrValidations.push({[validator]: data[validator]})
        }
    }

    return livrValidations
}

function getLIVRSchema(schema = {}) {
    let newSchema = null
    let isFieldRequired = false

    for (let key in schema) {
        if (!schema.hasOwnProperty(key)) continue

        const value = schema[key]

        if (Array.isArray(value)) {
            isFieldRequired = value.includes('required') || isFieldRequired
            newSchema = {...newSchema, [key]: value}
        } else {
            const {livrSchema, isDataRequired} = getLIVRSchema(value)
            const livrSchemaToSet = isDataRequired
                ? {[key]: ["required", {"nested_object": livrSchema}]}
                : {[key]: {"nested_object": livrSchema}}

            newSchema = {...newSchema, ...livrSchemaToSet}
            isFieldRequired = isDataRequired
        }
    }

    return {livrSchema: newSchema, isDataRequired: isFieldRequired}
}


async function saveConfig(config) {
    /*
        This method should return the result of saving config: { result: 'Some_result' } or { error: 'Error' }.
        You can make your own implementation here or use implemented "save" function:
     */
    return save(config, storagePath, 'config.json')
}

async function validateConfig(config, schema) {
    /*
        This method should return the result of validating config: { result: 'Some_result' } or { error: 'Error' }.
        You can make your own validator here or use "validateWithLIVR":
     */
    return validateWithLIVR(config, schema, 'configKeyPath', 'validation')
}

function validateWithLIVR(config, schema, pathField = 'configKeyPath', validationField = 'validation') {
    const parsedConfig = parse(config) || config
    const parsedSchema = parse(schema) || schema
    const configShapedSchema = getConfigShapedSchema(parsedSchema, pathField, validationField, convertToLIVRValidations)
    const {livrSchema} = getLIVRSchema(configShapedSchema)

    const validator = new LIVR.Validator(livrSchema)
    const validatedConfig = validator.validate(parsedConfig)

    if (validatedConfig) {
        logger.info('Config validated');
        return {result: validatedConfig}
    }

    const validationErrors = validator.getErrors();

    logger.error(`Config validation fails: ${JSON.stringify(validationErrors)}`);

    return {error: validationErrors}
}

async function save(file, configStoragePath = storagePath, fileName = 'config.json') {
    const filePath = path.join(configStoragePath, fileName)
    const parsedFile = parse(file)
    const isJson = Boolean(parsedFile)
    const jsonData = isJson ? file : stringify(file)

    try {
        await writeFile(filePath, jsonData, 'utf-8');

        logger.info('Config was successfully saved')

        return { result: 'Config was successfully saved' }
    } catch (err) {
        logger.error(`Can\'t save config: ${err}`);

        return { error: 'Can\'t save config' }
    }
}

// config utils end


module.exports = {
    waitForEvent,
    loadOrCreateConfig, // if you don`t need config, remove this line
    validateConfig, // if you don`t need config, remove this line
    saveConfig // if you don`t need config, remove this line
}
