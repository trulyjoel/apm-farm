import React, { useState, useEffect } from 'react';
import { Input, Table, Card, Checkbox, Divider, Space, Tag } from 'antd';
import type { TableColumnsType } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';

interface DataItem {
  apm_application_code: string;
  application_name: string;
  application_description: string;
  application_lifecycle: string;
  critical_information_asset: string;
  application_security_release_assessment_required: string;
  application_contact: string;
  application_contact_email: string;
  application_contact_title: string;
  it_manager: string;
  itmanageremail: string;
  it_manager_title: string;
  it_vp: string;
  itvpemail: string;
  it_vp_title: string;
  user_interface: string;
  isusapp: string;
}

export const DataSearch: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lifecycleFilters, setLifecycleFilters] = useState<string[]>(['Production']);
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    apm_application_code: true,
    application_name: true,
    application_description: true,
    application_lifecycle: true,
    application_contact: true,
    application_contact_email: true,
  });

  useEffect(() => {
    // Load the JSON data
    fetch('/data-small.json')
      .then(response => response.json())
      .then(jsonData => {
        setData(jsonData);
        // Apply default Production filter
        const filtered = jsonData.filter(item => item.application_lifecycle === 'Production');
        setFilteredData(filtered);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading data:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Filter data when search term changes
    if (searchTerm.trim() === '') {
      // Apply lifecycle filters if no search term
      const filtered = data.filter(item => 
        lifecycleFilters.length === 0 || lifecycleFilters.includes(item.application_lifecycle)
      );
      setFilteredData(filtered);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      const results = data.filter(item => {
        return Object.values(item).some(
          value => 
            value && 
            value.toString().toLowerCase().includes(lowercasedSearch)
        );
      });
      setFilteredData(results);
    }
  }, [searchTerm, data]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleColumnVisibilityChange = (e: CheckboxChangeEvent, columnKey: string) => {
    setVisibleColumns({
      ...visibleColumns,
      [columnKey]: e.target.checked,
    });
  };

  const allColumns: TableColumnsType<DataItem> = [
    {
      title: 'App Code',
      dataIndex: 'apm_application_code',
      key: 'apm_application_code',
      sorter: (a, b) => a.apm_application_code.localeCompare(b.apm_application_code),
      width: 100,
    },
    {
      title: 'Application Name',
      dataIndex: 'application_name',
      key: 'application_name',
      sorter: (a, b) => a.application_name.localeCompare(b.application_name),
    },
    {
      title: 'Description',
      dataIndex: 'application_description',
      key: 'application_description',
      ellipsis: true,
    },
    {
      title: 'Lifecycle',
      dataIndex: 'application_lifecycle',
      key: 'application_lifecycle',
      sorter: (a, b) => a.application_lifecycle.localeCompare(b.application_lifecycle),
      filters: [
        { text: 'Development', value: 'Development' },
        { text: 'Production', value: 'Production' },
        { text: 'Retired', value: 'Retired' },
      ],
      defaultFilteredValue: ['Production'],
      onFilter: (value, record) => record.application_lifecycle === value,
    },
    {
      title: 'Contact',
      dataIndex: 'application_contact',
      key: 'application_contact',
      sorter: (a, b) => a.application_contact.localeCompare(b.application_contact),
    },
    {
      title: 'Contact Email',
      dataIndex: 'application_contact_email',
      key: 'application_contact_email',
    },
    {
      title: 'Critical Asset',
      dataIndex: 'critical_information_asset',
      key: 'critical_information_asset',
      render: (value: string) => {
        const isYes = value?.toLowerCase() === 'yes';
        return (
          <Tag color={isYes ? 'red' : 'green'}>
            {isYes ? 'Yes' : 'No'}
          </Tag>
        );
      },
    },
    {
      title: 'Security Assessment',
      dataIndex: 'application_security_release_assessment_required',
      key: 'application_security_release_assessment_required',
      render: (value: string) => {
        const isYes = value?.toLowerCase() === 'yes';
        return (
          <Tag color={isYes ? 'orange' : 'cyan'}>
            {isYes ? 'Yes' : 'No'}
          </Tag>
        );
      },
    },
    {
      title: 'IT Manager',
      dataIndex: 'it_manager',
      key: 'it_manager',
    },
    {
      title: 'IT VP',
      dataIndex: 'it_vp',
      key: 'it_vp',
    },
    {
      title: 'User Interface',
      dataIndex: 'user_interface',
      key: 'user_interface',
    },
    {
      title: 'US App',
      dataIndex: 'isusapp',
      key: 'isusapp',
      render: (value: string) => {
        const isYes = value?.toLowerCase() === 'yes';
        return (
          <Tag color={isYes ? 'blue' : 'gray'}>
            {isYes ? 'Yes' : 'No'}
          </Tag>
        );
      },
    },
  ];

  // Filter columns based on visibility settings
  const columns = allColumns.filter(column => 
    visibleColumns[column.dataIndex as string]
  );

  return (
    <Card title="Application Data Search" style={{ width: '100%' }}>
      <Input.Search
        placeholder="Search applications..."
        allowClear
        enterButton="Search"
        size="large"
        value={searchTerm}
        onChange={handleSearch}
        style={{ marginBottom: 20 }}
      />
      
      <Card title="Column Visibility" size="small" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {allColumns.map(column => (
            <Checkbox
              key={column.key as string}
              checked={!!visibleColumns[column.dataIndex as string]}
              onChange={(e) => handleColumnVisibilityChange(e, column.dataIndex as string)}
            >
              {column.title as string}
            </Checkbox>
          ))}
        </div>
      </Card>
      
      <Table 
        columns={columns} 
        dataSource={filteredData.map(item => ({ ...item, key: item.apm_application_code }))} 
        loading={loading}
        pagination={{ pageSize: 10 }}
        onChange={(pagination, filters) => {
          if (filters.application_lifecycle) {
            setLifecycleFilters(filters.application_lifecycle as string[]);
          }
        }}
        expandable={{
          expandedRowRender: (record) => (
            <div style={{ margin: 0 }}>
              <p><strong>Description:</strong> {record.application_description}</p>
              <p>
                <strong>Critical Information Asset:</strong>{' '}
                <Tag color={record.critical_information_asset?.toLowerCase() === 'yes' ? 'red' : 'green'}>
                  {record.critical_information_asset?.toLowerCase() === 'yes' ? 'Yes' : 'No'}
                </Tag>
              </p>
              <p>
                <strong>Security Assessment Required:</strong>{' '}
                <Tag color={record.application_security_release_assessment_required?.toLowerCase() === 'yes' ? 'orange' : 'cyan'}>
                  {record.application_security_release_assessment_required?.toLowerCase() === 'yes' ? 'Yes' : 'No'}
                </Tag>
              </p>
              <p><strong>Contact Title:</strong> {record.application_contact_title}</p>
              <p><strong>IT Manager:</strong> {record.it_manager} ({record.itmanageremail})</p>
              <p><strong>IT VP:</strong> {record.it_vp} ({record.itvpemail})</p>
              <p><strong>User Interface:</strong> {record.user_interface}</p>
              <p>
                <strong>US App:</strong>{' '}
                <Tag color={record.isusapp?.toLowerCase() === 'yes' ? 'blue' : 'gray'}>
                  {record.isusapp?.toLowerCase() === 'yes' ? 'Yes' : 'No'}
                </Tag>
              </p>
            </div>
          ),
        }}
      />
    </Card>
  );
};
