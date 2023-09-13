const mix = require('laravel-mix');
const path = require('path');
const fs = require('fs');

mix.js('src/JsPowerHelperFunctions.js', 'dist/JsPowerHelperFunctions.js')
.setPublicPath('dist')
.webpackConfig({
    resolve: {
        modules: ['node_modules', path.resolve(__dirname, 'src')]
    },
    output: {
        library: 'powerHelper',
        libraryTarget: 'window',
    },
    stats: 'errors-only',
}).disableNotifications();
