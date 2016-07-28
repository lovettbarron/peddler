/*global cardflip, $*/


window.peddler = {
    auth: false,
    Models: {},
    Collections: {},
    Views: {},
    Routers: {},
    Init: {},
    init: function () {
        'use strict';

        this.Init.User = new this.Collections.UserCollection({
                model: new this.Models.UserModel()
            });
       
        this.Init.pinCollection = new this.Collections.PinCollection({
                model: new this.Models.PinModel()
            });


        this.Init.Auth = new this.Views.AuthView({
            el: '#auth',
            collection:this.Init.User,
        });


        this.Init.Visual = new this.Views.VisualView({
            el: '#visualizer',
            collection:this.Init.pinCollection,
            user: this.Init.User
        });

        this.Init.Equation = new this.Views.EquationView({
            el: '#calculate',
            collection: this.Init.User
        });

        _.each(this.Init, function(v){
            v.initialize();
        })

    },

};

$(document).ready(function () {
    'use strict';
    peddler.init();
});
