(function (root) {
    root.SelectorView = BaseView.extend({
        initialize: function (options) {
            this.name = options.name
            this.addSelectors();

            Backbone.on(this.name + ':next', this.move('right'), this)
            Backbone.on(this.name + ':previous', this.move('left'), this)
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
})(window);
