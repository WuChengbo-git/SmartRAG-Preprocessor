import React from 'react';
import { Card, Row, Col, Statistic, Progress, List, Avatar, Tag, Typography } from 'antd';
import {
  FileTextOutlined,
  SettingOutlined as ProcessorOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UploadOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const recentFiles = [
    {
      id: 1,
      name: 'プレゼンテーション資料.pptx',
      type: 'PowerPoint',
      status: 'completed',
      chunks: 25,
      uploadTime: '2024-01-15 14:30'
    },
    {
      id: 2,
      name: 'マニュアル.pdf',
      type: 'PDF',
      status: 'processing',
      chunks: 0,
      uploadTime: '2024-01-15 14:25'
    },
    {
      id: 3,
      name: 'データ分析.xlsx',
      type: 'Excel',
      status: 'failed',
      chunks: 0,
      uploadTime: '2024-01-15 14:20'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'processing': return 'processing';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return '完了';
      case 'processing': return '処理中';
      case 'failed': return '失敗';
      default: return '待機中';
    }
  };

  return (
    <div>
      <Title level={2} style={{ marginBottom: 24 }}>
        ダッシュボード
      </Title>
      
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="総ファイル数"
              value={128}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="処理済み"
              value={115}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="処理中"
              value={2}
              prefix={<ProcessorOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="総チャンク数"
              value={2845}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="処理進捗" extra={<Text type="secondary">リアルタイム</Text>}>
            <div style={{ marginBottom: 16 }}>
              <Text strong>現在の処理: マニュアル.pdf</Text>
              <Progress percent={65} status="active" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text>キュー内のタスク: 3件</Text>
              <Progress percent={30} showInfo={false} />
            </div>
            <div>
              <Text>完了率 (今日)</Text>
              <Progress percent={85} strokeColor="#52c41a" />
            </div>
          </Card>
        </Col>
        
        <Col span={12}>
          <Card title="最近のファイル" extra={<Text type="secondary">最新5件</Text>}>
            <List
              itemLayout="horizontal"
              dataSource={recentFiles}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<FileTextOutlined />} />}
                    title={
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span>{item.name}</span>
                        <Tag color={getStatusColor(item.status)}>
                          {getStatusText(item.status)}
                        </Tag>
                      </div>
                    }
                    description={
                      <div>
                        <Text type="secondary">{item.type}</Text>
                        {item.chunks > 0 && (
                          <>
                            <span> • </span>
                            <Text type="secondary">{item.chunks} チャンク</Text>
                          </>
                        )}
                        <br />
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {item.uploadTime}
                        </Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="システム状態">
            <Row gutter={16}>
              <Col span={8}>
                <Card size="small">
                  <Statistic
                    title="API状態"
                    value="正常"
                    prefix={<CheckCircleOutlined />}
                    valueStyle={{ color: '#3f8600' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small">
                  <Statistic
                    title="キュー状態"
                    value="稼働中"
                    prefix={<ClockCircleOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small">
                  <Statistic
                    title="ストレージ使用量"
                    value="2.4GB"
                    prefix={<UploadOutlined />}
                    valueStyle={{ color: '#722ed1' }}
                  />
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;