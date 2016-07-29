/*global cardflip, Backbone*/

peddler.Collections = peddler.Collections || {};

(function () {
    'use strict';

    peddler.Collections.PinCollection = Backbone.Collection.extend({

        // model: peddler.Models.PinModel,s

    	url: '/items',

    	selected: [],

        user: {},

        initialize: function(option) {
            this.user = option.user || {}
        },

       getMaxValue: function() {
            return _.max(this.pluck("price"), function(o){
                return o;});
           },

        claimPin: function(id,callback) {

            var price = this.findWhere({id:id})

            var endpoint = this.url + "/claim?pinid=" + id + "&cost=" + price.get("price")
            console.log(endpoint)

            $.ajax({
                url : endpoint,
                type : 'GET',
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