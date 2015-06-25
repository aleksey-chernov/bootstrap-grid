;
(function ($) {
  "use strict";

  var onContextMenu = function (event) {
    event.preventDefault();
    event.stopPropagation();

    var display = event.data.display;
    var item = $(this).data("item");

    if (item) {
      $(".bootstrap-grid-contextmenu-edit, .bootstrap-grid-contextmenu-remove", display.contextMenu)
        .removeClass("disabled");
      display.grid.selectedItem = item;
    } else {
      $(".bootstrap-grid-contextmenu-edit, .bootstrap-grid-contextmenu-remove", display.contextMenu)
        .addClass("disabled");
      display.grid.selectedItem = undefined;
    }

    //using class selector to hide menu, in case of usage multiple grids in one page
    $(".bootstrap-grid-contextmenu").hide();

    var bodyOffset = display.body.offset();
    display.contextMenu.css({
      left: event.pageX - bodyOffset.left + 5,
      top: event.pageY - bodyOffset.top + display.head.outerHeight() + 10
    }).fadeIn();
  };

  $.extend($.fn.bootstrapGrid.defaultSettings, {
    editableContext: false,
    onRowContextAdd: undefined,
    onRowContextEdit: undefined,
    onRowContextRemove: undefined,
    onRowContextCopy: undefined
  });

  $.extend($.fn.bootstrapGrid.locales, {
    add: "Добавить",
    edit: "Редактировать",
    remove: "Удалить",
    copy: "Копировать"
  });

  var Display = $.fn.bootstrapGrid.display,
    Grid = $.fn.bootstrapGrid.grid,
    displayInit = Display.prototype.init,
    displayDrawBody = Display.prototype.drawBody;

  Grid.prototype.selectedItem = undefined;

  Display.prototype.init = function () {
    displayInit.apply(this, Array.prototype.slice.apply(arguments));

    if (this.grid.settings.editableContext) {
      this.initContextMenu();
    }
  };
  Display.prototype.drawBody = function () {
    displayDrawBody.apply(this, Array.prototype.slice.apply(arguments));

    var display = this;

    if (this.grid.settings.editableContext) {
      $(display.body).on("contextmenu", "tr:not(.empty-row)", {
        display: display
      }, onContextMenu);
    }
  };
  Display.prototype.initContextMenu = function () {
    var that = this;

    this.contextMenu = $("<div class='dropdown bootstrap-grid-contextmenu'>");

    var ul = $("<ul class='dropdown-menu' role='menu' />")
      .appendTo(this.contextMenu);

    if (this.grid.settings.onRowContextAdd) {
      $("<li class='bootstrap-grid-contextmenu-add'>")
        .append($("<a tabindex='-1'>" + Grid.locales.add + "</a>").click(function () {
          that.grid.settings.onRowContextAdd.call(null);
        }))
        .appendTo(ul);
    }
    if (this.grid.settings.onRowContextEdit) {
      $("<li class='bootstrap-grid-contextmenu-edit'>")
        .append($("<a tabindex='-1'>" + Grid.locales.edit + "</a>").click(function () {
          if(that.grid.selectedItem)
            that.grid.settings.onRowContextEdit.call(null, that.grid.selectedItem);
        }))
        .appendTo(ul);
    }
    if (this.grid.settings.onRowContextRemove) {
      $("<li class='bootstrap-grid-contextmenu-remove'>")
        .append($("<a tabindex='-1'>" + Grid.locales.remove + "</a>").click(function () {
          if(that.grid.selectedItem)
            that.grid.settings.onRowContextRemove.call(null, that.grid.selectedItem);
        }))
        .appendTo(ul);
    }
    if (this.grid.settings.onRowContextCopy) {
      ul.append("<li class='divider'>");
      $("<li class='bootstrap-grid-contextmenu-copy'>")
        .append($("<a tabindex='-1'>" + Grid.locales.copy + "</a>").click(function () {
          if(that.grid.selectedItem)
            that.grid.settings.onRowContextCopy.call(null, that.grid.selectedItem);
        }))
        .appendTo(ul);
    }

    this.contextMenu.append(ul);
    this.container.append(this.contextMenu);

    $(this.body).on("contextmenu", {
      display: this
    }, onContextMenu);

    this.body.scroll(function () {
      //using class selector to hide menu, in case of usage multiple grids in one page
      $(".bootstrap-grid-contextmenu").fadeOut();
    });
    $(document).click(function () {
      //using class selector to hide menu, in case of usage multiple grids in one page
      $(".bootstrap-grid-contextmenu").fadeOut();
    });
  };
})(jQuery);