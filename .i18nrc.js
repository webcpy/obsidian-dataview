// const {
//     defineConfig
// } = require('@lobehub/i18n-cli');

module.exports = {
    splitToken: 1024,
    markdown: {
        entry: ['./README.md', './functions.md'],
        entryLocale: 'en-US',
        entryExtension: '.md',
        output: '/local',
        outputLocales: ['zh-CN'],
        outputExtensions: (locale, {
            getDefaultExtension
        }) => {
            return getDefaultExtension(locale);
        },
    },
};
