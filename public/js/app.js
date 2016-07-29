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

        this.Init.Claim = new this.Collections.ClaimCollection({
                model: new this.Models.ClaimModel(),
                user: this.Init.User,
            });

        this.Init.Pin = new this.Collections.PinCollection({
                model: new this.Models.PinModel(),
                user: this.Init.User,
                claim: this.Init.Claim
            });


        this.Init.Auth = new this.Views.AuthView({
            el: '#auth',
            collection:this.Init.User,
        });


        this.Init.Visual = new this.Views.VisualView({
            el: '#visualizer',
            collection:this.Init.Pin,
            user: this.Init.User,
            claim: this.Init.Claim
        });

        this.Init.Claimed = new this.Views.ClaimView({
            el: '#history',
            collection:this.Init.Pin,
            user: this.Init.User,
            claim: this.Init.Claim
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
