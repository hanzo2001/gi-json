require.config({
    baseUrl: './scripts',
    paths: {
        jquery: 'lib/jquery-3.0.0',
        handlebars: 'lib/handlebars',
        helpers: 'handlebars-helpers',
        NodeEngine: 'NodeEngine',
        app: 'app'
    }
});
require(['app']);
