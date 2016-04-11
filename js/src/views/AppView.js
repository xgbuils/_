(function (root) {
	console.log('AppView')
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
                }
            };
            this.currentView = 'select_word'
            var self = this
            var model = this.model

            Mousetrap.bind('left', _.partial(this.left, _, this))
            Mousetrap.bind('right', _.partial(this.right, _, this))
    
            $('input,textarea').on('cursor:first', function (e) {
                if (!e.cursorChanged) {
                    //self.left(undefined, model)
                    $(e.target).blur()
                    Mousetrap.trigger('left')
                }
            })

            $('input,textarea').on('cursor:last', function (e) {
            	console.log('last')
                if (!e.cursorChanged) {
                	console.log('inside')
                    //self.left(undefined, model)
                    $(e.target).blur()
                    Mousetrap.trigger('right')
                }
            })

            Backbone.on('layer:blur', function (name, mode) {
            	console.log('layer:blur')
                var nextView = viewsConfig[name].modeHandler(mode)
                if (typeof nextView === 'string') {
                    this.currentView = nextView
                }
                this.focus(viewsConfig[this.currentView].index)
                Backbone.trigger(this.currentView + ':focus')
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
            Backbone.trigger(view.currentView + ':previous')
        },
        right: function (event, view) {
        	console.log('eii')
            preventDefault(event)
            console.log('trigger', view.currentView + ':next')
            Backbone.trigger(view.currentView + ':next')
        }
    })

    function preventDefault(event) {
    	event && typeof event.preventDefault === 'function' && event.preventDefault()
    }
})(window)