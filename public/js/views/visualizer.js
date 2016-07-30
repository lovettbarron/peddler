/*global cardflip, Backbone, JST*/

peddler.Views = peddler.Views || {};

(function () {
    'use strict';

    peddler.Views.VisualView = Backbone.View.extend({
        template: _.template("<div id=\"<%= id %>\" class=\"item\" style=\"left: <%= index %>%!important; opacity: <%= viz %>\"><a href=\"<%= link %>\"><img src=\"<%= img %>\"></a></div>"),
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
            $(_this.el).find(".item").remove()
            _.each(_this.collection.getUnclaimed(),function(model,index,list){
                // var o = data.property
                 $(_this.el).append(_this.template({
                    id: model.get("id"),
                    link: model.get("link"),
                    img:model.get("img"),
                    index: (model.get("price")/(_this.collection.getMaxValue()+50))*100,
                    viz: (_this.getAvailableFund() >= _this.collection.findWhere({id:model.get("id")}).get('price')) ? "1." : "0.3"
                }));
            })
            this.updateMarker()
        },

        getAvailableFund: function() {
            var _this = this
            return ((_this.user.pluck("yearly_km")*_this.user.getUserStat().multipler)-_this.user.getUserStat().claimed)
        },

        updateMarker: function() {
            var _this = this
            this.user.fetch({
                success: function() {
                 $(_this.el).find('.marker').css('left',function() {
                var dolla = _this.getAvailableFund()
                var vizDolla = dolla/(_this.collection.getMaxValue()+50)
                $(_this.el).find(".marker > .label").html(parseInt(_this.getAvailableFund()))
                console.log("dolla",dolla, "vizdolla",vizDolla)
                if(vizDolla > .95) {
                    $(_this.el).find('#dolla').show()
                    return "95%"
                } else if(vizDolla <= 0) {
                    return "5%"
                } else {
                    $(_this.el).find('#dolla').hide()
                    return (vizDolla*100)+"%"
                }                 
            })
                },
                error: function() {
                    _this.renderError();
                }
            })
           
        },

        updateItems:function() {
            var _this = this
            _.each($(_this.el).find('.link'),function(list,iter){

            })
        },

        onHover: function(e) {
            var _this = this
            if((_this.getAvailableFund() >= _this.collection.findWhere({id:$(e.currentTarget).attr("id")}).get('price'))) {
                clearTimeout(_this.fadeout)
                $(this.el).find('.link').css("left", function() {
                    return $(e.currentTarget).css('left')
                }).attr('id',function(){
                    return $(e.currentTarget).attr('id')
                }).fadeIn()
            }
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

            console.log("Cost of claimed",this.collection.findWhere({id:id}).get('price'))

            if(this.getAvailableFund() >= this.collection.findWhere({id:id}).get('price'))
            this.collection.claimPin(id,function(success) {
                $(_this.el).find("#"+id).fadeOut(function(o) {
                    $(o).remove()
                })
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
