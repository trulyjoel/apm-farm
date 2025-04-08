import React from 'react';
import { Button } from 'antd';
import { DataSearch } from './components/DataSearch';

export function Main() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Application Data Explorer</h1>
      <DataSearch />
    </div>
  );
}
