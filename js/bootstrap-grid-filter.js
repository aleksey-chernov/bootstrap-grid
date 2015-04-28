;
(function($) {
  "use strict";

  function TextFilter(settings, container, onChange) {
    this.field = settings.field;

    this.input = $("<input type='text'>")
      .addClass("input-medium search-query")
      .attr("placeholder", settings.title)
      .on("input", onChange)
      .appendTo(container);
  };

  TextFilter.prototype.getValue = function() {
    return this.input.val();
  };

  function DateFilter(settings, container, onChange) {
    this.field = settings.field;

    this.date = null;

    var that = this;
    this.input = $("<input type='text' readonly='readonly'>")
      .addClass("input-medium search-query")
      .css("cursor", "pointer")
      .attr("placeholder", settings.title)
      .appendTo(container)
      .datepicker({
        format: "dd.mm.yyyy",
        language: "ru",
        autoclose: true,
        todayHighlight: true,
        clearBtn: true
      })
      .on("changeDate", function (event) {
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
  DateFilter.prototype.getValue = function() {
    return this.date;
  };

  function DateRangeFilter(settings, container, onChange) {
    this.field = settings.field;

    this.startDate = this.endDate = null;

    var that = this;
    this.input = $("<input type='text' name='daterange' readonly='readonly'>")
      .addClass("input-medium search-query")
      .css("cursor", "pointer")
      .attr("placeholder", settings.title)
      .appendTo(container)
      .daterangepicker({
        format: "DD.MM.YYYY",
        startDate: moment().subtract(29, "days"),
        endDate: moment(),
        minDate: "01.01.2010",
        maxDate: "31.12.2020",
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
          applyLabel: "Применить",
          cancelLabel: "Отмена",
          fromLabel: "",
          toLabel: "",
          customRangeLabel: "Custom",
          daysOfWeek: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
          monthNames: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
          firstDay: 1
        }
      })
      .on("apply.daterangepicker", function(event, picker) {
        that.startDate = picker.startDate.format("YYYY-MM-DD");
        that.endDate = picker.endDate.format("YYYY-MM-DD");
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

  DateRangeFilter.prototype.getValue = function() {
    return { startDate: this.startDate, endDate: this.endDate }
  };

  function MultiselectFilter(settings, container, onChange) {
    this.field = settings.field;

    this.input = $("<select multiple>")
      .appendTo(container)
      .addClass("input-medium search-query")
      .multiselect({
        buttonWidth: "150px",
        buttonText: function() { return "Загрузка..."; }
      });

    $.ajax({
      url: settings.url,
      context: this,
      success: function(data) {
        var that = this;
        $.each(data.List, function(index, item) {
          $("<option value='" + item.Value + "'>" + item.Text + "</select>")
            .appendTo(that.input);
        });
        that.input
          .change(onChange)
          .multiselect("destroy")
          .multiselect({
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
            }
          });
      }
    });
  };

  MultiselectFilter.prototype.getValue = function() {
    var result = [];
    $("option:selected", this.input).each(function() {
      result.push($(this).val());
    });

    return result;
  };

  $.extend($.fn.bootstrapGrid.defaultSettings, {
    filters: []
  });

  $.extend($.fn.bootstrapGrid.locales, {

  });

  var Display = $.fn.bootstrapGrid.display,
    Grid = $.fn.bootstrapGrid.grid;

  Grid.prototype.defaultFilter = {
    field: undefined,
    title: undefined,
    url: undefined,
    type: "text"
  };

  Display.prototype.filtersMap = {
    "text": TextFilter,
    "date": DateFilter,
    "daterange": DateRangeFilter,
    "multiselect": MultiselectFilter
  };
  Display.prototype.filters = [];
  Display.prototype.filtersTimeout = 0;
  Display.prototype.initFilter = function() {
    var that = this;

    $.each(this.grid.settings.filters, function(index, filterSettings) {
      that.grid.settings.filters[index] = $.extend({}, that.grid.defaultFilter, filterSettings);
    });

    var onFilterChange = function() {
      clearTimeout(that.filtersTimeout);
      that.filtersTimeout = setTimeout(function() {
        that.grid.filter = {};
        $.each(that.filters, function(index, filter) {
          that.grid.filter[filter.field] = filter.getValue();
        });
        that.grid.pageIndex = 1;
        that.grid.getData();
      }, 100);
    };

    if (this.grid.settings.filterable) {
      var filterContainer = $("<div>")
        .addClass("bootstrap-grid-filter");
      this.toolbar.append(filterContainer);

      $.each(this.grid.settings.filters, function(index, filterSettings) {
        if (filterSettings.field) {
          var Filter = that.filtersMap[filterSettings.type];

          if (Filter) {
            var filter = new Filter(filterSettings, filterContainer, onFilterChange);
            that.filters.push(filter);
          }
        }
      });
    }
  };
})(jQuery);