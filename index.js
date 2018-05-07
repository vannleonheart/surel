const path = require('path');
const nodemailer = require('nodemailer');

const sendMail = transporter => (to, subject, data = {}) => new Promise((resolve, reject) => {
    transporter.sendMail({ to, subject, data }, (err, result) => {
        if (err) {
            return reject(err);
        }

        resolve(result);
    });
});

module.exports = (providerName, configs = {}) => {
    const mailer = {};

    if (typeof providerName !== 'string') {
        providerName = '';
    }

    providerName = providerName.toLowerCase().trim();

    if (providerName.length <= 0) {
        throw new Error('ERROR_PROVIDER_NOT_SET');
    }
    
    const providerFile = path.resolve(path.normalize(`${__dirname}/providers/${providerName}`));
    const provider = require(providerFile)(configs);
    const transporter = nodemailer.createTransport(provider.transporter);

    mailer.send = sendMail(transporter);

    return mailer;
}
