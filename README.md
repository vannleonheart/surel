# surel
Node.js library to simplify the process of sending email using various provider (Mailgun, SparkPost, Mandrill, etc).

## Installation
```bash
$ npm install --save surel
```

## Usage
```js
const surel = require('surel');
```

### Mailgun Provider
Sending Email
```js
const Mailgun = surel('mailgun', {
    from: 'no-reply@your_registered_domain.com',
    credential: {
        API_KEY: 'YOUR_MAILGUN_API_KEY',
        DOMAIN: 'YOUR_MAILGUN_VERIFIED_DOMAIN'
    }
});

Mailgun.send({
    to: 'your_target_email@domain.com',
    subject: 'Using surel is easy',
    html: '<html><head></head><body>This is email content in html.</body></html>',
    text: 'This is email content in plain text.'
});
```
Sending Email With Ejs Template
```js
const Mailgun = surel('mailgun', {
    from: 'no-reply@your_registered_domain.com',
    credential: {
        API_KEY: 'YOUR_MAILGUN_API_KEY',
        DOMAIN: 'YOUR_MAILGUN_VERIFIED_DOMAIN'
    },
    templateDir: 'YOUR_LOCAL_DIRECTORY_CONTAINS_EJS_FILE'
});

Mailgun.send({
    to: 'your_target_email@domain.com',
    subject: 'Using surel is easy',
    templateName: 'EJS_FILE_BASE_NAME_WITHOUT_EXTENSION',
    templateData: {
        'variable_1': 'substitute variable_1 with this'
    }
});
```

### SparkPost Provider
Sending Email
```js
const SparkPost = surel('sparkpost', {
    from: 'no-reply@your_registered_domain.com',
    credential: {
        API_KEY: 'YOUR_SPARKPOST_API_KEY'
    }
});

SparkPost.send({
    to: 'your_target_email@domain.com',
    subject: 'Using surel is easy',
    html: '<html><head></head><body>This is email content in html.</body></html>',
    text: 'This is email content in plain text.'
});
```
Sending Email With Available Template
```js
SparkPost.send({
    to: 'your_target_email@domain.com',
    subject: 'Using surel is easy',
    templateName: 'YOUR_TEMPLATE_ID',
    templateData: {
        'variable_1': 'substitute variable_1 with this'
    }
});
```

### Mandrill Provider
Sending Email
```js
const Mandrill = surel('mandrill', {
    from: 'no-reply@your_registered_domain.com',
    credential: {
        API_KEY: 'YOUR_MANDRILL_API_KEY'
    }
});

Mandrill.send({
    to: 'your_target_email@domain.com',
    subject: 'Using surel is easy',
    html: '<html><head></head><body>This is email content in html.</body></html>',
    text: 'This is email content in plain text.'
});
```
Sending Email With Available Template
```js
Mandrill.send({
    to: 'your_target_email@domain.com',
    subject: 'Using surel is easy',
    templateName: 'YOUR TEMPLATE NAME',
    templateData:[
        { name: 'variable_1', content: 'substitute variable_1 with this' }
    ]
});
```

### Amazon SES Provider
Sending Email
```js
const SES = surel('aws_ses', {
    from: 'Your Name <no-reply@your_registered_domain.com>',
    credential: {
        accessKeyId: 'YOUR_AWS_SES_ACCESS_KEY_ID',
        secretAccessKey: 'YOUR_AWS_SES_ACCESS_KEY_SECRET',
        region: 'YOUR_AWS_SES_REGION',
    }
});

SES.send({
    to: 'your_target_email@domain.com',
    subject: 'Using surel is easy',
    html: '<html><head></head><body>This is email content in html.</body></html>',
    text: 'This is email content in plain text.'
});
```
Sending Email With Available Template
```js
const SES = surel('aws_ses', {
    from: 'Your Name <no-reply@your_registered_domain.com>',
    credential: {
        accessKeyId: 'YOUR_AWS_SES_ACCESS_KEY_ID',
        secretAccessKey: 'YOUR_AWS_SES_ACCESS_KEY_SECRET',
        region: 'YOUR_AWS_SES_REGION',
    },
    templateDir: 'YOUR_LOCAL_DIRECTORY_CONTAINS_EJS_FILE'
});

SES.send({
    to: 'your_target_email@domain.com',
    subject: 'Using surel is easy',
    templateName: 'YOUR TEMPLATE NAME',
    templateData:[
        { name: 'variable_1', content: 'substitute variable_1 with this' }
    ]
});
```
