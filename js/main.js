var AppProgressModel = Backbone.Model.extend({
    STATUS_NAME: [
        'select_word',
        'your_name',
        'phone',
        'date'
    ],
    defaults: {
        status: 0
    },
    initialize: function () {
        this.on('change:status', function (model) {
            var previousStatus = model.previous('status')
            var currentStatus = model.get('status')
            var changeTo = previousStatus < currentStatus ? 'next' : 'previous'

        })
    },
    nextPage: function () {
        this.set(this.get('status') + 1)
    }
})

var AppView = Backbone.View.extend({
    initialize: function () {
        var self = this
        var model = this.model

        Mousetrap.bind('left', _.partial(this.left, _, this.model))
        Mousetrap.bind('right', _.partial(this.right, _, this.model))

        $('input,textarea').on('cursor:first', function (e) {
        	if (!e.cursorChanged) {
        	    self.left(undefined, model)
        	    $(e.target).blur()
            }
        })

        Backbone.on('select_word:blur', function (mode) {
            console.log('end')
            var status = model.get('status')
            if (mode === 'right') {
                model.set('status', status + 1)
                this.right(undefined, model)
            } else {
                model.set('status', status - 1)
                this.left(undefined, model)
            }
        }, this);

        Backbone.on('your_name:blur', function (mode) {
            console.log('end')
            var status = model.get('status')
            if (mode === 'right') {
                model.set('status', status + 1)
                this.right(undefined, model)
            } else {
                model.set('status', status - 1)
                this.left(undefined, model)
            }
        }, this);

        model.on('change:status', this.render, this)

    },
    render: function (model) {
        var position = (-100 * model.get('status'))
        console.log(position + 'px')
        this.$el.css('left', position + '%')
    },
    el: '.app',
    left: function (event, model) {
        event && event.preventDefault()
        var status = model.get('status')
        Backbone.trigger(model.STATUS_NAME[status] + ':previous')
    },
    right: function (event, model) {
        event && event.preventDefault()
        var status = model.get('status')
        console.log('trigger', model.STATUS_NAME[status] + ':next')
        Backbone.trigger(model.STATUS_NAME[status] + ':next')
    }
})

var BaseView = Backbone.View.extend({
    addSelectors: function () {
        this.$selectors = {}
        _.each(this.selectors, function (selector, name) {
            console.log(selector, name)
            this.$selectors[name] = this.$el.find(selector);
        }, this);
    },
    focus: function () {},
    move: function (mode) {
        return function () {
            var $oldItem = this.$selectors.activeItem
            if ($oldItem && $oldItem[0]) {
                $newItem = this.nextItem(mode)
            } else {
                console.log('uii')
                $newItem = this.firstItem()
            }
            
            if (!$newItem || !$newItem[0]) {
                console.log('next layer', this.name + ':blur')
                Backbone.trigger(this.name + ':blur', mode);
            } else {
                this.$selectors.activeItem = $newItem
                $oldItem && $oldItem.removeClass('active')
                $newItem.addClass('active')
                this.focus($newItem)
            }
        }
    }
})

var TextView = BaseView.extend({
    initialize: function (options) {
        this.name = options.name;
        this.index = -1
        this.addSelectors()

        Backbone.on(this.name + ':next', this.move('right'), this)
        Backbone.on(this.name + ':previous', this.move('left'), this)
    },
    selectors: {
        input: '.text_input',
        keyboard: '.keyboard',
        ok: '.ok'
    },
    nextItem: function (mode) {
        var flow = ['input', 'keyboard', 'ok']
        var mapToIncr = {
            left: -1,
            right: 1
        }
        this.index += mapToIncr[mode]
        return this.$selectors[flow[this.index]]
    },
    firstItem: function () {
        this.index = 0
        return this.$selectors.input
    },
    focus: function ($newItem) {
        var x = $newItem.find('input,textarea,select').first()
        _.delay(function () {
            x.focus()
        }, 450);
    }
})

var SelectorView = BaseView.extend({
    initialize: function (options) {
        this.name = options.name
        this.addSelectors();

        Backbone.on(this.name + ':next', this.move('right'), this)
        Backbone.on(this.name + ':previous', this.move('left'), this)
    },
    move: function (mode) {
        return function () {
            var $oldItem = this.$selectors.activeItem
            if ($oldItem[0]) {
                $newItem = this.nextItem(mode, $oldItem)
            } else {
                $newItem = this.firstItem()
            }
            
            if (!$newItem[0]) {
                Backbone.trigger(this.name + ':blur', mode);
            } else {
                this.$selectors.activeItem = $newItem
                $oldItem.removeClass('active')
                $newItem.addClass('active')
            }
        }
    },
    nextItem: function (mode, $oldItem) {
        var map = {
            left: 'prev',
            right: 'next'
        }
        return $oldItem[map[mode]]()
    },
    firstItem: function () {
        return this.$el.find('.selector').first()
    },
    selectors: {
        activeItem: '.selector.active'
    }
})

$(document).ready(init)

function init () {
    var appProgressModel = new AppProgressModel()
    var appView = new AppView({
        model: appProgressModel
    })
    var selectorView = new SelectorView({
        el: '.simple_selector',
        name: 'select_word'
    })
    var textView = new TextView({
        el: '.your_name',
        name: 'your_name'
    })
}

(function (jQuery) {
    var last_position;
    jQuery(document).on("blur", 'input', function(e) {
    	last_position = undefined
    })

    jQuery(document).on("keyup click focus", 'input', function(e) {
        var position = getCursorPosition(jQuery(this));
        console.log(position, last_position)
        var cursorChanged = last_position !== position;
        last_position = position;
        var propsEvent = {
            cursorPosition: position,
            cursorChanged: cursorChanged
        }
        var value = $(e.target).val()
        var cursorEvent = jQuery.Event('cursor', propsEvent);
        jQuery(e.target).trigger(cursorEvent)
  
        if (position <= 0) {
            var cursorEventFirst = jQuery.Event('cursor:first', propsEvent);
            jQuery(e.target).trigger(cursorEventFirst)
        }
  
        if (position >= value.length) {
            var cursorEventLast = jQuery.Event('cursor:last', propsEvent);
            jQuery(e.target).trigger(cursorEventLast)
        }
    });



    function getCursorPosition(element) {
        var el = $(element).get(0);
        var pos = 0;
        if ('selectionStart' in el) {
            pos = el.selectionStart;
        } else if ('selection' in document) {
            el.focus();
            var Sel = document.selection.createRange();
            var SelLength = document.selection.createRange().text.length;
            Sel.moveStart('character', -el.value.length);
            pos = Sel.text.length - SelLength;
        }
        return pos;
    }
})($);
