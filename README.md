# bootstrap-grid
This project purpose is educational in general, but result can be used, and actually used, in "real-life" projects.
It provides simple, light datagrid for Bootstrap 2, and created as jQuery extension. Datagrid requests data from remote server in json format. It lacks a lot of features, but can be easily extended by plugins.
If you think to use this stuff, you better look at https://github.com/wenzhixin/bootstrap-table. Because it is much better and well supported. I took some cool features from bootstrap-table, but tried to keep things simplier, because I do not need a ton of options for my grid.

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
