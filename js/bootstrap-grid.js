;
(function($) {
  "use strict";

  var cachedScrollBarWidth = undefined;

  function getScrollBarWidth() {
    if (!cachedScrollBarWidth) {
      var inner = document.createElement("p");
      inner.style.width = "100%";
      inner.style.height = "200px";

      var outer = document.createElement("div");
      outer.style.position = "absolute";
      outer.style.top = "0px";
      outer.style.left = "0px";
      outer.style.visibility = "hidden";
      outer.style.width = "200px";
      outer.style.height = "150px";
      outer.style.overflow = "hidden";
      outer.appendChild(inner);

      document.body.appendChild(outer);
      var w1 = inner.offsetWidth;
      outer.style.overflow = "scroll";
      var w2 = inner.offsetWidth;
      if (w1 === w2) w2 = outer.clientWidth;

      document.body.removeChild(outer);

      cachedScrollBarWidth = w1 - w2;
    }

    return cachedScrollBarWidth;
  };

  function Grid(el, settings) {
    this.display = new Display(el, this);

    this.settings = settings;

    this.data = [];
    this.pages = [];
    this.pageIndex = 1;
    this.pageSize = this.settings.pageList[0].size;
    this.orderBy = undefined;
    this.filter = undefined;
    this.scroll = undefined;
  };

  Grid.defaultSettings = {
    url: undefined,
    columns: [],
    filterable: false,
    height: 400,
    tableStyle: "table table-hover",
    pageList: [
      {
        name: 10,
        size: 10
      },
      {
        name: 25,
        size: 25
      },
      {
        name: 50,
        size: 50
      },
      {
        name: 100,
        size: 100
      }
    ],
    pageLinks: 5,
    onRowDisplay: function(row, item) {
      return false;
    }
  };
  Grid.defaultColumn = {
    field: undefined,
    title: undefined,
    width: 0,
    sortable: false,
    visible: true
  };
  Grid.locales = {
    filterPlaceholder: "Поиск"
  };
  Grid.prototype.init = function() {
    this.display.init();
    this.display.drawHead();

    this.getData();
  };
  Grid.prototype.setOrderBy = function(orderBy) {
    if (orderBy != null) {
      if (this.orderBy == null || this.orderBy.name !== orderBy) {
        this.orderBy = { name: orderBy, dir: null };
      } else {
        this.orderBy.dir = this.orderBy.dir === "desc" ? null : "desc";
      }
    }
  };
  Grid.prototype.getData = function() {
    var data = {
      pageIndex: this.pageIndex,
      pageSize: this.pageSize
    };
    if (this.orderBy)
      data.orderBy = this.orderBy.dir
        ? this.orderBy.name + " " + this.orderBy.dir
        : this.orderBy.name;

    if (this.filter)
      data.filter = JSON.stringify(this.filter);

    $.ajax({
      url: this.settings.url,
      data: data,
      context: this,
      success: function(data) {
        this.data = data;
        this.initPagination(data);
        this.display.drawBody();
        this.display.drawPagination();
      }
    });
  };
  Grid.prototype.initPagination = function(data) {
    this.pages.length = 0;

    if (data.totalItems === 0 || this.pageSize === -1)
      return;

    var totalPages = Math.ceil(data.totalItems / this.pageSize);

    if (totalPages === 1)
      return;

    var lastPage = Math.ceil(this.pageIndex / this.settings.pageLinks) * this.settings.pageLinks;
    var firstPage = lastPage - (this.settings.pageLinks - 1);
    var hasPreviousPage = firstPage > 1;
    var hasNextPage = lastPage < totalPages;

    if (lastPage > totalPages) {
      lastPage = totalPages;
    }

    if (firstPage !== 1) {
      this.pages.push({ text: "<<", index: 1, enabled: true });
    }
    if (hasPreviousPage) {
      this.pages.push({ text: "<", index: this.pageIndex - 1, enabled: true });
    }
    for (var i = firstPage; i <= lastPage; i++) {
      this.pages.push({ text: i, index: i, enabled: i !== this.pageIndex });
    }
    if (hasNextPage) {
      this.pages.push({ text: ">", index: this.pageIndex + 1, enabled: true });
    }
    if (lastPage !== totalPages) {
      this.pages.push({ text: ">>", index: totalPages, enabled: true });
    }
  };

  function Display(el, grid) {
    this.el = el;
    this.grid = grid;
  };

  Display.prototype.init = function() {
    var that = this;
    this.root = $("<div>")
      .addClass("bootstrap-grid");

    this.toolbar = $("<div>")
      .addClass("bootstrap-grid-toolbar clearfix");
    this.initToolbar();

    this.pagination = $("<div>")
      .addClass("bootstrap-grid-pagination clearfix");

    this.container = $("<div>")
      .addClass("bootstrap-grid-container");

    this.head = $("<div>")
      .addClass("bootstrap-grid-header");

    this.body = $("<div>")
      .addClass("bootstrap-grid-body")
      .scroll(function() {
        that.head.scrollLeft(that.body.scrollLeft());
      });

    this.container
      .append(this.head)
      .append(this.body);
    this.root.append(this.toolbar)
      .append(this.container)
      .append(this.pagination);

    this.el.append(this.root);

    this.container.outerHeight(this.grid.settings.height -
      this.toolbar.outerHeight(true) -
      this.pagination.outerHeight(true));
  };
  Display.prototype.initToolbar = function() {
    if (this.grid.settings.filterable) {
      this.initFilter();
    }
  };
  Display.prototype.initFilter = function() {
    var that = this;

    var input = $("<input type='text'>")
      .addClass("input-medium search-query")
      .attr("placeholder", Grid.locales.filterPlaceholder);

    var timeout;
    input.on("propertychange change keyup paste input", function() {
      clearTimeout(timeout);
      timeout = setTimeout(function() {
        that.grid.filter = input.val();
        that.grid.getData();
      }, 200);
    });

    this.toolbar.append(input);
  };
  Display.prototype.drawHead = function() {
    $("table", this.header)
      .remove();

    var table = $("<table>");
    if (this.grid.settings.tableStyle) {
      table.addClass(this.grid.settings.tableStyle);
    }

    var thead = $("<thead>");
    var tr = $("<tr>");

    var that = this;
    $.each(this.grid.settings.columns, function(index, col) {
      if (col.visible) {
        tr.append($("<th>")
          .css("cursor", "pointer")
          .css("width", col.width)
          .html("<div>" + col.title + "<div/>")
          .click({ orderBy: col.field, grid: that.grid }, function(event) {
            event.data.grid.setOrderBy(event.data.orderBy);
            event.data.grid.getData();
          }));
      }
    });
    thead.append(tr);

    table.append(thead);
    this.head.append(table);

    this.body
      .css("height", "100%")
      .height(this.body.height() - this.head.height());
  };
  Display.prototype.drawBody = function() {
    this.grid.scroll = {
      left: this.body.scrollLeft(),
      top: this.body.scrollTop()
    };

    $("table", this.body).remove();

    var table = $("table", this.head).clone()
      .css("margin-top", -this.head.outerHeight());

    var tbody = $("<tbody>");

    var that = this;
    $.each(this.grid.data.items, function(index, item) {
      var tr = $("<tr>")
        .data("item", item);

      $.each(that.grid.settings.columns, function(index, col) {
        if (col.visible) {
          $("<td>").text(item[col.field])
            .appendTo(tr);
        }
      });

      tbody.append(tr);

      if (that.grid.settings.onRowDisplay) {
        that.grid.settings.onRowDisplay.call(null, tr, item);
      }
    });

    table.append(tbody);
    this.body.append(table);

    if (this.body[0].scrollHeight > this.body[0].clientHeight) {
      this.head.css("margin-right", getScrollBarWidth());
    } else {
      this.head.css("margin-right", 0);
    }

    if (this.grid.scroll) {
      this.body
        .scrollLeft(this.grid.scroll.left)
        .scrollTop(this.grid.scroll.top);
    }
  };
  Display.prototype.drawPagination = function() {
    $(this.pagination).empty();

    var that = this;

    var selector = $("<select>");
    $.each(this.grid.settings.pageList, function(index, length) {
      var option = $("<option>").val(length.size)
        .text(length.name);

      if (length.size === Number(that.grid.pageSize)) {
        option.attr("selected", "selected");
      }

      selector.append(option);
    });
    selector.change(function() {
      that.grid.pageIndex = 1;
      that.grid.pageSize = $(this).val();
      that.grid.getData();
    });

    var pagination = $("<div>")
      .addClass("pagination");
    var list = $("<ul>").appendTo(pagination);
    $.each(this.grid.pages, function(index, page) {
      var li = $("<li>").append(
        $("<a>").text(page.text)
        .click({ pageIndex: page.index, grid: that.grid }, function(event) {
          event.data.grid.pageIndex = event.data.pageIndex;
          event.data.grid.getData();
        })
        .css("cursor", "pointer"));

      if (!page.enabled)
        li.addClass("disabled");

      li.appendTo(list);
    });

    this.pagination
      .append(selector)
      .append(pagination);
  };

  var methods = {
    init: function(options) {
      var settings = $.extend(Grid.defaultSettings, options);
      $.each(settings.columns, function(index, value) {
        settings.columns[index] = $.extend({}, Grid.defaultColumn, value);
      });

      var grid = new Grid($(this), settings);
      $(this).data("bootstrap-grid", grid);
      grid.init();

      return this;
    },
    refresh: function() {
      var grid = $(this).data("bootstrap-grid");

      if (grid) {
        grid.getData();
      }
    },
    redraw: function() {
      var grid = $(this).data("bootstrap-grid");

      if (grid) {
        grid.display.drawHead();
        grid.display.drawBody();
      }
    }
  };

  $.fn.bootstrapGrid = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === "object" || !method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error("Can't find method: " + method);
    }
  };

  $.fn.bootstrapGrid.grid = Grid;
  $.fn.bootstrapGrid.display = Display;
  $.fn.bootstrapGrid.defaultSettings = Grid.defaultSettings;
  $.fn.bootstrapGrid.defaultColumn = Grid.defaultColumn;
  $.fn.bootstrapGrid.locales = Grid.locales;
  $.fn.bootstrapGrid.methods = methods;
})(jQuery);