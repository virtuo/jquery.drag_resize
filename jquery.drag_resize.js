/*! Minimalistic Drag and Resize plugin for jQuery.
 * 
 * By Pierre Ruyssen <pierre@ruyssen.eu>.
 *
 * License: AGPL V3.0.
 * http://www.fsf.org/licensing/licenses/agpl-3.0.html
 */

/* Add the two following methods to jquery elements:
 *  - jqdrag([handle,] callback): make the element dragable.
 *  - jqresize(handle, callback): make the element resizable.
 *
 *  The callbacks are called once the drag or the resize moves are done.
 *
 *  To be draggable, an element needs to have the css position property
 *  set to 'relative' or 'absolute'.
 */

(function($){
  var Max = Math.max,

      // Variables changing on events
      // It should be safe to place them here
      // as it is improbable to have two
      // drag or resize in the same time (if we only have on mouse)!
      
      m_current_element, // element being dragged / resized
      m_left,
      m_top,
      m_width,
      m_height,
      m_opacity,
      m_pagex,
      m_pagey,
      m_drag,


  dragresize = function(event){
    if (m_drag) {
      m_current_element.css({
        left: m_left + event.pageX - m_pagex,
        top: m_top + event.pageY - m_pagey
      })
    }
    else {
      m_current_element.css({
        width: Max(event.pageX - m_pagex + m_width, 0),
        height: Max(event.pageY - m_pagey + m_height, 0)
      });
    }
  },

  stop = function(element, callback){
    m_current_element.css("opacity", m_opacity);
    $(window).unbind('mousemove', dragresize).unbind('mouseup', stop);
    callback && callback(element);
  },

  
  activate_dragresize = function(element, handle, drag, callback) {
    /*
     * Arguments:
     *  - element:
     *  - handle:
     *  - drag: true if dragging, false if resizing.
     * */
    handle = (handle)? $(handle, element) : element;
    handle.mousedown(function(event){
      var position = element.position();
      m_current_element = element;
      m_left = position.left;
      m_top = position.top;
      m_width = element.width();
      m_height = element.height();
      m_pagex = event.pageX;
      m_pagey = event.pageY;
      m_drag = drag;
      m_opacity = element.css("opacity");

      element.css("opacity", 0.8);
      $(window).mousemove(dragresize).mouseup(function() {
        stop(element, callback);
      });
      return false;
    });
    return element;
  };

  $.fn.jqdrag = function(handle, callback){
    /* Make the element draggable by the specified handle.
     *
     * Arguments:
     *  - handle: optional, jquery selector. The handle
     *    that can move the element.
     *  - callback: a function to be called once the element has been moved.
     *    The callback is given the element as argument.
     * */
    if(!callback) {
      callback = handle;
      handle = 0;
    }
    return activate_dragresize(this, handle, 1, callback);
  };

  $.fn.jqresize = function(handle, callback){
    /* Make the element resizable using the given handle
     *
     * Arguments:
     *  - handle: jquery selector, the handle that resizes
     *    the element when moved.
     *  - callback: a function to call once the element has been resized.
     *    The callback is given the element as argument.
     * */
    return activate_dragresize(this, handle, 0, callback);
  };

})(jQuery);

