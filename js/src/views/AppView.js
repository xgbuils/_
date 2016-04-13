(function (root) {
    root.AppView = Backbone.View.extend({
        initialize: function () {
            var viewsConfig = {
                select_word: { 
                    modeHandler: function (mode) {
                        return {
                            right: 'your_name'
                        }[mode];
                    },
                    index: 0
                },
                your_name: {
                    modeHandler: function (mode) {
                        return {
                            right: 'phone',
                            left: 'select_word'
                        }[mode];
                    },
                    index: 1
                },
                phone: {
                    modeHandler: function (mode) {
                        return {
                            right: 'date',
                            left: 'your_name'
                        }[mode];
                    },
                    index: 2
                },
                date: {
                    modeHandler: function (mode) {
                        return {
                            left: 'phone'
                        }[mode];
                    },
                    index: 3
                },
                keyboard: {
                    modeHandler: function (mode) {

                    },
                }
            };
            this.currentView = 'select_word'
            var self = this
            var model = this.model

            Mousetrap.bind('left', _.partial(this.left, _, this))
            Mousetrap.bind('up', _.partial(this.up, _, this))
            Mousetrap.bind('right', _.partial(this.right, _, this))
            Mousetrap.bind('down', _.partial(this.down, _, this))
            Mousetrap.bind('enter', _.bind(this.select, this))

            $(document).on('keyup', 'input,textarea', function (e) {
                if (e.which === keysCodes.ENTER) {
                    Mousetrap.trigger('enter')
                }
            })
    
            $(document).on('cursor:first', 'input,textarea', function (e) {
                if (!e.cursorChanged) {
                    $(e.target).blur()
                    self.left(e, self)
                }
            })

            $(document).on('cursor:last', 'input,textarea', function (e) {
                if (!e.cursorChanged) {
                    $(e.target).blur()
                    self.right(e, self)
                }
            })

            Backbone.on('layer:next', function (name, mode) {
                var nextView = viewsConfig[name].modeHandler(mode)
                if (typeof nextView === 'string') {
                    this.currentView = nextView
                }
                this.focus(viewsConfig[this.currentView].index)
                Backbone.trigger(this.currentView + ':focus')
            }, this);

            Backbone.on('layer:focus', function (layerName) {
                this.currentView = layerName
                Backbone.trigger(layerName + ':focus')
            }, this);

            model.on('change:status', this.render, this)
        },
        focus: function (index) {
            var position = (-100 * index)
            console.log(position + '%')
            this.$el.css('left', position + '%')
        },
        el: '.app',
        left: function (event, view) {
            preventDefault(event)
            Backbone.trigger(view.currentView + ':left')
        },
        up: function (event, view) {
            preventDefault(event)
            Backbone.trigger(view.currentView + ':up')
        },
        right: function (event, view) {
            preventDefault(event)
            Backbone.trigger(view.currentView + ':right')
        },
        down: function (event, view) {
            preventDefault(event)
            Backbone.trigger(view.currentView + ':down')
        },
        select: function (event) {
            preventDefault(event)
            Backbone.trigger(this.currentView + ':select')
        }
    })

    function preventDefault(event) {
    	event && typeof event.preventDefault === 'function' && event.preventDefault()
    }
})(window)