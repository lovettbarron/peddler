/*global cardflip, Backbone, JST*/

peddler.Views = peddler.Views || {};

(function () {
    'use strict';

    peddler.Views.VisualView = Backbone.View.extend({
        template: _.template("<div id=\"<%= id %>\" class=\"item\" style=\"left: <%= index %>%!important\"><a href=\"<%= link %>\"><img src=\"<%= img %>\"></a></div>"),
        events: {
            'mouseenter .item': 'onHover',
            'mouseleave .item': 'offHover',
            'mouseenter .link': 'onHover',
            'mouseleave .link': 'offHover',
            'click .treat':'claimItem'
        },
        fadeout: 0,
        user: {},
        initialize: function(options) {
        	var _this = this;
            this.user = options.user;
            this.claim = options.claim;
            this.fadeout = null;

			this.collection.fetch({
                success: function() {
                    _this.render();

                },
                error: function() {
                    _this.renderError();
                }
            })

            this.user.fetch({
                success: function() {
                    _this.render();

                },
                error: function() {
                    _this.renderError();
                }
            })


            this.listenTo(this.collection, 'change', this.render);
            this.listenTo(this.user, 'change', this.render);
            this.listenTo(this.claim, 'change', this.render);
        },

        render: function() {
            var _this = this
            console.log("MaxPrice",_this.collection.getMaxValue())
            var _this = this
            _.each(_this.collection.getUnclaimed(),function(model,index,list){
                // var o = data.property
                 $(_this.el).append(_this.template({
                    id: model.get("id"),
                    link: model.get("link"),
                    img:model.get("img"),
                    index: (model.get("price")/(_this.collection.getMaxValue()+50))*100
                }));
            })
            this.updateMarker()
        },

        updateMarker: function() {
            var _this = this
            $(this.el).find('.marker').css('left',function() {
                var dolla = ((_this.user.pluck("yearly_km"))/(_this.collection.getMaxValue()+50))*100
                return dolla > 95 ? "95%" : dolla+"%"
                 
            })
        },

        onHover: function(e) {
            var _this = this
            // if($(e.currentTarget).hasClass('link')) {
            clearTimeout(_this.fadeout)
            //     console.log("canceled")
            // }
            $(this.el).find('.link').css("left", function() {
                return $(e.currentTarget).css('left')
            }).attr('id',function(){
                return $(e.currentTarget).attr('id')
            }).fadeIn()
        },

        offHover: function(e) {
            var _this = this
            _this.fadeout = setTimeout(function() {
                console.log('timeout!')
                $(_this.el).find('.link').stop().fadeOut()
            },500)
            
        },

        claimItem: function(e) {
            var _this = this
            var id = $(e.currentTarget).parent().attr('id')
            console.log('claim!',id)
            this.collection.claimPin(id,function(success) {
                $(_this.el).find("#"+id).fadeOut()
                _this.user.fetch()
                _this.claim.itemClaimed(id)
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
