const path = require('path');
const mailgun = require('mailgun-js');
const compile = require('./../compile')('ejs');

const send = (mailgunClient, configs = {}) => (mailer, callback) => {
    let from = {
        name: null,
        email: null
    };

    if (configs && configs.from) {
        if (typeof configs.from === 'string') {
            from.email = configs.from;
        } else {
            if (typeof configs.from.name === 'string') {
                from.name = configs.from.name;
            }

            if (typeof configs.from.email === 'string') {
                from.email = configs.from.email;
            }
        }
    }

    if (mailer && mailer.data && mailer.data.from) {
        if (typeof mailer.data.from === 'string') {
            from.email = mailer.data.from;
        } else {
            if (typeof mailer.data.from.name === 'string') {
                from.name = mailer.data.from.name;
            }

            if (typeof mailer.data.from.email === 'string') {
                from.email = mailer.data.from.email;
            }
        }
    }

    if (!from.email) {
        return callback(new Error('ERROR_SENDER_NOT_SET'));
    }

    // TODO: Validate from email format

    const to = [];

    if (mailer && mailer.data && mailer.data.to && typeof mailer.data.to === 'string') {
        to.push(mailer.data.to);
    }

    if (to.length <= 0) {
        return callback(new Error('ERROR_TARGET_NOT_SET'));
    }

    const configOptions = configs && configs.options ? configs.options : {};
    const sendOptions = mailer && mailer.data && mailer.data.options ? mailer.data.options : {};
    const options = Object.assign({}, configOptions, sendOptions);

    const templateName = mailer && mailer.data && mailer.data.templateName ? mailer.data.templateName : null;
    const templateData = mailer && mailer.data && mailer.data.templateData ? mailer.data.templateData : [];

    const html = mailer && mailer.data && mailer.data.html ? mailer.data.html : null;
    const text = mailer && mailer.data && mailer.data.text ? mailerdata.text : null;

    const message = {
        subject: mailer.data.subject,
        from: from.name ? `${from.name} <${from.email}>` : from.email,
        html,
        text,
        to: to.join(', ')
    };

    const templateFileOrHtml = configs.templateDir ? templateName : message.html;

    compile(templateFileOrHtml, templateData, configs.templateDir).then(compiledHtml => {
        message.html = compiledHtml;

        mailgunClient.messages().send(message, callback);
    }).catch(err => callback(err));
}

module.exports = configs => {
    const { credential = {} } = configs;
    const { API_KEY, DOMAIN } = credential;
    const mailer = {};
    const mailgunClient = mailgun({
        apiKey: API_KEY,
        domain: DOMAIN
    });

    mailer.transporter = {
        name: 'mailgun',
        version: '0.0.10',
        send: send(mailgunClient, configs)
    }

    return mailer;
}
