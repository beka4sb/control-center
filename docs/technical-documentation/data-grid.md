# Component - DataGrid

The dataGrid component mostly uses the [MUI DataGrid component](https://mui.com/x/api/data-grid/data-grid/) with a few custom additions.

## Basic Usage

### Remote Data

Refer to [TableState](#table-state) to learn what is available for pagination, sorting and filtering etc.

```typescript
const MyTable = () => {
  /**
   * Define the columns you want the table to display.
   */
  const columns: Column[] = [
    /** Use valueGetter to have more control over what the cell displays. */
    { field: 'id', headerName: 'ID', valueGetter: ({ row }) => row.getId() },
    /** Use field if row is simple object. */
    { field: 'type', headerName: 'Type' },
    { field: 'name', headerName: 'Name' },
  ];

  const fetchData: FetchData = (tableState) => {
    /**
     * Fetching logic goes here and can use tableState to determine what data
     * is to be fetched.
     *
     * Return rows to update what is visible in the table.
     *
     */
    return { pageInfo, rowCount, rows };
  };

  return <DataGrid columns={columns} fetchData={fetchData} />;
};
```

### Local Data

To make it locally data driven, just remove the `fetchData` method and pass the `rows` prop.

## Table state

```typescript
export interface TableState {
  // refer to MUI for sortModel information
  sortModel?: GridSortModel;
  pagination: Pagination;
  filter?: Combiner;
}
```

**Links**

- [SortModel](https://mui.com/x/react-data-grid/sorting/#structure-of-the-model)
- [Filters](#filtering)
- [Pagination](#pagination)

## Column definition

[Please refer to the MUI column definition documentation.](https://mui.com/x/react-data-grid/column-definition/)

## Custom Cells

You can use `renderCell` on the column definition to render custom cells.

The following is a list of custom cells we have already created:

- `TagCell` - used for rendering tags.
- `TooltipOverflowCell` - used for rendering cells whose content can overflow and should display a tooltip.

## Sorting

[Please refer to the MUI sorting documentation.](https://mui.com/x/react-data-grid/sorting/#structure-of-the-mode)

## Table Buttons

To render custom buttons, you can define an array of button configs which will then be rendered in the table toolbar header.

```typescript
const MyTable = () => {
  const toolbarButtons = [
    {
      label: 'Primary button',
      onClick: () => alert('primary'),
      props: { variant: 'contained' as ButtonProps['variant'] },
    },
    { label: 'Add New Project', onClick: () => alert('create new project') },
  ];

  return <DataGrid ... toolbarButtons={toolbarButtons} />;
};
```

## Pagination

Pagination can be used with either cursor based pagination or traditional pagination.

If the endCursor is present in the pageInfo info object that is returned from the fetchData promise, then the table will keep track of the endCursor as the nextCursor.

**NOTE** `rowCount` is required as a return value from the fetchData method to be able to display the count of rows in the current filtered state.

```typescript
export interface Pagination {
  page: number; // Current page for traditional pagination
  pageSize: number; // Current page size (how many rows you want to see)
  nextCursor?: string; // Next cursor to retrieve rows from
}
```

## Filtering

Filtering is enabled by providing a `filterConfigs` array containing a list of `FilterConfiguration`s.

```typescript
export interface FilterConfigOption {
  value: string; // Value
  label: string; // Display label
}

export interface FilterConfiguration {
  filterKey: string; // The field of the record to be filtered by (e.g. createdAt or type etc.)
  label: string; // Human readable label
  type?: FilterValueInputType; // The input type of the value to be filtered
  options?: Option[]; // Options to be passed to a select if value type is select
  operators?: Operator[]; // Not implemented - was intended to be used as a custom configuration of the operators used in the operation select.
}

// e.g filterConfigs
const filterConfigs = [
  {
    filterKey: 'type',
    label: t('type'),
    type: FilterValueInputType.Select,
    options: [
      { value: KeyType.RSA, label: 'RSA' },
      { value: KeyType.DSA, label: 'DSA' },
      { value: KeyType.EC, label: 'EC' },
      { value: KeyType.DH, label: 'DH' },
      { value: KeyType.PASSWORD_BASED, label: t('passwordBased') },
      { value: KeyType.SYMMETRIC, label: t('symmetric') },
    ],
  },
  {
    filterKey: 'length',
    label: t('keyLength'),
    type: FilterValueInputType.String,
  },
];
```

The filter sent to the backend have a specific recursive structure and looks like the following:

This is equivalent to:
`WHERE firstName = 'James' and (lastName = 'Smith' OR lastName = 'Bond')`

```json
{
  "operator": "AND",
  "subFilters": [
    {
      "value": "James",
      "operation": "EQ",
      "field": "firstName"
    },
    {
      "operator": "OR",
      "subFilters": [
        {
          "value": "Smith",
          "operation": "EQ",
          "field": "lastName"
        },
        {
          "value": "Bond",
          "operation": "EQ",
          "field": "lastName"
        }
      ]
    }
  ]
}
```
