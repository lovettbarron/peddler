peddler.Views = peddler.Views || {};

(function () {
    'use strict';

    peddler.Views.AuthView = Backbone.View.extend({
        // template: JST['app/scripts/templates/card.ejs'],
        // errorTemplate: JST['app/scripts/templates/card-err.ejs'],
        events: {
            "click #pinterestUsername":"usernameClear",
        	"keydown #pinterestUsername":"usernameUpdate",
            "change .boardList":"registerPinterest"
        },
        cleared: false,
        initialize: function() {
        	var _this = this
            this.boards = []
        	// this.user = this.options.user || {};
        },

        usernameUpdate: function(e) {
            var _this = this
             if(e.keyCode == 13){
                e.preventDefault();
                this.collection.doPinBoardsExist($(this.el).find("#pinterestUsername").html()
                    , function(data) {
                    if(data.length > 0) {
                        console.log("populating boards")
                        for(var v in data) {
                            $(_this.el).find(".boardList").append("<option value="+data[v]+">"+data[v]+"</option>")
                        }
                    $(_this.el).find(".boardList").show()
                }
            })
            }
            
        },

        usernameClear: function() {
            if(!this.cleared) {
                $(this.el).find("#pinterestUsername").html("")
                this.cleared = true
            }
        },

        revealStrava: function() {
            console.log("selected")
            var _this = this
            var username = $(this.el).find("#pinterestUsername").html()
            var board = $(this.el).find(".boardList").find(':selected').html()

            this.collection.registerUserPinterestConfig(username,board,function() {
                $(_this.el).find(".strava").show()    
            })
            
        },

        registerPinterest: function() {
            var _this = this
            var username = $(this.el).find("#pinterestUsername").html()
            var board = $(this.el).find(".boardList").find(':selected').html()

            this.collection.registerUserPinterestConfig(username,board,function() {
                    window.location.href="/"
            })
        },

        render: function() {
            	
        },

        resize: function() {

        },



    });

})();
