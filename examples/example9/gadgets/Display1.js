(function($)
{
    Display1 = Ratchet.Gadget.extend(
    {
        constructor: function(id, ratchet)
        {
            this.base(id, ratchet);
        },

        setup: function()
        {
            this.get(this.index);
        },

        index: function(el)
        {
            var _this = this;

            // subscribe to observable
            this.subscribe("value", function() {

                //Ratchet.debug("Display 1 updating: " + this.observable("value").get() + ", ratchet: " + $(_this.ratchet().el).attr("ratchet"));

                this.run("GET", "/");
            });

            el.model["value"] = this.observable("value").get();

            el.transform("templates/display1", function() {
                el.swap();
            });

        }
    });

    Ratchet.GadgetRegistry.register("display1", Display1);

})(jQuery);