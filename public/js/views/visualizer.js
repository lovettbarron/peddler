/*global cardflip, Backbone, JST*/

peddler.Views = peddler.Views || {};

(function () {
    'use strict';

    peddler.Views.VisualView = Backbone.View.extend({
        template: _.template("<div class=\"item\" style=\"left: <%= index %>%!important\"><a href=\"<%= link %>\"><img src=\"<%= img %>\"></a></div>"),
        events: {
        },
        initialize: function() {
        	var _this = this;
            // this.template = _.template("<div class=\"item\"><a href=\"<%= link %><img src=\"<%= img %>\"></a></div>"),
			this.collection.fetch({
                success: function() {
                    _this.render();
                },
                error: function() {
                    _this.renderError();
                }
            })
            this.listenTo(this.collection, 'reset', this.render);
        },

        render: function() {
	        console.log("Rendering VisualView",this.collection)
            var _this = this
            _this.collection.each(function(model,index,list){
                // var o = data.property
                 $(_this.el).append(_this.template({
                    link: model.get("link"),
                    img:model.get("img"),
                    index: (model.get("price")/$(window).width())*100
                }));
            })
        },

        resize: function() {
        	if($(window).width()<640) {
        		$(this.el).find('.card').height($(window).height()*.94)
        			.width($(window).width()*.90)
        	}
        },



    });

})();
