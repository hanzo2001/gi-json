require.config({
    baseUrl: './scripts',
    paths: {
        jquery: 'lib/jquery-3.0.0',
        handlebars: 'lib/handlebars.runtime-4.0.5',
        helpers: 'hb-helpers',
        hbtpl: 'hb-precompiled',
        app: 'app'
    }
});
require(['app']);
