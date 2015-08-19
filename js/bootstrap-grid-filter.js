;
(function($) {
  "use strict";

  function TextFilter(settings, container, onChange) {
    this.field = settings.field;

    this.input = $("<input class='input-medium search-query' type='text' placeholder='" + settings.title + "'>")
      .on("input", onChange)
      .appendTo(container)
      .placeholder();

    if (navigator.userAgent.indexOf("MSIE") !== -1) {
      this.input.keyup(function (e) {
        var charCode = e.which || e.keyCode;
        if (!((charCode === 9) || (charCode === 16)))
          onChange();
      });
    }
  };

  TextFilter.prototype.getValue = function () {
    if (!this.hidden) {
      return this.input.val();
    }
  };
  TextFilter.prototype.show = function() {
    this.input.css("display", "inline-block");
    this.hidden = false;
  };
  TextFilter.prototype.hide = function() {
    this.input.css("display", "none");
    this.hidden = true;
  };

  function DateFilter(settings, container, onChange) {
    this.field = settings.field;

    this.date = null;

    var that = this;
    this.input = $("<input class='input-medium search-query' type='text' readonly='readonly' placeholder='" + settings.title + "'>")
      .css("cursor", "pointer")
      .appendTo(container)
      .placeholder()
      .datepicker({
        format: settings.format,
        language: settings.language,
        autoclose: true,
        todayHighlight: true,
        clearBtn: true
      })
      .on("changeDate", function(event) {
        var year = event.date.getFullYear();
        var month = that.padMonth(event.date.getMonth() + 1);
        var day = event.date.getDate();
        that.date = year + "-" + month + "-" + day;
        onChange();
      })
      .on("clearDate", function() {
        that.date = null;
        onChange();
      });
  }

  DateFilter.prototype.padMonth = function(n) {
    return (n < 10) ? ("0" + n) : n;
  };
  DateFilter.prototype.getValue = function () {
    if (!this.hidden) {
      return this.date;
    }
  };
  DateFilter.prototype.show = function() {
    this.input.css("display", "inline-block");
    this.hidden = false;
  };
  DateFilter.prototype.hide = function() {
    this.input.css("display", "none");
    this.hidden = true;
  };

  function DateRangeFilter(settings, container, onChange) {
    this.field = settings.field;

    this.startDate = this.endDate = null;

    var that = this;
    this.input = $("<input class='input-medium search-query' type='text' name='daterange' placeholder='" + settings.title + "' readonly='readonly'>")
      .css("cursor", "pointer")
      .appendTo(container)
      .placeholder()
      .daterangepicker({
        format: settings.format,
        startDate: moment().subtract(29, "days"),
        endDate: moment(),
        minDate: settings.minDate,
        maxDate: settings.maxDate,
        showDropdowns: true,
        showWeekNumbers: false,
        timePicker: false,
        timePickerIncrement: 1,
        timePicker12Hour: true,
        opens: "right",
        drops: "down",
        buttonClasses: ["btn btn-mini"],
        applyClass: "btn-primary",
        cancelClass: "btn-default",
        separator: "-",
        locale: {
          applyLabel: Grid.locales.dateRangeApply,
          cancelLabel: Grid.locales.dateRangeCancel,
          fromLabel: "",
          toLabel: "",
          customRangeLabel: "Custom",
          daysOfWeek: Grid.locales.dateRangeDaysOfWeek,
          monthNames: Grid.locales.dateRangeMonthNames,
          firstDay: 1
        }
      })
      .on("apply.daterangepicker", function(event, picker) {
        that.startDate = picker.startDate.format("YYYY-MM-DD 00:00:00");
        that.endDate = picker.endDate.format("YYYY-MM-DD 23:59:59");
        onChange();
      })
      .on("cancel.daterangepicker", function() {
        that.input.val("");
        that.startDate = that.endDate = null;
        onChange();
      })
      .on("show.daterangepicker", function() {
        that.input.data("daterangepicker").updateCalendars();
      });
  };

  DateRangeFilter.prototype.getValue = function () {
    if (!this.hidden) {
      return { startDate: this.startDate, endDate: this.endDate }
    }
  };
  DateRangeFilter.prototype.show = function() {
    this.input.css("display", "inline-block");
    this.hidden = false;
  };
  DateRangeFilter.prototype.hide = function() {
    this.input.css("display", "none");
    this.hidden = true;
  };

  function MultiselectFilter(settings, container, onChange) {
    this.field = settings.field;

    this.input = $("<select class='bootstrap-grid-col-select' multiple>")
      .appendTo(container)
      .multiselect({
        buttonText: function() { return Grid.locales.multiselectLoad; }
      });

    $.ajax({
      url: settings.url,
      context: this,
      success: function(data) {
        var that = this;
        $.each(data.List, function(index, item) {
          $("<option value='" + item.Value + "'>" + item.Text + "</option>")
            .appendTo(that.input);
        });
        that.input
          .change(onChange)
          .multiselect("destroy")
          .multiselect({
            enableFiltering: settings.multiselectFiltering,
            filterPlaceholder: Grid.locales.multiselectFilter,
            includeSelectAllOption: settings.selectAll,
            selectAllText: Grid.locales.multiselectAll,
            maxHeight: 200,
            buttonWidth: "180px",
            buttonContainer: "<div class='btn-group'>",
            buttonText: function(options) {
              if (options.length === 0) {
                return settings.title;
              } else {
                var labels = [];
                options.each(function() {
                  if ($(this).attr("label") !== undefined) {
                    labels.push($(this).attr("label"));
                  } else {
                    labels.push($(this).html());
                  }
                });
                return labels.join(", ") + "";
              }
            },
            templates: {
              filter: "<li class='multiselect-item filter'>" +
              "<div class='input-group'>" +
              "<input class='form-control multiselect-search' type='text'>" +
              "</div>" +
              "</li>",
              filterClearBtn: ""
            }
          });

        if (that.hidden) {
          that.input.next().css("display", "none");
        }
      }
    });
  };

  MultiselectFilter.prototype.getValue = function () {
    if (!this.hidden) {
      var result = [];
      $("option:selected", this.input).each(function() {
        result.push($(this).val());
      });

      return result;
    }
  };
  MultiselectFilter.prototype.show = function() {
    this.input.next().css("display", "inline-block");
    this.hidden = false;
  };
  MultiselectFilter.prototype.hide = function() {
    this.input.next().css("display", "none");
    this.hidden = true;
  };

  $.extend($.fn.bootstrapGrid.defaultSettings, {
    filters: []
  });

  $.extend($.fn.bootstrapGrid.locales, {
    dateRangeDaysOfWeek: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
    dateRangeApply: "Применить",
    dateRangeCancel: "Отмена",
    dateRangeMonthNames: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
    multiselectLoad: "Загрузка...",
    multiselectAll: "Выбрать все",
    multiselectFilter: "Поиск"
  });

  var Display = $.fn.bootstrapGrid.display,
    Grid = $.fn.bootstrapGrid.grid;

  Grid.prototype.defaultFilter = {
    field: undefined,
    title: undefined,
    url: undefined,
    type: "text",
    visible: false,
    format: "dd.mm.yyyy",
    minDate: undefined,
    maxDate: undefined,
    language: "ru",
    selectAll: false,
    multiselectFiltering: false
  };

  Display.prototype.filtersMap = {
    "text": TextFilter,
    "date": DateFilter,
    "daterange": DateRangeFilter,
    "multiselect": MultiselectFilter
  };

  Display.prototype.initFilter = function() {
    var that = this;

    this.filters = {};
    this.filtersTimeout = 0;

    $.each(this.grid.settings.filters, function(index, filterSettings) {
      that.grid.settings.filters[index] = $.extend({}, that.grid.defaultFilter, filterSettings);
    });

    var onFilterChange = function() {
      clearTimeout(that.filtersTimeout);
      that.filtersTimeout = setTimeout(function() {
        that.grid.filter = {};
        $.each(that.filters, function(name, filter) {
          that.grid.filter[filter.field] = filter.getValue();
        });
        that.grid.pageIndex = 1;
        that.grid.getData();
      }, that.grid.settings.filterTimeout);
    };

    var filterContainer = $("<div class='bootstrap-grid-filter clearfix'>"),
      filterSelectContainer = $("<div class='filter-select-container'>"),
      filterInputContainer = $("<div class='filter-input-container'>"),
      filterSelect = $("<select multiple>");

    filterSelectContainer.append(filterSelect);
    filterContainer.append(filterSelectContainer)
      .append(filterInputContainer);
    this.toolbar.append(filterContainer);

    $.each(this.grid.settings.filters, function(index, filterSettings) {
      if (filterSettings.field) {
        var Filter = that.filtersMap[filterSettings.type];

        if (Filter) {
          var filter = new Filter(filterSettings, filterInputContainer, onFilterChange);
          that.filters[filterSettings.field] = filter;

          var filterSelectOption = $("<option value='" + filterSettings.field + "'>" + filterSettings.title + "</option>");
          if (filterSettings.visible) {
            filterSelectOption.attr("selected", "selected");
          } else {
            filter.hide();
          }
          filterSelect.append(filterSelectOption);
        }
      }
    });

    filterSelect.change(function() {
        $("option:selected", filterSelect).each(function() {
          that.filters[$(this).val()].show();
        });
        $("option:not(:selected)", filterSelect).each(function() {
          that.filters[$(this).val()].hide();
        });

        onFilterChange();
      })
      .multiselect({
        templates: {
          button: "<button type='button' class='multiselect dropdown-toggle' data-toggle='dropdown'><i class='icon-filter'></i></button>"
        }
      });
  };
})
(jQuery);