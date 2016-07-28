/*global cardflip, Backbone*/

peddler.Collections = peddler.Collections || {};

(function () {
    'use strict';

    peddler.Collections.UserCollection = Backbone.Collection.extend({

        // model: peddler.Models.UserModel,

    	url: '/user',

        initialize: function() {

        },

        getStat: function() {
            // CHANGE
            var monthly_budget = 100
            var yearly_goal = 5200

            return {
                username: "test",
                numerator: monthly_budget,
                denominator: yearly_goal,
                result: (monthly_budget*12)/yearly_goal
            }
        },

        doPinBoardsExist: function(username,callback) {
            var endpoint = this.url + "/pin-exist?user=" + username
            $.ajax({

            url : endpoint,
            type : 'GET',
            dataType:'json',
            success : function(data) {              
                console.log("returning data",data)
                callback(data)
            },
            error : function(request,error)
            {
                alert("Request: "+JSON.stringify(request));
            }
            });
        },

        registerUserPinterestConfig: function(username,board,callback) {
            var endpoint = this.url + "/pin-config?user=" + username + "&board=" + board
                $.ajax({

                url : endpoint,
                type : 'PUT',
                dataType:'json',
                success : function(data) {              
                    
                    callback()
                },
                error : function(request,error)
                {
                    console.log("Request: "+JSON.stringify(request));
                    callback()
                }
            });
        }


    });

})();