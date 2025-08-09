import React from 'react';
import { Table as AntdTable } from 'antd';
import type { TableProps as AntdTableProps, TablePaginationConfig, ColumnType, ColumnGroupType } from 'antd/es/table';
import type { FilterValue, SorterResult, TableRowSelection } from 'antd/es/table/interface';

export type { ColumnType, ColumnGroupType };

export type TablePaginationPosition = 'topLeft' | 'topCenter' | 'topRight' | 'bottomLeft' | 'bottomCenter' | 'bottomRight';

export interface TablePaginationConfigEx extends Omit<TablePaginationConfig, 'position'> {
  position?: TablePaginationPosition[];
}

export interface TableProps<T> extends Omit<AntdTableProps<T>, 'onChange' | 'pagination'> {
  columns: (ColumnGroupType<T> | ColumnType<T>)[];
  dataSource: readonly T[];
  rowKey?: string | ((record: T) => string | number);
  loading?: boolean | { delay?: number };
  pagination?: false | TablePaginationConfigEx;
  scroll?: { x?: number | string | true; y?: number | string };
  size?: 'large' | 'middle' | 'small';
  bordered?: boolean;
  showHeader?: boolean;
  title?: (currentPageData: readonly T[]) => React.ReactNode;
  footer?: (currentPageData: readonly T[]) => React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  rowClassName?: string | ((record: T, index: number) => string);
  onRow?: (record: T, index?: number) => React.HTMLAttributes<HTMLElement>;
  onChange?: (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<T> | SorterResult<T>[],
    extra: { currentDataSource: T[]; action: 'paginate' | 'sort' | 'filter' }
  ) => void;
  rowSelection?: TableRowSelection<T>;
  showSorterTooltip?: boolean | { title?: string };
  virtual?: boolean;
  components?: any;
  sortDirections?: ('ascend' | 'descend')[];
  expandable?: any;
  sticky?: boolean | { offsetHeader?: number; offsetScroll?: number; getContainer?: () => HTMLElement };
  summary?: (data: readonly T[]) => React.ReactNode;
}

// Safe data accessor function
const safeGet = (obj: any, path: string, defaultValue: any = '') => {
  if (!obj) return defaultValue;
  const keys = path.split('.');
  let result = obj;
  for (const key of keys) {
    result = result?.[key];
    if (result === undefined || result === null) return defaultValue;
  }
  return result || defaultValue;
};

// Process columns to add safe data access
const processColumns = <T,>(cols: any[]): any[] => {
  if (!Array.isArray(cols)) return [];
  
  return cols.map(column => {
    if (!column) return null;
    
    // Handle column with render function
    if (column.render) {
      const originalRender = column.render;
      return {
        ...column,
        render: (text: any, record: T, index: number) => {
          try {
            return originalRender(text, record, index);
          } catch (error) {
            console.error('Error in column render:', error);
            return null;
          }
        }
      };
    }
    
    // Handle column with sorter
    if (column.sorter) {
      const originalSorter = column.sorter;
      return {
        ...column,
        sorter: (a: T, b: T) => {
          try {
            return originalSorter(a, b);
          } catch (error) {
            console.error('Error in column sorter:', error);
            return 0;
          }
        }
      };
    }
    
    return column;
  }).filter(Boolean);
};

function Table<T extends object = any>({
  columns = [],
  dataSource = [],
  rowKey = 'id',
  loading = false,
  pagination = { position: ['bottomRight'] },
  scroll,
  size = 'middle',
  bordered = false,
  showHeader = true,
  title,
  footer,
  className = '',
  style,
  rowClassName,
  onRow,
  onChange,
  rowSelection,
  showSorterTooltip = true,
  virtual = false,
  components,
  sortDirections = ['ascend', 'descend'],
  expandable,
  sticky = false,
  summary,
  ...rest
}: TableProps<T>) {
  const handleChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<T> | SorterResult<T>[],
    extra: { currentDataSource: T[]; action: 'paginate' | 'sort' | 'filter' }
  ) => {
    if (onChange) {
      onChange(pagination, filters, sorter, extra);
    }
  };

  // Process pagination to handle position array
  const processedPagination = pagination
    ? {
        ...pagination,
        position: Array.isArray(pagination.position) 
          ? pagination.position.filter((pos): pos is TablePaginationPosition => 
              pos === 'topLeft' || pos === 'topCenter' || pos === 'topRight' ||
              pos === 'bottomLeft' || pos === 'bottomCenter' || pos === 'bottomRight'
            )
          : (pagination.position && [pagination.position as TablePaginationPosition].filter(Boolean)) || undefined,
      }
    : false;

  // Ensure dataSource is an array and has valid items
  const safeDataSource = Array.isArray(dataSource) 
    ? dataSource.filter(item => item && typeof item === 'object')
    : [];

  // Process columns with safe data access
  const processedColumns = processColumns<T>(columns);

  try {
    return (
      <AntdTable<T>
        columns={processedColumns}
        dataSource={safeDataSource}
        rowKey={rowKey}
        loading={loading}
        pagination={processedPagination}
        scroll={scroll}
        size={size}
        bordered={bordered}
        showHeader={showHeader}
        title={title}
        footer={footer}
        className={className}
        style={style}
        rowClassName={rowClassName}
        onRow={onRow}
        onChange={handleChange}
        rowSelection={rowSelection}
        showSorterTooltip={showSorterTooltip}
        virtual={virtual}
        components={components}
        sortDirections={sortDirections}
        expandable={expandable}
        sticky={sticky}
        summary={summary}
        {...rest}
      />
    );
  } catch (error) {
    console.error('Error rendering Table:', error);
    return (
      <div className="p-4 text-red-500">
        Error rendering table. Please check the console for more details.
      </div>
    );
  }
}

// Attach static methods
Table.SELECTION_ALL = 'SELECT_ALL' as const;
Table.SELECTION_INVERT = 'SELECT_INVERT' as const;
Table.SELECTION_NONE = 'SELECT_NONE' as const;
Table.EXPAND_COLUMN = {} as const;
Table.INTERNAL_COL_DEFINE = 'TABLE_INTERNAL_COL_DEFINE' as const;

export default Table;
