peddler.Views = peddler.Views || {};

(function () {
    'use strict';

    peddler.Views.EquationView = Backbone.View.extend({
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
                    _this.render();
                },
                error: function() {
                    _this.renderError();
                }
            })
        },

        render: function() {
	        $(this.el).html(this.template({
	        	category: this.collection.getCategoryName(this.category),
            }));
            this.resize();
        },

        resize: function() {
        	if($(window).width()<640) {
        		$(this.el).find('.card').height($(window).height()*.94)
        			.width($(window).width()*.90)
        	}
        },



    });

})();
