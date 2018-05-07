const mandrill = require('mandrill-api/mandrill');

const send = (mandrillClient, configs = {}) => (mailer, callback) => {
    const from = {
        name: null,
        email: null
    };

    const to = [];

    if (configs && configs.from) {
        if (typeof configs.from === 'string') {
            from.email = configs.from;
        } else {
            from.name = configs.from.name;
            from.email = configs.from.email;
        }
    }

    if (mailer && mailer.data && mailer.data.from) {
        if (typeof mailer.data.from === 'string') {
            from.email = mailer.data.from;
        } else {
            from.name = mailer.data.from.name;
            from.email = mailer.data.from.email;
        }
    }

    if (mailer && mailer.data && mailer.data.to && typeof mailer.data.to === 'string') {
        to.push({
            email: mailer.data.to,
            type: 'to'
        });
    }

    const configOptions = configs && configs.options ? configs.options : {};
    const sendOptions = mailer && mailer.data && mailer.data.data && mailer.data.data.options ? mailer.data.data.options : {};
    const options = Object.assign({}, configOptions, sendOptions);
    const templateName = mailer && mailer.data && mailer.data.data && mailer.data.data.templateName ? mailer.data.data.templateName : null;
    const templateData = mailer && mailer.data && mailer.data.data && mailer.data.data.templateData ? mailer.data.data.templateData : {};
    const html = mailer && mailer.data && mailer.data.data && mailer.data.data.html ? mailer.data.data.html : null;
    const text = mailer && mailer.data && mailer.data.data && mailer.data.data.text ? mailer.data.data.text : null;

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
    const mailer = {};
    const mandrillClient = new mandrill.Mandrill(API_KEY);

    mailer.transporter = {
        name: 'mandrill',
        version: '0.0.10',
        send: send(mandrillClient, configs)
    }

    return mailer;
}
