# Thing translator template

## Run Thing Template Translator on local machine in development mode

1. Development environment

    1.1. Ubuntu Linux or OSX

    1.2. NodeJS LTS >=10.7.0

    1.3. npm version >=6.1.0

2. Install dependencies and start in development mode

    ```bash
    npm install
    npm run nodemon
    ```

3. Edit processEnvConfig.js and set there TRANSLATOR_ID and MQTT_ENDPOINT from Raspberry Pi.

4. Configuration.

    a) In case you DON'T NEED CONFIG.\
    Remove unnecessary code about configuration from 'app.js', 'lib/Translator.js' and 'lib/utils.js' files.

    b) In case you NEED CONFIG:
    - Use persistently stored config in "config.json" (in "etc" directory) to save thing connection configurations and credentials.

    - Create schema that will describe your "config.json" file.
    - Save this schema as "schema.json" (in "etc" directory).

        This schema will be used to validate your config.\
        You can define your own validation function or use default provided function form utils.

        ```javascript
        {
            //    unique field name
            "name": "apiEndpoint",

            //    label to display to user for this field
            "label": "API endpoint",

            //    type of input to display to user for this field
            "type": "url",

            /*
                field value validation. Should be in format { ruleName: ruleValue }. RuleValue can be set to "true" or some value. For example,
                { required: true } or { maxLength: 8 }.
                Please, note, that currently only LIVR*-compatible rules will be applied to user input value.
            */
            "validation": {
                "required": true,
                "string": true
            },

            /*
                determine if user can set this field value.
                For fields type: select, radio, checkboxGroup - you should omit this field and set 'disable' status for each option separately.
            */
            "disabled": false,

            //    placeholder to display for user input
            "placeholder": "API endpoint",

            //    default value that will be applied for this field
            "defaultValue": "your-device-to-translate.com",

            /*
                in case you use fields of type: select, radio, checkboxGroup - you must provide options for user to select.
                You should set 'disable' status for each options separately.
            */
            "options": {
                "option1": {
                    "disabled": true
                },
                "option2": {
                    "disabled": false
                },
                "option3": {
                    "disabled": false
                }
            }

            /*
                path to set value in config.
                For example, "device.apiEndpoint" means that config will have root object with field "config" that will have
                as value object with key "apiEndpoint":
                {
                    "device": {
                        "apiEndpoint": ''
                    }
                }
            */
            "configKeyPath": "device.apiEndpoint"
        }
        ```

        *[LIVR](http://livr-spec.org/) - Language Independent Validation Rules.

        For example, this schema fields:

        ```
        {
            "fields": [
                {
                    "name": "apiEndpoint",
                    "label": "API endpoint",
                    "type": "url",
                    "validation": {
                        "required": true,
                        "string": true
                    },
                    "disabled": false,
                    "placeholder": "API endpoint",
                    "defaultValue": "your-device-to-translate.com",
                    "configKeyPath": "device.apiEndpoint"
                },
                {
                    "name": "email",
                    "label": "Email",
                    "type": "email",
                    "validation": {
                        "required": true,
                        "email": true
                    },
                    "disabled": false,
                    "placeholder": "exmaple@email.com",
                    "defaultValue": "",
                    "configKeyPath": "device.credentials.email"
                }
            ]
        }
         ```
        describes this config fields:

        ```
        {
            "device": {
                "apiEndpoint": "",
                "credentials": {
                    "email": ""
                }
            }
        }
        ```

        List with examples of all acceptable types of fields you can find in [schemaFieldsExample.json](./etc/schemaFieldsExample.json).


## Publish translator via cli (Update translator docker image in registry)
- https://github.com/Delos-tech/Darwin_Dev_CLI

```bash
    darwin registration
    darwin login
```
- You need to log in only once, after login to publish translator:
```bash
    darwin publish translator <path>
```
- Translator must include metadata.json file and logo in repository
# Translator_Pitcher
