peddler.Views = peddler.Views || {};

(function () {
    'use strict';

    peddler.Views.ClaimView = Backbone.View.extend({
        template: _.template("<div id=\"<%= id %>\" class=\"item\"><a href=\"<%= link %>\"><img src=\"<%= img %>\"></a></div>"),
        // errorTemplate: JST['app/scripts/templates/card-err.ejs'],
        events: {
        },
        cleared: false,
        initialize: function(options) {
        	var _this = this
            this.boards = []
        	this.user = options.user || {};
            this.claim = options.claim || {};

            this.claim.fetch({
                success: function() {
                    _this.render();

                },
                error: function() {
                    _this.renderError();
                }
            })
            this.claim.on('add', this.render, this);
            // this.claim.on('reset', this.render, this);
            this.claim.on("itemClaimed", this.fetchChange, this);
        },

        render: function() {
            var _this = this
            // console.log("claim",this.claim)
            var count = 0
            this.claim.each(function(model,index,list){
                // console.log(model)
                count+= 1
                // console.log("Test filter",$(_this.el).find('.bucket').find("#"+model.get('id')))
                if($(_this.el).find('.bucket').find("#"+model.get('id')).length == 0) {
                    _this.renderClaim(model,count*100)    
                }
                
             })
        },

        fetchChange: function(id) {
            console.log("FIred FetchChange")
            var _this = this
            this.claim.fetch({
                succes: function(){
                    console.log("LSuccessFetchChange")
                    _this.renderClaim(_this.claim.findWhere({id:id}))
                },
                error: function(){
                    console.log("error fetching") 
                }
            })
        },

        renderClaim: function(model,delay){
            var _this = this
            var del = delay || 0    
            // console.log("renderClaim",model)
            $(_this.el).find(".bucket").append($('<div/>').html(_this.template({
                    id: model.get("id"),
                    link: model.get("link"),
                    img: model.get('img'),
                })).hide().delay(del).fadeIn());
        },

        resize: function() {

        },



    });

})();
