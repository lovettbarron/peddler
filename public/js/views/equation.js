peddler.Views = peddler.Views || {};

(function () {
    'use strict';

    peddler.Views.EquationView = Backbone.View.extend({
        // template: JST['app/scripts/templates/card.ejs'],
        // errorTemplate: JST['app/scripts/templates/card-err.ejs'],
        events: {
        	"input #numerator":"numeratorUpdate",
        	"click #numerator":"numeratorClear",
        	"input #denominator":"denominatorUpdate",
        	"click #denominator":"denominatorClear",
        },
        initialize: function() {
        	var _this = this
        	// this.user = this.options.user || {};
            this.collection.fetch({
                success: function() {
                	console.log("Got user")
                    _this.render();
                },
                error: function() {
                	console.log("Got user")
                    _this.renderError();
                }
            })
        },

        numeratorUpdate: function(e) {
        	console.log("Updating numerator")
        	 if(e.keyCode == 13){
                e.preventDefault();
                this.render()
            }
        },

        numeratorClear: function(e) {
        	$(this.el).find('#numerator').html("")
        },

        denominatorUpdate:function() {
        	console.log("Updating Denominator")
        	if(e.keyCode == 13){
                e.preventDefault();
                this.render()
            }
        },

        denominatorClear: function() {
        	$(this.el).find('#denominator').html("")
        },

        render: function() {
        	var results = Math.round(parseFloat(this.collection.getStat().result) * 100) / 100

        	$(this.el).find('#numerator').html(this.collection.getStat().numerator)
        	$(this.el).find('#denominator').html(this.collection.getStat().denominator)
        	$(this.el).find('#results').html(results)
        	
        },

        resize: function() {

        },



    });

})();
