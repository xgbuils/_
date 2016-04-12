(function (root) {
    root.TextView = BaseView.extend({
        initialize: function (options) {
            this.name = options.name;
            this.index = -1
            this.addSelectors()

            Backbone.on(this.name + ':focus', function () {
                this.move('right')()
            }, this)
    
            Backbone.on(this.name + ':next', this.move('right'), this)
            Backbone.on(this.name + ':previous', this.move('left'), this)
            Backbone.on(this.name + ':select', this.select, this)
        },
        selectors: {
            input: '.text_input',
            keyboard: '.keyboard',
            ok: '.ok'
        },
        nextItem: function (mode) {
        	console.log('NEXT ITEM')
            var flow = ['input', 'keyboard', 'ok']
            var mapToIncr = {
                left: -1,
                right: 1
            }
            this.index += mapToIncr[mode]
            return this.$selectors[flow[this.index]]
        },
        firstItem: function () {
        	console.log('FIRST ITEM')
            this.index = 0
            return this.$selectors.input
        },
        focus: function ($newItem) {
            var $input = $newItem.find('input,textarea,select').first()
            if ($input.length === 0) {
                $input = $newItem
            }
            _.delay(function () {
                $input.focus()
            }, 450);
        },
        select: function () {
            var $selectors = this.$selectors
            if ($selectors.activeItem === $selectors.input &&
                $selectors.activeItem.val().length === 0 || 
                $selectors.activeItem === $selectors.keyboard) {
                console.log('show keyboard')
                Backbone.trigger('keyboard:focus')
            } else {
                console.log('set value "' + $selectors.input.val() + '" in model')
            }
        }
    })
})(window);