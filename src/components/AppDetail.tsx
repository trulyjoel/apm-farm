import React from 'react';
import { Card, Descriptions, Tag, Spin, Result, Button } from 'antd';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../api/dataService';

export const AppDetail: React.FC = () => {
  const { appCode } = useParams<{ appCode: string }>();
  const { app, loading, error } = useApp(appCode || null);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
        <Spin size="large" tip="Loading application data..." />
      </div>
    );
  }

  if (error) {
    return (
      <Result
        status="error"
        title="Failed to load application data"
        subTitle={error.message}
        extra={<Link to="/"><Button type="primary">Back to List</Button></Link>}
      />
    );
  }

  if (!app) {
    return (
      <Result
        status="404"
        title="Application Not Found"
        subTitle={`No application found with App Code: ${appCode}`}
        extra={<Link to="/"><Button type="primary">Back to List</Button></Link>}
      />
    );
  }

  // Helper function to render Yes/No tags
  const renderYesNoTag = (value: string | undefined, yesColor: string, noColor: string) => {
    const isYes = value?.toLowerCase() === 'yes';
    return (
      <Tag color={isYes ? yesColor : noColor}>
        {isYes ? 'Yes' : 'No'}
      </Tag>
    );
  };

  // Helper function to render UI tag
  const renderUITag = (value: string | undefined) => {
    if (!value) return <Tag color="default">Unknown</Tag>;
    
    const colorMap: Record<string, string> = {
      'Internally Facing': 'lime',
      'Externally Facing': 'gold',
      'Both Externally and Internally Facing': 'orange'
    };
    
    const color = colorMap[value] || 'cyan';
    return <Tag color={color}>{value}</Tag>;
  };

  return (
    <Card 
      title={`Application Details: ${app.application_name}`} 
      extra={<Link to="/"><Button type="primary">Back to List</Button></Link>}
      style={{ width: '100%' }}
    >
      <Descriptions bordered column={1}>
        <Descriptions.Item label="App Code">{app.apm_application_code}</Descriptions.Item>
        <Descriptions.Item label="Application Name">{app.application_name}</Descriptions.Item>
        <Descriptions.Item label="Description">{app.application_description}</Descriptions.Item>
        <Descriptions.Item label="Lifecycle">{app.application_lifecycle}</Descriptions.Item>
        <Descriptions.Item label="Contact">{app.application_contact}</Descriptions.Item>
        <Descriptions.Item label="Contact Email">{app.application_contact_email}</Descriptions.Item>
        <Descriptions.Item label="Contact Title">{app.application_contact_title}</Descriptions.Item>
        <Descriptions.Item label="Critical Asset">
          {renderYesNoTag(app.critical_information_asset, 'red', 'green')}
        </Descriptions.Item>
        <Descriptions.Item label="Security Assessment Required">
          {renderYesNoTag(app.application_security_release_assessment_required, 'orange', 'cyan')}
        </Descriptions.Item>
        <Descriptions.Item label="User Interface">
          {renderUITag(app.user_interface)}
        </Descriptions.Item>
        <Descriptions.Item label="US App">
          {renderYesNoTag(app.isusapp, 'blue', 'gray')}
        </Descriptions.Item>
      </Descriptions>

    </Card>
  );
};
