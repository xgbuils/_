(function (root) {
    root.KeyboardView = BaseView.extend({
        initialize: function (options) {
            this.name = options.name
            this.keys = options.keys
            this.pos = [0, 0];
            this.render()
            this.addSelectors();
            var $key = this.getKey(this.pos)
            $key.addClass('active')
            this.$selectors.activeItem = $key

            Backbone.on(this.name + ':focus', function () {
                this.$el.addClass('active')
            }, this)

            Backbone.on(this.name + ':left', this.move('left'), this)
            Backbone.on(this.name + ':up', this.move('up'), this)
            Backbone.on(this.name + ':right', this.move('right'), this)
            Backbone.on(this.name + ':down', this.move('down'), this)
        },
        nextItem: function (mode) {
        	var mov = {
        		left: [0, -1],
        		up: [-1, 0],
        		right: [0, 1],
        		down: [1, 0]
        	}[mode];
        	var pos = this.pos
        	pos[0] += mov[0]
        	pos[1] += mov[1]
        	if (pos[0] < 0) {
        		pos[0] = 0
        	} else if (pos[0] >= this.keys.length) {
        		pos[0] = this.keys.length - 1
        	}
        	var row = this.keys[pos[0]]
        	if (pos[1] < 0) {
        		pos[1] = 0
        	} else if (pos[1] >= row.length) {
        		console.log(row)
        		pos[1] = row[pos[0]].length - 1
        	}
            return this.getKey(this.pos)
        },
        firstItem: function () {
            return this.$el.find('.selector').first()
        },
        selectors: {
            keyboard: '.keyboard'
        },
        getKey: function (pos) {
            var $keyboard = this.$selectors.keyboard
            var $row = $($keyboard.children().get(pos[0]))
            var $key = $($row.children().get(pos[1]))
            return $key
        },
        render: function () {
            $keyboard = $('<div/>').attr({
                'class': 'keyboard',
            })
            _.each(this.keys, function (keysRow) {
                var $keyRow = $('<div/>').attr({
                    'class': 'keyboard__row kite'
                })
                _.each(keysRow, function (key) {
                	var $key = $('<div/>').attr({
                		'class': 'keyboard__row__key kite__item'
                	}).text(key);
                	$keyRow.append($key)
                })
                $keyboard.append($keyRow)
            })
            this.$el.append($keyboard)
        }
    })
})(window);