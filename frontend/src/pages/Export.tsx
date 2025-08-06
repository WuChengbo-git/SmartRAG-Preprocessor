import React, { useState } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Button, 
  Select, 
  Form, 
  Input, 
  Switch,
  Space,
  Table,
  Tag,
  Progress,
  message,
  Modal
} from 'antd';
import { 
  ExportOutlined, 
  DownloadOutlined, 
  ApiOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface ExportTask {
  id: string;
  fileName: string;
  exportType: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  createdTime: string;
  completedTime?: string;
  downloadUrl?: string;
  error?: string;
}

const Export: React.FC = () => {
  const [form] = Form.useForm();
  const [configModalVisible, setConfigModalVisible] = useState(false);
  const [selectedExportType, setSelectedExportType] = useState<string>('json');
  
  const [exportTasks, setExportTasks] = useState<ExportTask[]>([
    {
      id: '1',
      fileName: 'プレゼンテーション資料.pptx',
      exportType: 'JSON',
      status: 'completed',
      progress: 100,
      createdTime: '2024-01-15 14:30',
      completedTime: '2024-01-15 14:31',
      downloadUrl: '/download/presentation.json'
    },
    {
      id: '2',
      fileName: 'マニュアル.pdf',
      exportType: 'Dify',
      status: 'processing',
      progress: 75,
      createdTime: '2024-01-15 14:25'
    },
    {
      id: '3',
      fileName: 'データ分析.xlsx',
      exportType: 'Elasticsearch',
      status: 'failed',
      progress: 0,
      createdTime: '2024-01-15 14:20',
      error: '接続エラー'
    }
  ]);

  const exportTypes = [
    {
      value: 'json',
      label: 'JSON',
      description: '標準的なJSON形式でエクスポート',
      icon: <DownloadOutlined />
    },
    {
      value: 'dify',
      label: 'Dify',
      description: 'Dify知識ベースに直接インポート',
      icon: <ApiOutlined />
    },
    {
      value: 'elasticsearch',
      label: 'Elasticsearch',
      description: 'Elasticsearchインデックスに直接インポート',
      icon: <ApiOutlined />
    }
  ];

  const schemas = [
    {
      name: 'standard',
      label: '標準形式',
      description: 'id, content, metadata フィールドを含む基本形式'
    },
    {
      name: 'dify',
      label: 'Dify形式',
      description: 'text, metadata, source フィールドを含むDify対応形式'
    },
    {
      name: 'elasticsearch',
      label: 'Elasticsearch形式',
      description: 'content, title, metadata, timestamp フィールドを含む検索最適化形式'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'processing': return 'processing';
      case 'failed': return 'error';
      case 'pending': return 'default';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return '完了';
      case 'processing': return '処理中';
      case 'failed': return '失敗';
      case 'pending': return '待機中';
      default: return '不明';
    }
  };

  const handleExport = (values: any) => {
    const newTask: ExportTask = {
      id: Date.now().toString(),
      fileName: values.fileName,
      exportType: selectedExportType.toUpperCase(),
      status: 'processing',
      progress: 0,
      createdTime: new Date().toLocaleString('ja-JP')
    };
    
    setExportTasks(prev => [newTask, ...prev]);
    message.success('エクスポートを開始しました');
    form.resetFields();
  };

  const handleDownload = (task: ExportTask) => {
    if (task.downloadUrl) {
      window.open(task.downloadUrl, '_blank');
    }
  };

  const columns = [
    {
      title: 'ファイル名',
      dataIndex: 'fileName',
      key: 'fileName',
    },
    {
      title: 'エクスポート形式',
      dataIndex: 'exportType',
      key: 'exportType',
      render: (type: string) => (
        <Tag color="blue">{type}</Tag>
      )
    },
    {
      title: '状態',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: ExportTask) => (
        <div>
          <Tag color={getStatusColor(status)}>
            {getStatusText(status)}
          </Tag>
          {status === 'processing' && (
            <Progress 
              percent={record.progress} 
              size="small" 
              style={{ marginTop: 4 }}
            />
          )}
          {status === 'failed' && record.error && (
            <div style={{ marginTop: 4 }}>
              <Text type="danger" style={{ fontSize: '12px' }}>
                {record.error}
              </Text>
            </div>
          )}
        </div>
      ),
    },
    {
      title: '作成時間',
      dataIndex: 'createdTime',
      key: 'createdTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: ExportTask) => (
        <Space>
          {record.status === 'completed' && record.downloadUrl && (
            <Button 
              type="primary" 
              size="small"
              icon={<DownloadOutlined />}
              onClick={() => handleDownload(record)}
            >
              ダウンロード
            </Button>
          )}
          {record.status === 'failed' && (
            <Button 
              size="small"
              onClick={() => message.info('再試行機能は開発中です')}
            >
              再試行
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={2} style={{ marginBottom: 24 }}>
        エクスポート管理
      </Title>
      
      <Row gutter={16}>
        <Col span={8}>
          <Card 
            title={
              <Space>
                <ExportOutlined />
                新しいエクスポート
              </Space>
            }
          >
            <Form form={form} layout="vertical" onFinish={handleExport}>
              <Form.Item 
                label="ファイル選択" 
                name="fileName"
                rules={[{ required: true, message: 'ファイルを選択してください' }]}
              >
                <Select placeholder="処理済みファイルを選択">
                  <Option value="プレゼンテーション資料.pptx">プレゼンテーション資料.pptx</Option>
                  <Option value="マニュアル.pdf">マニュアル.pdf</Option>
                  <Option value="データ分析.xlsx">データ分析.xlsx</Option>
                </Select>
              </Form.Item>
              
              <Form.Item 
                label="エクスポート形式" 
                name="exportType"
                initialValue="json"
              >
                <Select 
                  value={selectedExportType}
                  onChange={setSelectedExportType}
                >
                  {exportTypes.map(type => (
                    <Option key={type.value} value={type.value}>
                      <div style={{ lineHeight: '1.2' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                          {type.icon}
                          <span>{type.label}</span>
                        </div>
                        <Text type="secondary" style={{ fontSize: '12px', lineHeight: '1.2' }}>
                          {type.description}
                        </Text>
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              
              <Form.Item 
                label="スキーマ" 
                name="schema"
                initialValue="standard"
              >
                <Select>
                  {schemas.map(schema => (
                    <Option key={schema.name} value={schema.name}>
                      <div style={{ lineHeight: '1.2' }}>
                        <div style={{ marginBottom: '2px' }}>
                          {schema.label}
                        </div>
                        <Text type="secondary" style={{ fontSize: '12px', lineHeight: '1.2' }}>
                          {schema.description}
                        </Text>
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              
              <Form.Item 
                label="メタデータを含む" 
                name="includeMetadata"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch />
              </Form.Item>
              
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button 
                  type="primary" 
                  htmlType="submit"
                  block
                  icon={<ExportOutlined />}
                >
                  エクスポート開始
                </Button>
                
                <Button 
                  block
                  onClick={() => setConfigModalVisible(true)}
                >
                  詳細設定
                </Button>
              </Space>
            </Form>
          </Card>
        </Col>
        
        <Col span={16}>
          <Card title="エクスポート履歴" extra={<Text type="secondary">最新20件</Text>}>
            <Table 
              columns={columns} 
              dataSource={exportTasks} 
              rowKey="id"
              pagination={{ pageSize: 10 }}
              size="middle"
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title="詳細設定"
        open={configModalVisible}
        onCancel={() => setConfigModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setConfigModalVisible(false)}>
            キャンセル
          </Button>,
          <Button key="save" type="primary">
            保存
          </Button>
        ]}
        width={600}
      >
        <Form layout="vertical">
          <Form.Item label="API エンドポイント">
            <Input placeholder="https://api.example.com/upload" />
          </Form.Item>
          
          <Form.Item label="認証トークン">
            <Input.Password placeholder="認証トークンを入力" />
          </Form.Item>
          
          <Form.Item label="カスタムヘッダー">
            <TextArea 
              rows={4}
              placeholder="JSON形式でカスタムヘッダーを入力"
              defaultValue='{\n  "Content-Type": "application/json",\n  "Authorization": "Bearer TOKEN"\n}'
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Export;