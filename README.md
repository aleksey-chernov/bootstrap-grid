# bootstrap-grid
Simple datagrid for Bootstrap 2. Data source can be set only by providing remote server Url.

## Grid options
The default options are defined in jQuery.fn.bootstrapGrid.defaultSettings.

* **url** Remote server Url to request data from. Default: undefined.
* **columns** Array of columns configuration. Default: [].
* **columnsSelect** True to show columns hide/show multiselect menu in tools panel. Default: false.
* **refreshable** True to show refresh button in tools panel. Default: false.
* **width** Set grid width in pixels or percents. Default: "auto".
* **height** Set grid height in pixels. Default: 400.
* **rowHeight** Set fixed height for every grid row. Default: undefined.
* **tableStyle** Set classes for bootstap-grid table. Default: "table table-hover".
* **filterable** True to show simple filter. Url parameter name, which contains filter value: filter. Default: false.
