import React, { useState } from 'react';
import { Layout as AntLayout, Menu, theme, Typography, Space, Badge } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { getVersionDisplay } from '../utils/version';
import {
  DashboardOutlined,
  UploadOutlined,
  SettingOutlined as ProcessorOutlined,
  EditOutlined,
  ExportOutlined,
  UnorderedListOutlined,
  SettingOutlined,
  FileTextOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content, Footer } = AntLayout;
const { Title } = Typography;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = theme.useToken();

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'ダッシュボード',
    },
    {
      key: '/upload',
      icon: <UploadOutlined />,
      label: 'ファイルアップロード',
    },
    {
      key: '/processing',
      icon: <ProcessorOutlined />,
      label: 'ドキュメント処理',
    },
    {
      key: '/editor',
      icon: <EditOutlined />,
      label: 'ビジュアルエディタ',
    },
    {
      key: '/export',
      icon: <ExportOutlined />,
      label: 'エクスポート管理',
    },
    {
      key: '/tasks',
      icon: <UnorderedListOutlined />,
      label: 'タスクキュー',
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: '設定',
    },
  ];

  const handleMenuClick = (key: string) => {
    navigate(key);
  };

  return (
    <AntLayout style={{ minHeight: '100vh', display: 'flex' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        style={{
          background: token.colorBgContainer,
          borderRight: `1px solid ${token.colorBorder}`,
          flexShrink: 0,
        }}
      >
        <div style={{ 
          height: 64, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          borderBottom: `1px solid ${token.colorBorder}`,
          padding: '0 16px'
        }}>
          <Space>
            <FileTextOutlined style={{ fontSize: 24, color: token.colorPrimary }} />
            {!collapsed && (
              <Title level={5} style={{ margin: 0, color: token.colorText }}>
                SmartRAG
              </Title>
            )}
          </Space>
        </div>
        
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => handleMenuClick(key)}
          style={{ border: 'none', paddingTop: 16 }}
        />
      </Sider>
      
      <AntLayout style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Header style={{ 
          padding: '0 24px', 
          background: token.colorBgContainer,
          borderBottom: `1px solid ${token.colorBorder}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: 16,
                width: 64,
                height: 64,
                border: 'none',
                background: 'none',
                cursor: 'pointer',
              }}
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </button>
            
            <Title level={4} style={{ margin: 0, marginLeft: 16 }}>
              SmartRAG プリプロセッサー
            </Title>
          </div>
          
          <Space>
            <Badge count={0} size="small">
              <UnorderedListOutlined style={{ fontSize: 18 }} />
            </Badge>
            <SettingOutlined style={{ fontSize: 18, cursor: 'pointer' }} />
          </Space>
        </Header>
        
        <Content style={{ 
          flex: 1,
          overflow: 'auto',
          background: token.colorBgLayout,
          width: '100%',
        }}>
          <div style={{ padding: '24px', width: '100%' }}>
            {children}
          </div>
        </Content>
        
        <Footer style={{ 
          textAlign: 'center',
          background: token.colorBgContainer,
          borderTop: `1px solid ${token.colorBorder}`,
          flexShrink: 0,
        }}>
          <Space>
            <span>処理状況: アイドル状態</span>
            <span>•</span>
            <span>処理済み: 0 ファイル</span>
            <span>•</span>
            <span>バージョン: {getVersionDisplay()}</span>
          </Space>
        </Footer>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;