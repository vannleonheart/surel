const ejs = require('ejs');
const path = require('path');

const compile = options => (templateName, templateData = {}, templateDir) => new Promise((resolve, reject) => {
    options.cache = true;

    if (!templateDir) {
        return ejs.render(templateName, templateData, options, (err, result) => {
            if (err) {
                return reject(err);
            }

            resolve(result);
        });
    }

    ejs.renderFile(path.resolve(`${templateDir}/${templateName}.ejs`), templateData, options, (err, result) => {
        if (err) {
            return reject(err);
        }

        resolve(result);
    });
});

module.exports = (options = {}) => {
    const compiler = {};

    compiler.compile = compile(options);

    return compiler;
}
