(function($)
{
    Ratchet.Gadget = Base.extend(
    {
        // either (type, _ratchet)
        // or (type, _ratchet, id)
        constructor: function(type, _ratchet, id)
        {
            this.base();

            var _this = this;

            this.type = type;
            this.id = id;

            // if no id, then assume type as id
            if (!this.id)
            {
                this.id = this.type;
            }

            // privileged methods

            this.route = function(uri, method, viewHandler, controllerHandler)
            {
                // special case - "viewHandler" can be a String which identifies a template to execute!
                if (Ratchet.isString(viewHandler))
                {
                    var view = viewHandler;
                    viewHandler = function(context, model)
                    {
                        _this.renderTemplate.call(_this, context, model, view);
                    };
                }
                _ratchet.route(this, uri, method, viewHandler, controllerHandler);
            };

            this.ratchet = function()
            {
                return _ratchet;
            };

            this.topRatchet = function()
            {
                var ratchet = this.ratchet();
                while (ratchet.parent)
                {
                    ratchet = ratchet.parent;
                }

                return ratchet;
            };

            this.getGadgetId = function()
            {
                return this.id;
            };

            this.getGadgetType = function()
            {
                return this.type;
            };

        },

        app: function()
        {
            return this.topRatchet();
        },

        /**
         * @extension_point
         *
         * This method should be overridden and used to register routes and observables and the like.
         */
        setup: function()
        {
        },

        teardown: function()
        {
            // TODO: anything?
        },


        /////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // OBSERVABLES
        //
        /////////////////////////////////////////////////////////////////////////////////////////////////

        subscribe: function()
        {
            return Ratchet.subscribe.apply(this, arguments);
        },

        unsubscribe: function()
        {
            return Ratchet.unsubscribe.apply(this, arguments);
        },

        observable: function()
        {
            return Ratchet.observable.apply(this, arguments)
        },

        clearObservable: function()
        {
            return Ratchet.clearObservable.apply(this, arguments);
        },

        dependentObservable: function()
        {
            return Ratchet.dependentObservable.apply(this, arguments);
        },




        /////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // EVENT HANDLERS - manufacturing methods (produce handlers)
        //
        /////////////////////////////////////////////////////////////////////////////////////////////////


        /**
         * Produces a refresh handler that reloads this gadget with the last
         * dispatched method, uri and data.
         *
         * @param gadget
         * @param route
         */
        refreshHandler: function(el)
        {
            return function(el)
            {
                return function()
                {
                    /**
                     * PROBLEM: the issue is that gadgets are bound to ratchets when they instantiate
                     * They hold this reference to the ratchet and the reference is further passed into the
                     * RenderContext object.
                     *
                     * Thus, when you do something like shown below, this dispatches against the original ratchet().
                     *
                     * However, if someone runs a route() such as when a page runs route "/security" from "/", this
                     * causes the top most ratchet to reload all of its child ratchets and do its whole
                     * process subgadgets thing.
                     *
                     * When it does this, it first tears down any existing ratchets and destroys and gadget instances.
                     * And then it rebuilds everything by walking the [gadget] tags and reinstantiating any gadgets.
                     *
                     * The original reference (hit from below) is bound to the wrong div element.
                     *
                     * Should there be any notion of gadgets not being destroyed until they go off-page?
                     *
                     * --
                     *
                     * the toolbar is originally ratchet-6
                     *
                     * by the time we click through a few pages, the toolbar ratchet has been updated to toolbar-24 or something
                     * however, the el used by the observer is still bound to ratchet-6!
                     *
                     * if things are working correctly, the subscriber should be shut down and re-created against the new
                     * ratchet each time.
                     *
                     * q: is this happening and if so, is it somehow using the old ratchet?  why?
                     *
                     * problem: the old ratchet has an old DOM element that isn't applicable anymore!
                     * so things get written into nowhere/nothingness
                     *
                     *
                     *
                     */
                    el.run(el.route.method, el.route.uri, el.route.data);
                };

            }(el);
        },




        /////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // DISPATCH METHODS
        //
        /////////////////////////////////////////////////////////////////////////////////////////////////

        /**
         * @param [String] method assumes GET
         * @param {String} uri
         * @param [Object] data
         */
        run: function()
        {
            this.ratchet().run.apply(this.ratchet(), arguments);
        },



        /////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // ROUTE CREATION METHODS
        //
        // NOTE: routes always register with the gadget's ratchet
        // this means that URI routing is always gadget-relative
        //
        //    /a/b/c may mean one thing to gadget #1 and something else to gadget #2
        //
        // NOTE: these methods make sure to wrap the handler in a closure so that "this" is the gadget
        //
        /////////////////////////////////////////////////////////////////////////////////////////////////

        get: function()
        {
            var array = Ratchet.makeArray(arguments);
            array.push(this);

            this.ratchet().get.apply(this.ratchet(), array);
        },

        post: function()
        {
            var array = Ratchet.makeArray(arguments);
            array.push(this);

            this.ratchet().post.apply(this.ratchet(), array);
        },

        put: function(uri, handler)
        {
            var array = Ratchet.makeArray(arguments);
            array.push(this);

            this.ratchet().put.apply(this.ratchet(), array);
        },

        del: function(uri, handler)
        {
            var array = Ratchet.makeArray(arguments);
            array.push(this);

            this.ratchet().del.apply(this.ratchet(), array);
        },



        /////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // SELECTORS AND DOM MANIPULATION
        //
        /////////////////////////////////////////////////////////////////////////////////////////////////

        select: function(selector)
        {
            return this.ratchet().select(selector);
        }

    });

})(jQuery);