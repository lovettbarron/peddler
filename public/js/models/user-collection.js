/*global cardflip, Backbone*/

peddler.Collections = peddler.Collections || {};

(function () {
    'use strict';

    peddler.Collections.UserCollection = Backbone.Collection.extend({

        // model: peddler.Models.UserModel,

    	url: '/user',

        initialize: function() {

        },

        getUserStat: function() {
            // CHANGE
            var user = this.findWhere()
            return {
                numerator: user.get("budget"),
                denominator: user.get("goal"),
                claimed: user.get("claimed"),
                multipler: (user.get("monthly_budget")*12)/user.get("yearly_goal") || .25
            }
        },

        updateUserStates: function(o) {
            var change = {
                pinUser: o.pinUser || null,
                pinBoard: o.pinBoard || null,
                monthly_budget: o.monthly_budget || null,
                yearly_goal: o.yearly_goal || null,
                }

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