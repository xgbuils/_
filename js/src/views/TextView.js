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
            var x = $newItem.find('input,textarea,select').first()
            _.delay(function () {
                x.focus()
            }, 450);
        }
    })
})(window);