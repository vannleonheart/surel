const mandrill = require('mandrill-api/mandrill');

const send = (mandrillClient, configs = {}) => (mailer, callback) => {
    const from = {
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
        to.push({
            email: mailer.data.to,
            type: 'to'
        });
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
        from_email: from.email,
        from_name: from.name,
        to,
        headers: options.headers || {},
        important: options.important || false,
        track_opens: options.track_opens || true,
        track_clicks: options.track_clicks || true
    };

    message.global_merge_vars = templateData;

    if (templateName) {
        return mandrillClient.messages.sendTemplate({
            template_name: templateName,
            template_content: [],
            message,
            async: options.async || true
        }, result => callback(null, result), err => callback(err));
    }

    message.html = html;
    message.text = text;

    return mandrillClient.messages.send({
        message,
        async: options.async || true
    }, result => callback(null, result), err => callback(err));
}

module.exports = configs => {
    const { credential = {} } = configs;
    const { API_KEY } = credential;
    const mandrillClient = new mandrill.Mandrill(API_KEY);
    const mailer = {};

    mailer.transporter = {
        name: 'mandrill',
        version: '0.0.10',
        send: send(mandrillClient, configs)
    }

    return mailer;
}
