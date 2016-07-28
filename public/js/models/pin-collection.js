/*global cardflip, Backbone*/

peddler.Collections = peddler.Collections || {};

(function () {
    'use strict';

    peddler.Collections.PinCollection = Backbone.Collection.extend({

        // model: peddler.Models.PinModel,s

    	url: '/items',

    	selected: [],

        initialize: function() {

        },

        getCardByCategory: function(id,prev) {
	        var list = _.map(this.pluck(id)[0].cards, function(v) {
	        	return v.title
	        });
	        if(!_.isUndefined(prev)) list = _.difference(list,prev); // remove previous
	        var len = _.size(list);
	        return list[Math.floor(Math.random() * len)]
        },
    });

})();