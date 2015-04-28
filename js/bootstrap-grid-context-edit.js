;
(function($) {
  "use strict";

  var onContextMenu = function (event) {
    event.preventDefault();

    var display = event.data.display;
    var item = $(this).data("item");
    
    display.contextMenu.hide();

    var bodyOffset = display.body.offset();
    display.contextMenu.css({
      left: event.pageX - bodyOffset.left + 5,
      top: event.pageY - bodyOffset.top + display.head.outerHeight() + 10
    }).fadeIn();

    display.grid.selectedItem = item;
  };

  $.extend($.fn.bootstrapGrid.defaultSettings, {
    editableContext: false,
    OnRowContextAdd: function() {
      return false;
    },
    OnRowContextEdit: function(item) {
      return false;
    },
    OnRowContextRemove: function(item) {
      return false;
    }
  });

  $.extend($.fn.bootstrapGrid.locales, {
    add: "Добавить",
    edit: "Редактировать",
    remove: "Удалить"
  });

  var Display = $.fn.bootstrapGrid.display,
    Grid = $.fn.bootstrapGrid.grid,
    displayInit = Display.prototype.init,
    displayDrawBody = Display.prototype.drawBody;

  Grid.prototype.selectedItem = undefined;

  Display.prototype.init = function() {
    displayInit.apply(this, Array.prototype.slice.apply(arguments));

    if (this.grid.settings.editableContext) {
      this.initContextMenu();
    }
  };
  Display.prototype.drawBody = function() {
    displayDrawBody.apply(this, Array.prototype.slice.apply(arguments));

    var display = this;

    if (this.grid.settings.editableContext) {
      $(display.body).on("contextmenu", "tr", {
        display: display
      }, onContextMenu);
      
      display.body.scroll(function() {
        display.contextMenu.fadeOut();
      });
      $(document).click(function() {
        display.contextMenu.fadeOut();
      });
    }
  };
  Display.prototype.initContextMenu = function () {
    var that = this;

    this.contextMenu = $("<div class='dropdown'>")
      .addClass("bootstrap-grid-contextmenu");

    var ul = $("<ul class='dropdown-menu' role='menu' />")
      .appendTo(this.contextMenu);

    $("<li>")
      .append($("<a tabindex='-1'>" + Grid.locales.add + "</a>").click(function() {
        if (that.grid.settings.OnRowContextAdd)
          that.grid.settings.OnRowContextAdd.call(null);
      }))
      .appendTo(ul);
    $("<li>")
      .append($("<a tabindex='-1'>" + Grid.locales.edit + "</a>").click(function() {
        if (that.grid.settings.OnRowContextEdit)
          that.grid.settings.OnRowContextEdit.call(null, that.grid.selectedItem);
      }))
      .appendTo(ul);
    $("<li>")
      .append($("<a tabindex='-1'>" + Grid.locales.remove + "</a>").click(function() {
        if (that.grid.settings.OnRowContextRemove)
          that.grid.settings.OnRowContextRemove.call(null, that.grid.selectedItem);
      }))
      .appendTo(ul);

    this.contextMenu.append(ul);
    this.container.append(this.contextMenu);
  };
})(jQuery);