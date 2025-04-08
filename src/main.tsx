import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import { DataSearch } from './components/DataSearch';
import { AppDetail } from './components/AppDetail';
import './index.css';

const { Header, Content, Footer } = Layout;

const App = () => {
  return (
    <Router>
      <Layout className="layout" style={{ minHeight: '100vh' }}>
        <Header style={{ background: '#fff', padding: '0 20px' }}>
          <h1 style={{ margin: 0 }}>Application Data Explorer</h1>
        </Header>
        <Content style={{ padding: '20px 50px' }}>
          <Routes>
            <Route path="/" element={<DataSearch />} />
            <Route path="/api/app/:appCode" element={<AppDetail />} />
          </Routes>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Application Data Explorer ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </Router>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
