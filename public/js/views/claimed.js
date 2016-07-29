peddler.Views = peddler.Views || {};

(function () {
    'use strict';

    peddler.Views.ClaimView = Backbone.View.extend({
        template: _.template("<div id=\"<%= id %>\" class=\"item\"><a href=\"<%= link %>\"><img src=\"<%= img %>\"></a></div>"),
        // errorTemplate: JST['app/scripts/templates/card-err.ejs'],
        events: {
            "click #pinterestUsername":"usernameClear",
        	"keydown #pinterestUsername":"usernameUpdate",
            "change .boardList":"revealStrava"
        },
        cleared: false,
        initialize: function(options) {
        	var _this = this
            this.boards = []
        	this.user = options.user || {};

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
        },

        render: function() {
            var _this = this
            var claimed = _this.user.findWhere().get("claimed")
             claimed.each(function(model,index,list){
                // var o = data.property
                var imgg = _this.collection.findWhere({id:model.get("id")})

                 $(_this.el).find(".bucket").append(_this.template({
                    id: model.get("id"),
                    link: model.get("link"),
                    img: imgg.get('img'),
                    index: (model.get("price")/(_this.collection.getMaxValue()+50))*100
                }));
             })
        },

        resize: function() {

        },



    });

})();
