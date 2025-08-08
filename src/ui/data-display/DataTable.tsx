import React, { useState, useMemo, useCallback } from 'react';
import { Table as AntdTable, TableProps as AntdTableProps, TablePaginationConfig } from 'antd';
import { FilterValue, SorterResult, TableRowSelection } from 'antd/es/table/interface';
import { Card } from '../display/Card';
import { Space } from '../layout/Space';
import { Button } from '../display/Button';
import { Text } from '../typography/Text';

export type DataTableColumn<T> = NonNullable<AntdTableProps<T>['columns']>[number] & {
  sorter?: boolean | ((a: T, b: T) => number);
  filterable?: boolean;
  searchable?: boolean;
};

export interface DataTableProps<T> extends Omit<AntdTableProps<T>, 'onChange' | 'columns'> {
  title?: React.ReactNode;
  description?: string;
  columns: DataTableColumn<T>[];
  dataSource: T[];
  loading?: boolean;
  pagination?: TablePaginationConfig | false;
  rowSelection?: TableRowSelection<T>;
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  onRefresh?: () => void;
  onRowClick?: (record: T, index?: number) => void;
  onChange?: (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<T> | SorterResult<T>[],
    extra: any
  ) => void;
  className?: string;
  headerClassName?: string;
  tableClassName?: string;
  cardProps?: React.ComponentProps<typeof Card>;
  showHeaderActions?: boolean;
  scroll?: {
    x?: number | string | true;
    y?: number | string;
  };
}

const defaultPagination: TablePaginationConfig = {
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
  pageSizeOptions: ['10', '20', '50', '100'],
  defaultPageSize: 10,
};

export function DataTable<T extends object>({
  title,
  description,
  columns,
  dataSource,
  loading = false,
  pagination: propPagination = {},
  rowSelection,
  searchable = false,
  searchPlaceholder = 'Search...',
  onSearch,
  onRefresh,
  onRowClick,
  onChange,
  className = '',
  headerClassName = '',
  tableClassName = '',
  cardProps = {},
  showHeaderActions = true,
  scroll = { x: 'max-content' },
  ...rest
}: DataTableProps<T>) {
  const [searchText, setSearchText] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // Merge default pagination with props
  const pagination = useMemo(() => {
    if (propPagination === false) return false;
    return { ...defaultPagination, ...propPagination };
  }, [propPagination]);

  // Handle search
  const handleSearch = (value: string) => {
    setSearchText(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  // Handle row click
  const handleRowClick = useCallback(
    (record: T, index?: number) => {
      if (onRowClick) {
        onRowClick(record, index);
      }
    },
    [onRowClick]
  );

  // Handle table change
  const handleTableChange = useCallback(
    (pagination, filters, sorter, extra) => {
      if (onChange) {
        onChange(pagination, filters, sorter, extra);
      }
    },
    [onChange]
  );

  // Handle refresh
  const handleRefresh = useCallback(() => {
    if (onRefresh) {
      onRefresh();
    }
  }, [onRefresh]);

  // Process columns for search and filtering
  const processedColumns = useMemo(() => {
    return columns.map((col) => {
      const column = { ...col };
      
      // Add sorter if specified
      if (column.sorter) {
        column.sorter = column.sorter === true 
          ? (a: any, b: any) => (a[column.key as string] > b[column.key as string] ? 1 : -1)
          : column.sorter;
      }

      return column;
    });
  }, [columns]);

  // Filter data based on search text
  const filteredData = useMemo(() => {
    if (!searchText) return dataSource;
    
    const searchLower = searchText.toLowerCase();
    return dataSource.filter((item) =>
      Object.entries(item).some(([key, value]) => {
        const column = columns.find((col) => col.key === key || col.dataIndex === key);
        if (column && column.searchable === false) return false;
        
        const stringValue = String(value || '').toLowerCase();
        return stringValue.includes(searchLower);
      })
    );
  }, [dataSource, searchText, columns]);

  // Row selection
  const rowSelectionConfig = useMemo(() => {
    if (!rowSelection) return undefined;
    
    return {
      ...rowSelection,
      selectedRowKeys,
      onChange: (selectedKeys: React.Key[]) => {
        setSelectedRowKeys(selectedKeys);
        if (rowSelection.onChange) {
          rowSelection.onChange(selectedKeys, []);
        }
      },
    };
  }, [rowSelection, selectedRowKeys]);

  // Table header
  const tableHeader = useMemo(() => {
    if (!title && !description && !showHeaderActions) return null;
    
    return (
      <div className={`flex flex-col md:flex-row md:items-center justify-between mb-4 ${headerClassName}`}>
        <div>
          {title && <Text size="lg" weight="medium">{title}</Text>}
          {description && (
            <Text size="sm" color="muted" className="mt-1 block">
              {description}
            </Text>
          )}
        </div>
        
        {(showHeaderActions || searchable) && (
          <div className="mt-2 md:mt-0">
            <Space>
              {searchable && (
                <Input
                  placeholder={searchPlaceholder}
                  value={searchText}
                  onChange={(e) => handleSearch(e.target.value)}
                  prefix={<SearchOutlined />}
                  allowClear
                  className="w-48"
                />
              )}
              {onRefresh && (
                <Button 
                  icon={<ReloadOutlined />} 
                  onClick={handleRefresh}
                  loading={loading}
                />
              )}
            </Space>
          </div>
        )}
      </div>
    );
  }, [
    title,
    description,
    searchable,
    searchPlaceholder,
    searchText,
    loading,
    onRefresh,
    showHeaderActions,
    headerClassName,
  ]);

  return (
    <div className={`data-table-container ${className}`}>
      <Card 
        className="overflow-hidden"
        noPadding
        {...cardProps}
      >
        {tableHeader}
        
        <div className="overflow-x-auto">
          <AntdTable
            columns={processedColumns}
            dataSource={filteredData as any}
            loading={loading}
            pagination={pagination}
            rowSelection={rowSelectionConfig as any}
            onChange={handleTableChange}
            onRow={(record, index) => ({
              onClick: () => handleRowClick(record, index),
              style: {
                cursor: onRowClick ? 'pointer' : 'default',
              },
            })}
            className={`data-table ${tableClassName}`}
            scroll={scroll}
            {...rest}
          />
        </div>
      </Card>
    </div>
  );
}

// Add display name for better debugging
DataTable.displayName = 'DataTable';

// Re-export Table components for better DX
export const Table = {
  ...AntdTable,
  Column: AntdTable.Column,
  ColumnGroup: AntdTable.ColumnGroup,
  Summary: AntdTable.Summary,
  SELECTION_COLUMN: AntdTable.SELECTION_COLUMN,
  EXPAND_COLUMN: AntdTable.EXPAND_COLUMN,
  SELECTION_ALL: 'SELECT_ALL' as const,
  SELECTION_INVERT: 'SELECT_INVERT' as const,
  SELECTION_NONE: 'SELECT_NONE' as const,
};

export default DataTable;
