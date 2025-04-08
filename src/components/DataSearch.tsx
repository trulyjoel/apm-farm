import React, { useState, useEffect } from 'react';
import { Input, Table, Card } from 'antd';
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

  const columns: TableColumnsType<DataItem> = [
    {
      title: 'App Code',
      dataIndex: 'apm_application_code',
      key: 'apm_application_code',
      sorter: (a, b) => a.apm_application_code.localeCompare(b.apm_application_code),
    },
    {
      title: 'Application Name',
      dataIndex: 'application_name',
      key: 'application_name',
      sorter: (a, b) => a.application_name.localeCompare(b.application_name),
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
    },
    {
      title: 'Contact Email',
      dataIndex: 'application_contact_email',
      key: 'application_contact_email',
    },
    {
      title: 'Description',
      dataIndex: 'application_description',
      key: 'application_description',
      ellipsis: true,
    },
  ];

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
              <p><strong>Critical Information Asset:</strong> {record.critical_information_asset}</p>
              <p><strong>Security Assessment Required:</strong> {record.application_security_release_assessment_required}</p>
              <p><strong>Contact Title:</strong> {record.application_contact_title}</p>
              <p><strong>IT Manager:</strong> {record.it_manager} ({record.itmanageremail})</p>
              <p><strong>IT VP:</strong> {record.it_vp} ({record.itvpemail})</p>
              <p><strong>User Interface:</strong> {record.user_interface}</p>
              <p><strong>US App:</strong> {record.isusapp}</p>
            </div>
          ),
        }}
      />
    </Card>
  );
};
