/*global cardflip, Backbone, JST*/

peddler.Views = peddler.Views || {};

(function () {
    'use strict';

    peddler.Views.VisualView = Backbone.View.extend({
        // template: JST['app/scripts/templates/card.ejs'],
        // errorTemplate: JST['app/scripts/templates/card-err.ejs'],
        events: {
        },
        init: function() {
        	var _this = this;
        	this.freeze = false;
        	this.category = this.options.category || 0;
			this.collection.fetch({
                success: function() {
                    console.log(JSON.stringify(_this.collection));
                    _this.render();
                },
                error: function() {
                    _this.renderError();
                }
            })
        },

        render: function() {
	        console.log(this.collection)
        },

        resize: function() {
        	if($(window).width()<640) {
        		$(this.el).find('.card').height($(window).height()*.94)
        			.width($(window).width()*.90)
        	}
        },



    });

})();
