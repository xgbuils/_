(function (root) {
    root.BaseView = Backbone.View.extend({
        addSelectors: function () {
            this.$selectors = {}
            _.each(this.selectors, function (selector, name) {
                this.$selectors[name] = this.$el.find(selector);
            }, this);
        },
        focus: function () {},
        move: function (mode) {
        	var view = this
            return function () {
                var $oldItem = view.$selectors.activeItem
                if ($oldItem && $oldItem[0]) {
                    $newItem = view.nextItem(mode, $oldItem)
                } else {
                    $newItem = view.firstItem()
                }

                if (!$newItem || !$newItem[0]) {
                    Backbone.trigger('layer:next', view.name, mode);
                } else {
                    view.$selectors.activeItem = $newItem
                    $oldItem && $oldItem.removeClass('active')
                    $newItem.addClass('active')
                    view.focus($newItem)
                }
            }
        }
    })
})(window);