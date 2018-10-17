const path = require('path');
const aws = require('aws-sdk');
const compile = require('./../compile')('ejs');

const send = (client, configs = {}) => (mailer, callback) => {
    const Charset = "UTF-8";
    const params = {
        Source: null,
        Destination: {
            ToAddresses: [],
        },
        Message: {
            Subject: {
                Data: mailer.data.subject,
                Charset
            },
            Body: {
                Html: {
                    Data: "",
                    Charset
                }
            }
        }
    };

    if (configs && configs.from) {
        if (typeof configs.from === 'string') {
            params.Source = configs.from;
        } else {
            const from = { name: "", email: "" };

            if (typeof configs.from.name === 'string') {
                from.name = configs.from.name;
            }

            if (typeof configs.from.email === 'string') {
                from.email = `<${configs.from.email}>`;
            }

            params.Source = from.join(" ");
        }
    }

    if (mailer && mailer.data && mailer.data.from) {
        if (typeof mailer.data.from === 'string') {
            params.Source = mailer.data.from;
        } else {
            const from = { name: "", email: "" };

            if (typeof mailer.data.from.name === 'string') {
                from.name = mailer.data.from.name;
            }

            if (typeof mailer.data.from.email === 'string') {
                from.email = mailer.data.from.email;
            }

            params.Source = from.join(" ");
        }
    }

    if (!params.Source) {
        return callback(new Error('ERROR_SENDER_NOT_SET'));
    }

    // TODO: Validate from email format

    if (mailer && mailer.data && mailer.data.to && typeof mailer.data.to === 'string') {
        params.Destination.ToAddresses.push(mailer.data.to);
    }

    if (!params.Destination.ToAddresses.length) {
        return callback(new Error('ERROR_TARGET_NOT_SET'));
    }

    const templateName = mailer && mailer.data && mailer.data.templateName ? mailer.data.templateName : null;
    const templateData = mailer && mailer.data && mailer.data.templateData ? mailer.data.templateData : [];

    const html = mailer && mailer.data && mailer.data.html ? mailer.data.html : null;
    const text = mailer && mailer.data && mailer.data.text ? mailerdata.text : null;

    params.Message.Body.Html.Data = html;

    if (text) {
        params.Message.Body["Text"] = {
            Data: text,
            Charset
        };
    }

    const templateFileOrHtml = configs.templateDir ? templateName : params.Message.Body.Html.Data;

    compile(templateFileOrHtml, templateData, configs.templateDir).then(compiledHtml => {
        params.Message.Body.Html.Data = compiledHtml;

        client.sendEmail(params, callback);
    }).catch(err => callback(err));
}

module.exports = configs => {
    const { credential = {} } = configs;
    const { accessKeyId, secretAccessKey, region } = credential;

    aws.config.accessKeyId = accessKeyId;
    aws.config.secretAccessKey = secretAccessKey;
    aws.config.region = region;

    const provider = {};
    const client = new aws.SES();

    provider.transporter = {
        name: 'aws_ses',
        version: '0.0.10',
        send: send(client, configs)
    }

    return provider;
}
