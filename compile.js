const path = require('path');

module.exports = (templateEngine, options = {}) => (templateName, templateData = {}, templateDir) => new Promise((resolve, reject) => {
    if (typeof templateEngine !== 'string') {
        templateEngine = '';
    }

    templateEngine = templateEngine.trim().toLowerCase();

    if (templateEngine.length <= 0) {
        return reject(new Error('ERROR_TEMPLATE_ENGINE_NOT_SET'));
    }

    const templateEngineFile = path.resolve(path.normalize(`${__dirname}/compiler/${templateEngine}`));
    const compiler = require(templateEngineFile)(options);

    compiler.compile(templateName, templateData, templateDir).then(resolve).catch(reject);
});
