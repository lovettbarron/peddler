/*global cardflip, Backbone*/

peddler.Collections = peddler.Collections || {};

(function () {
    'use strict';

    peddler.Collections.ClaimCollection = Backbone.Collection.extend({

        // model: peddler.Models.PinModel,s

    	url: '/claimed',

    	selected: [],

        user: {},

        initialize: function(option) {
            this.user = option.user || {}
        },

        itemClaimed: function(id) {
            this.trigger('itemClaimed', id);
        }
    });
})();