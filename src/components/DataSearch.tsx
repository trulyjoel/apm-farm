import React, { useState, useEffect } from 'react';
import { Input, Table, Card, Tag, Button, Space } from 'antd';
import { Link } from 'react-router-dom';
import type { TableColumnsType } from 'antd';

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

  useEffect(() => {
    // Load the JSON data
    fetch('/data-small.json')
      .then(response => response.json())
      .then(jsonData => {
        setData(jsonData);
        setFilteredData(jsonData);
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
      setFilteredData(data);
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


  const allColumns: TableColumnsType<DataItem> = [
    {
      title: 'App Code',
      dataIndex: 'apm_application_code',
      key: 'apm_application_code',
      sorter: (a, b) => a.apm_application_code.localeCompare(b.apm_application_code),
      width: 120,
      render: (text) => (
        <Link to={`/app/${text}`}>{text}</Link>
      ),
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
      onFilter: (value, record) => record.application_lifecycle === value,
    },
    {
      title: 'Contact',
      dataIndex: 'application_contact',
      key: 'application_contact',
      sorter: (a, b) => a.application_contact.localeCompare(b.application_contact),
      render: (text, record) => (
        <>
          {text}{' '}
          {record.application_contact_email && (
            <a href={`mailto:${record.application_contact_email}`}>
              ({record.application_contact_email})
            </a>
          )}
        </>
      ),
    },
    {
      title: 'Critical Asset',
      dataIndex: 'critical_information_asset',
      key: 'critical_information_asset',
      filters: [
        { text: 'Yes', value: 'yes' },
        { text: 'No', value: 'no' },
      ],
      onFilter: (value, record) => record.critical_information_asset?.toLowerCase() === value,
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
      filters: [
        { text: 'Yes', value: 'yes' },
        { text: 'No', value: 'no' },
      ],
      onFilter: (value, record) => record.application_security_release_assessment_required?.toLowerCase() === value,
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
      title: 'User Interface',
      dataIndex: 'user_interface',
      key: 'user_interface',
      filters: [
        { text: 'Internally Facing', value: 'Internally Facing' },
        { text: 'Externally Facing', value: 'Externally Facing' },
        { text: 'Both Externally and Internally Facing', value: 'Both Externally and Internally Facing' },
      ],
      onFilter: (value, record) => record.user_interface === value,
      render: (value: string) => {
        if (!value) return <Tag color="default">Unknown</Tag>;
        
        // Map different UI types to different colors
        const colorMap: Record<string, string> = {
          'Internally Facing': 'lime',
          'Externally Facing': 'gold',
          'Both Externally and Internally Facing': 'orange'
        };
        
        const color = colorMap[value] || 'cyan';
        return <Tag color={color}>{value}</Tag>;
      },
    },
    {
      title: 'US App',
      dataIndex: 'isusapp',
      key: 'isusapp',
      filters: [
        { text: 'Yes', value: 'yes' },
        { text: 'No', value: 'no' },
      ],
      onFilter: (value, record) => record.isusapp?.toLowerCase() === value,
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

  // Use all columns
  const columns = allColumns;

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
      
      <Table 
        columns={columns} 
        dataSource={filteredData.map(item => ({ ...item, key: item.apm_application_code }))} 
        loading={loading}
        pagination={{ pageSize: 10 }}
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
              <p>
                <strong>User Interface:</strong>{' '}
                {(() => {
                  const value = record.user_interface;
                  if (!value) return <Tag color="default">Unknown</Tag>;
                  
                  // Map different UI types to different colors
                  const colorMap: Record<string, string> = {
                    'Internally Facing': 'lime',
                    'Externally Facing': 'gold',
                    'Both Externally and Internally Facing': 'orange'
                  };
                  
                  const color = colorMap[value] || 'cyan';
                  return <Tag color={color}>{value}</Tag>;
                })()}
              </p>
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
