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
            // this.user = option.user || {}
            this.claim = option.claim || {}
        },

        getUnclaimed: function() {
            var _this = this
            console.log("pins",_this.pluck("id"))
            console.log("claimed",_this.claim.pluck("pinid"))
            return _this.filter(function(obj){
                console.log(obj)
                if(!_.contains(_this.claim.pluck("pinid"),obj.get('id'))) {
                    return obj
                }
            })
        },

       getMaxValue: function() {
            return _.max(this.pluck("price"), function(o){
                return o;
            });
           },

        claimPin: function(id,callback) {

            var price = this.findWhere({id:id})

            var endpoint = this.url + "/claim?pinid=" + id + "&cost=" + price.get("price")+ "&img=" + price.get("img")
            console.log(endpoint)

            $.ajax({
                url : endpoint,
                type : 'GET',
                success : function(data) {              
                    console.log("Claim success")
                    callback(true)
                },
                error : function(request,error)
                {
                    console.log("Error",error)
                    // console.log("Request: "+JSON.stringify(request),error);
                    callback(false)
                }
            });
        }
    });
})();