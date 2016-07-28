/*global cardflip, $*/


window.peddler = {
    Models: {},
    Collections: {},
    Views: {},
    Routers: {},
    Inst: {},
    Init: {},
    init: function () {
        'use strict';
       
        this.Inst.pinCollection = new this.Collections.PinCollection({
                model: new this.Models.PinModel()
            });

        this.Init.card1 = new this.Views.VisualView({
            el: '.board1',
            category: '1',
            collection:this.Inst.CardCollection
        });

        _.each(this.Init, function(v){
            v.init();
        })

    },

};

$(document).ready(function () {
    'use strict';
    peddler.init();
});
