define(function(require) {
    "use strict";

    var Backbone = require("backbone");
    var _        = require("underscore");

    decorateExtend(Backbone);

    function decorateExtend (Backbone) {
        var originalExtend = Backbone.Model.extend;
        var extend = function (protoProps, staticProps) {
            wrapProps(protoProps, this.prototype);
            wrapProps(staticProps, this);
            return originalExtend.call(this, protoProps, staticProps);
        };

        Backbone.Model.extend = Backbone.Collection.extend = Backbone.Router.extend = Backbone.View.extend = extend;
    }

    function wrapProps (props, parentProps) {
        try {
            _(props)
                .chain()
                .keys()
                .filter(filterPropsWithSuper.bind(null, props, parentProps))
                .each(wrapProperty.bind(null, props, parentProps))
            ;
        } catch (e) {
            console.log("Error: ", e.message);
        }
    }

    function filterPropsWithSuper(protoProps, parentProps, name) {
        return _(protoProps[name]).isFunction()
            && _(parentProps[name]).isFunction()
            && isCallSuper(protoProps[name]);
    }

    function wrapProperty (protoProps, parentProps, name) {
        protoProps[name] = wrapMethod(protoProps[name], parentProps[name]);
    }

    function wrapMethod (method, parentMethod) {
        return function() {
            var backup = this._super;

            this._super = parentMethod;

            try {
               return method.apply(this, arguments);
            } finally {
                this._super = backup;
            }
        };
    }

    function isCallSuper (method) {
        var fnTest = /xyz/.test(function() { "xyz"; }) ? /\b_super\b/ : /./;
        return fnTest.test(method);
    }
});
