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

        this.Inst.UserCollection = new this.Collections.UserCollection({
                model: new this.Models.UserModel()
            });
       
        this.Inst.pinCollection = new this.Collections.PinCollection({
                model: new this.Models.PinModel()
            });

        this.Init.Visual = new this.Views.VisualView({
            el: '#visualizer',
            collection:this.Inst.pinCollection
        });

        this.Init.Equation = new this.Views.EquationView({
            el: '#calculate',
            collection:this.Inst.pinCollection
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
