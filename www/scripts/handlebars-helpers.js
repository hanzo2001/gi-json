define(["require", "exports", "handlebars"], function (require, exports, Handlebars) {
    "use strict";
    Handlebars.registerHelper('selectOptions', function (options, selected, dflt) {
        var r;
        var i;
        var f;
        f = function (k, v, s) { return '<option value="' + k + '"' + (s ? ' selected' : '') + '>' + v + '</option>'; };
        r = dflt ? f(dflt.k, dflt.v, false) : '';
        if (options instanceof Array) {
            var l = options.length;
            for (i = 0; i < l; i++) {
                r += f(i, options[i], i === selected);
            }
        }
        else {
            for (i in options) {
                r += f(i, options[i], i === selected);
            }
        }
        return r;
    });
    Handlebars.registerHelper('radioOptions', function (name, options, selected) {
        var r;
        var i;
        var f;
        f = function (n, k, v, s) { return '<label><input type="radio" name="' + n + '" value="' + k + '"' + (s ? ' checked' : '') + ' /> ' + v + '</label>'; };
        r = '';
        if (options instanceof Array) {
            var l = options.length;
            for (i = 0; i < l; i++) {
                r += f(name, i, options[i], i === selected);
            }
        }
        else {
            for (i in options) {
                r += f(name, i, options[i], i === selected);
            }
        }
        return r;
    });
});
