(function (jQuery) {
    var last_position;
    

    jQuery(document).on("blur", 'input', function(e) {
    	last_position = undefined
    })

    jQuery(document).on("keyup click focus", 'input,textarea', function(e) {
        var position = getCursorPosition(jQuery(this));
        var cursorChanged = last_position !== position;
        last_position = position;
        var propsEvent = {
            cursorPosition: position,
            cursorChanged: cursorChanged,
            which: e.which
        }
        var value = $(e.target).val()
        var cursorEvent = jQuery.Event('cursor', propsEvent);
        jQuery(e.target).trigger(cursorEvent)
    });

    jQuery(document).on('cursor', 'input,textarea', function(e) {
        var value = jQuery(e.target).val()
        var position = e.cursorPosition
        var sufix = position === 0 && [keysCodes.LEFT, keysCodes.UP].indexOf(e.which) !== -1 && 'first' || 
            position === value.length && [keysCodes.DOWN, keysCodes.RIGHT, keysCodes.TAB].indexOf(e.which) !== -1 && 'last' || ''

        if (!e.cursorChanged && sufix) {
            var cursorEvent = jQuery.Event('cursor:' + sufix, _.pick(e, 'which', 'cursorPosition', 'cursorChanged'))
            jQuery(e.target).trigger(cursorEvent)
        }
    })

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