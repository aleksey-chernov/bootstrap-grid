# bootstrap-grid
This project purpose is educational in general, but result can be used, and actually used, in "real-life" projects.
It provides simple, light datagrid for Bootstrap 2, and created as jQuery extension. The datagrid requests data from the remote server in json format. It lacks a lot of features, but can be easily extended by plugins.
If you think to use this stuff, you better look at https://github.com/wenzhixin/bootstrap-table. Because it is much better and well supported. I took some cool features from the bootstrap-table, but tried to keep things simplier, because I do not need a ton of options for my grid, and want to control my code better.

## Grid options
The default options are defined in jQuery.fn.bootstrapGrid.defaultSettings.

* **url** Set the remote server Url to request data from. Default: undefined.
* **columns** The array of columns configurations. Default: [].
* **columnsSelect** True to show columns hide/show multiselect menu in tools panel. Default: false.
* **refreshable** True to show refresh button in the tools panel. Default: false.
* **width** Set the grid width in pixels or percents. Default: "auto".
* **height** Set the grid height in pixels. Default: 400.
* **rowHeight** Set the fixed height for every grid row. Default: undefined.
* **tableStyle** Set classes for the bootstap-grid table. Default: "table table-hover".
* **filterable** True to show the simple filter. The url parameter name, which contains filter value: filter. Default: false.
* **filterTimeout** Set the filter debounce timeout in ms. Filter callback fires on "input" event or on "keyup" event in IE. Default: 500.
* **pageable** True to enable pagination. Only the server side pagination is available. Url parameters for pagination: pageIndex, pageSize. Default: false.
* **pageList** If pageable is true, inits the page size selecting list. Default: [ {name: 10, size: 10}, {name: 25, size: 25}, {name: 50, size: 50}, {name: 100, size: 100} ].
* **pageLinks** If pageable is true, set the number of generated page links. Default: 5.
* **exportable** True to show export select button in the tools panel. Default: false.
* **onExport** If exportable is true, set callback for the export option. Default: undefined. The function signature: function (format, orderBy, filter).
* **exportList** If exportable is true, inits the export selecting list. Default: [ {name: "Excel", "xls"}, {"PDF", "pdf"} ]. Type is used as format value for onExport callback.
* **onRowDisplay** Set callback, which fires when the row is appended to the table body. Default: undefined. The function signature: function (row, item).
* **onBodyShown** Set callback, which fires when the table body is appended to the table. Default: undefined. The function signature: function ().
* **loading** Set custom html for the loading div. Default: undefined.

## Column options

The column options is defined in jQuery.fn.bootstrapGrid.defaultColumn.

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
* **loading** Set the default loading label text.
* **emptyRow** Set text for the "no rows found" message.
