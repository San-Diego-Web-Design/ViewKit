/**
 * Expose `NavBar`.
 */

exports.NavBar = NavBar

/**
 * Create a new `NavBar`.
 */

exports.navBar = function(target, className) {
  return new NavBar(target, className)
}

/**
 * Initialize a new `NavBar`
 */

function NavBar(target, className) {
  // grab from global scope
  this.template = mustache.to_html(template)
  $(target).addClass(className).html(template)
  events.EventEmitter.call(this)
  if (className) {
    this.className = className
  }
  this.target = target
  this.items = {
    left: [],
    right: []
  }
}

/**
 * Inherit from EventEmitter
 */

util.inherits(NavBar, events.EventEmitter)

/**
 * Injects into DOM
 */

NavBar.prototype.render = function() {
  var self = this
  var target = $(this.target)
  target.html(this.template)
  Object.keys(this.items).forEach(function(side) {
    var container = target.find('.' + side)
    container.append(self.build(side))    
  })
  
}

/**
 * returns new jQuery collection
 */

NavBar.prototype.build = function(side) {
  return this.items[side || 'left'].map(function(item) {
    return $(item.build())[0]
  })
}

/**
 * Add an item to this nav bar
 */

NavBar.prototype.add = function(item, side) {
  this.items[side || 'left'].push(item)
  this.render()
}

/**
 * Switches active/inactive classes on buttons
 */

NavBar.prototype.switchNav = function(view) {
  if (view.length === 0) return
  var on = 'sprite-' + view + '-on'
  var off = 'sprite-' + view + '-off'
  
  // TODO figure out less crappy way of doing this
  var active = $(this.target + ' .active')
  if (active.length > 0) {
    active.removeClass('active')
    active[0].className = active[0].className.split(' ').map(function(className) {
      if (className.match(/^sprite-.*-on$/)) return className.replace('-on', '-off')
      return className
    }).join(' ')
  }
  
  $(this.target + ' #' + view + '-button').addClass(on + ' active').removeClass(off)
  // TODO support multiple containers on a single page
  // $('.vk-container').attr('id', currentViewState())
}
