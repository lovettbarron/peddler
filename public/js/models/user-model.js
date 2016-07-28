peddler.Models = peddler.Models || {};

(function () {
    'use strict';

    peddler.Models.UserModel = Backbone.Model.extend({

        initialize: function() {
            
        },

        defaults: {

        },

        validate: function(attrs, options) {
        },

        parse: function(response, options)  {
            return response;
        }
    });

})();
