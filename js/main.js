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
        name: 'your_name',
        associatedKeyboard: 'keyboard'
    })
    var keyboardView = new KeyboardView({
    	el: '.keyboard-container',
    	name: 'keyboard',
    	keys: [['a', 'b', 'c'], ['d', 'e', 'f']]
    })
}
