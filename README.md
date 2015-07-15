# bootstrap-grid
The purpose of this project is educational in general, but the result can be used in "real-life" projects.
It provides the simple and light datagrid for Bootstrap 2, which packaged as jQuery extension. The datagrid requests a data from a remote server in json format. It lacks a lot of features, but can be easily extended by plugins.
If you think to use this stuff, you better look at https://github.com/wenzhixin/bootstrap-table. Because it is much better and well supported. I took some cool features from the bootstrap-table, but tried to keep things simplier, because I do not need a ton of options for my grid, and I want to control my code better.

## Grid options
The default options are defined in jQuery.fn.bootstrapGrid.defaultSettings.

* **url** Set the remote server url to request a data from. Default: undefined.
* **columns** The array of columns configurations. Default: [].
* **columnsSelect** True to show the columns hide/show multiselect menu in tools panel. Default: false.
* **refreshable** True to show the refresh button in tools panel. Default: false.
* **width** Set the grid width in pixels or percents. Default: "auto".
* **height** Set the grid height in pixels. Default: 400.
* **rowHeight** Set the fixed height for every grid row. Default: undefined.
* **tableStyle** Set classes for the bootstap-grid table. Default: "table table-hover".
* **filterable** True to show the simple filter. The url parameter name, which contains the filter value: filter. Default: false.
* **filterTimeout** Set the filter debounce timeout in ms. The filter callback fires on "input" event or on "keyup" event in IE. Default: 500.
* **pageable** True to enable pagination. Only server side pagination is available. Url parameters for pagination: pageIndex, pageSize. Default: false.
* **pageList** If pageable is true, inits the page size selecting list. Default: [ {name: 10, size: 10}, {name: 25, size: 25}, {name: 50, size: 50}, {name: 100, size: 100} ].
* **pageLinks** If pageable is true, set the number of generated page links. Default: 5.
* **exportable** True to show export select button in tools panel. Default: false.
* **onExport** If exportable is true, set callback for the export option. Default: undefined. The function signature: function (format, orderBy, filter).
* **exportList** If exportable is true, inits the export selecting list. Default: [ {name: "Excel", "xls"}, {"PDF", "pdf"} ]. Type is used as format value for onExport callback.
* **onRowDisplay** Set callback, which fires when the row is appended to the table body. Default: undefined. The function signature: function (row, item).
* **onBodyShown** Set callback, which fires when the table body is appended to the table. Default: undefined. The function signature: function ().
* **loading** Set custom html for the loading div. Default: undefined.

## Column options
The column options are defined in jQuery.fn.bootstrapGrid.defaultColumn.

* **field** Set the column field name. Default: undefined.
* **title** Set the column title text. Default: undefined.
* **width** Set width of the column in pixels or percents. Default: 0.
* **sortable** True to enable sorting for the column. The url parameter for sorting: orderBy. Default: true.
* **visible** True to show the column. Default: true.
* **hidden** True to hide the column, and hide it from the column selecting list. Default: false.
* **formatter** Set the function to format the column value. Default: undefined. The function signature: function (value, item).

## Methods
The calling method syntax: $('#grid').bootstrapGrid('method', parameter);.

* **init** Init options, load data and draw the grid. Parameters: options.
* **refresh** Reload data and redraw. Parameters: none.
* **redraw** Redraw the grid. Parameters: none.
* **setOption** Set the grid option. Parameters: option, value.
 
## Localization
Localization values are defined in jQuery.fn.bootstrapGrid.locales.

* **filterPlaceholder** Set the filter placeholder text.
* **pagerShow** Set text of the page size selecting list label.
* **pagerEntry** Set text of the page size selecting list pages.
* **loading** Set test for the loading label.
* **emptyRow** Set text for the "no rows found" message.
 
#bootstrap-grid extensions

##bootstrap-grid-filter
Extends default filter behavior. Provides 4 possible filter types: text, date, daterange and multiselect.

## Grid options
Options defined in jQuery.fn.bootstrapGrid.defaultSettings are extended with:

* **filters** The array of filters configurations. Default: [].

## Filter options
The filter options are defined in jQuery.fn.bootstrapGrid.defaultFilter.

* **field** Set the filter field name. The field value defines new property for the filter parameter, which will be sent to the remote server. Default: undefined.
* **title** Set the filter title for empty state. Default: undefined.
* **url** Set url to retrieve data from for the multiselect filter. Default: undefined.
* **type** Set the filter type. Possible values: "text", "date", "daterange", "multiselect". Default: "text".
* **visible** True to display the filter in filters div. Default: false.
* **format** Set date format for date and daterange filters. Default: "dd.mm.yyyy".
* **minDate** Set default lower bound date for the daterange filter. Default: undefined.
* **maxDate** Set default upper bound date for the daterange filter. Default: undefined.
* **language** Set locale for the date controls. Default: "ru".
* **selectAll** True to allow select all option for the multiselect filter. Default: false.
 
## Localization
Options defined in jQuery.fn.bootstrapGrid.locales are extended with:

* **dateRangeDaysOfWeek** Set week days names for the daterange filter.
* **dateRangeApply** Set apply button text for the daterange filter.
* **dateRangeCancel** Set cancel button text for the daterange filter.
* **dateRangeMonthNames** Set month names for the daterange filter.
* **multiselectLoad** Set the multiselect filter loading text.
* **multiselectAll** Set the multiselect filter select all option text.

##bootstrap-grid-contextmenu
Extends the grid with the context menu and callbacks for the context menu events.

## Grid options
Options defined in jQuery.fn.bootstrapGrid.defaultSettings are extended with:

* **editableContext** True to enable the context menu. Default: false.
* **onRowContextAdd** Set callback, which fires when add option is selected from the context menu. Default: undefined. The function signature: function ().
* **onRowContextEdit** Set callback, which fires when edit option is selected from the context menu. Default: undefined. The function signature: function (item).
* **onRowContextRemove** Set callback, which fires when delete option is selected from the context menu. Default: undefined. The function signature: function (item).
* **onRowContextCopy** Set callback, which fires when copy option is selected from the context menu. Default: undefined. The function signature: function (item).

## Localization
Options defined in jQuery.fn.bootstrapGrid.locales are extended with:

* **add** Set add option text for the context menu.
* **edit** Set edit option text for the context menu.
* **remove** Set remove option text for the context menu.
* **copy** Set copy option text for the context menu.
