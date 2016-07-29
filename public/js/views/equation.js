peddler.Views = peddler.Views || {};

(function () {
    'use strict';

    peddler.Views.EquationView = Backbone.View.extend({
        // template: JST['app/scripts/templates/card.ejs'],
        // errorTemplate: JST['app/scripts/templates/card-err.ejs'],
        events: {
        	"keydown #numerator":"numeratorUpdate",
        	"click #numerator":"numeratorClear",
        	"keydown #denominator":"denominatorUpdate",
        	"click #denominator":"denominatorClear",
        },
        initialize: function(option) {
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

            $(".editable").on("input", ".numeric", function() {
			    this.value = this.value.replace(/[^0-9\.]/g,'');
			});
        },

	    fetchChange: function(id) {
            var _this = this
            _this.collection.fetch({
                succes: function(){
                    console.log("SuccessFetchChange")
                    _this.render()
                },
                error: function(){
                    console.log("error fetching") 
                }
            })
        },

        numeratorUpdate: function(e) {
        	 if(e.keyCode === 13){
                e.preventDefault();
                var val = $('.numerator').find('span').html()
                this.updateUser({monthly_budget:val})
            }
        },

        numeratorClear: function(e) {
        	$(this.el).find('#numerator').html("")
        },

        denominatorUpdate:function(e) {
        	if(e.keyCode === 13){
                e.preventDefault();
                var val = $('.denominator').find('span').html()
                this.updateUser({yearly_goal:val})
            }
        },

        denominatorClear: function() {
        	$(this.el).find('#denominator').html("")
        },

        render: function() {
        	// The math here just truncates
        	var results = Math.round(parseFloat(this.collection.getUserStat().result) * 100) / 100

        	$(this.el).find('#numerator').html(this.collection.getUserStat().numerator)
        	$(this.el).find('#denominator').html(this.collection.getUserStat().denominator)
        	$(this.el).find('#results').html(results)
        	
        },

        updateUser: function(o) {
        	// pinUser
        	// pinBoard
        	// monthly_budget
        	// yearly_goal
        	var _this = this
        	_this.collection.updateUserStats(o,function() {
        		_this.fetchChange()
        	})
        },


        resize: function() {

        },



    });

})();
