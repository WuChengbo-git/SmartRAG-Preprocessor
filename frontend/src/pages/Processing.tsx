import React, { useState } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Form, 
  Select, 
  InputNumber, 
  Button, 
  Table, 
  Progress,
  Tag,
  Space,
  message,
  Drawer,
  Divider,
  Alert,
  List,
  Avatar
} from 'antd';
import { 
  SettingOutlined, 
  PlayCircleOutlined, 
  PauseCircleOutlined,
  EyeOutlined,
  FileTextOutlined,
  BulbOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface ProcessingTask {
  id: string;
  fileName: string;
  fileType: string;
  status: 'waiting' | 'processing' | 'completed' | 'failed';
  progress: number;
  chunks: number;
  totalChunks: number;
  config: {
    chunkSize: number;
    chunkOverlap: number;
    chunkMethod: string;
  };
  startTime?: string;
  endTime?: string;
  error?: string;
}

const Processing: React.FC = () => {
  const [form] = Form.useForm();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ProcessingTask | null>(null);
  
  const [tasks, setTasks] = useState<ProcessingTask[]>([
    {
      id: '1',
      fileName: 'プレゼンテーション資料.pptx',
      fileType: 'PowerPoint',
      status: 'completed',
      progress: 100,
      chunks: 25,
      totalChunks: 25,
      config: {
        chunkSize: 500,
        chunkOverlap: 50,
        chunkMethod: 'paragraph'
      },
      startTime: '2024-01-15 14:30',
      endTime: '2024-01-15 14:32'
    },
    {
      id: '2',
      fileName: 'マニュアル.pdf',
      fileType: 'PDF',
      status: 'processing',
      progress: 65,
      chunks: 13,
      totalChunks: 20,
      config: {
        chunkSize: 800,
        chunkOverlap: 100,
        chunkMethod: 'page'
      },
      startTime: '2024-01-15 14:25'
    },
    {
      id: '3',
      fileName: 'データ分析.xlsx',
      fileType: 'Excel',
      status: 'failed',
      progress: 0,
      chunks: 0,
      totalChunks: 0,
      config: {
        chunkSize: 300,
        chunkOverlap: 30,
        chunkMethod: 'sheet'
      },
      error: 'ファイル形式が対応していません'
    }
  ]);

  const chunkMethods = [
    { value: 'paragraph', label: '段落ごと', description: 'テキストを段落単位で分割' },
    { value: 'page', label: 'ページごと', description: 'ドキュメントをページ単位で分割' },
    { value: 'heading', label: '見出しごと', description: '見出しを基準にして分割' },
    { value: 'sentence', label: '文章ごと', description: '文章単位で分割' },
    { value: 'token', label: 'トークンごと', description: 'トークン数を基準にして分割' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'processing': return 'processing';
      case 'failed': return 'error';
      case 'waiting': return 'default';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return '完了';
      case 'processing': return '処理中';
      case 'failed': return '失敗';
      case 'waiting': return '待機中';
      default: return '不明';
    }
  };

  const handleStartProcessing = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status: 'processing', startTime: new Date().toLocaleString('ja-JP') }
        : task
    ));
    message.success('処理を開始しました');
  };

  const handlePauseProcessing = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status: 'waiting' }
        : task
    ));
    message.info('処理を一時停止しました');
  };

  const handlePreview = (task: ProcessingTask) => {
    setSelectedTask(task);
    setPreviewVisible(true);
  };

  const columns = [
    {
      title: 'ファイル名',
      dataIndex: 'fileName',
      key: 'fileName',
      render: (text: string, record: ProcessingTask) => (
        <Space>
          <FileTextOutlined />
          <div>
            <div>{text}</div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.fileType}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: '状態',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: ProcessingTask) => (
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
      title: 'チャンク',
      key: 'chunks',
      render: (_: any, record: ProcessingTask) => (
        <div>
          <Text>{record.chunks} / {record.totalChunks}</Text>
          {record.totalChunks > 0 && (
            <Progress 
              percent={Math.round((record.chunks / record.totalChunks) * 100)} 
              showInfo={false}
              size="small"
              style={{ marginTop: 4 }}
            />
          )}
        </div>
      ),
    },
    {
      title: '設定',
      key: 'config',
      render: (_: any, record: ProcessingTask) => (
        <div>
          <Text style={{ fontSize: '12px' }}>
            サイズ: {record.config.chunkSize}
          </Text>
          <br />
          <Text style={{ fontSize: '12px' }}>
            方法: {chunkMethods.find(m => m.value === record.config.chunkMethod)?.label}
          </Text>
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: ProcessingTask) => (
        <Space>
          {record.status === 'waiting' && (
            <Button 
              type="primary" 
              size="small"
              icon={<PlayCircleOutlined />}
              onClick={() => handleStartProcessing(record.id)}
            >
              開始
            </Button>
          )}
          {record.status === 'processing' && (
            <Button 
              size="small"
              icon={<PauseCircleOutlined />}
              onClick={() => handlePauseProcessing(record.id)}
            >
              一時停止
            </Button>
          )}
          {record.status === 'completed' && (
            <Button 
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handlePreview(record)}
            >
              プレビュー
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const sampleChunks = [
    {
      id: 1,
      content: 'このドキュメントは、SmartRAGシステムの概要と使用方法について説明します。RAG（Retrieval-Augmented Generation）は、検索機能を強化した生成AIの手法です。',
      metadata: { page: 1, type: 'paragraph', tokens: 45 }
    },
    {
      id: 2,
      content: 'システムの主な機能には、文書の自動分割、ベクトル化、検索インデックスの構築が含まれます。これらの機能により、効率的な情報検索が可能になります。',
      metadata: { page: 1, type: 'paragraph', tokens: 52 }
    },
    {
      id: 3,
      content: 'SmartRAGは多様な文書形式に対応しており、PDF、Word、Excel、PowerPointなどのファイルを処理できます。',
      metadata: { page: 2, type: 'paragraph', tokens: 38 }
    }
  ];

  return (
    <div>
      <Title level={2} style={{ marginBottom: 24 }}>
        処理モニタリング
      </Title>
      
      <Alert
        message="処理の進行状況"
        description="アップロードされたファイルの処理状況をリアルタイムで確認できます。処理設定は「ファイル管理」ページで行ってください。"
        type="info"
        style={{ marginBottom: 16 }}
      />
      
      <Row gutter={16}>
        <Col span={24}>
          <Card 
            title={
              <Space>
                <SettingOutlined />
                処理キューと進行状況
              </Space>
            }
            extra={
              <Space>
                <Text type="secondary">リアルタイム更新</Text>
                <Button size="small" icon={<PlayCircleOutlined />}>
                  全て再開
                </Button>
                <Button size="small" icon={<PauseCircleOutlined />}>
                  全て一時停止
                </Button>
              </Space>
            }
          >
            <Table 
              columns={columns} 
              dataSource={tasks} 
              rowKey="id"
              pagination={{ 
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => 
                  `${range[0]}-${range[1]} / ${total} 件`
              }}
              size="middle"
            />
          </Card>
        </Col>
      </Row>

      {/* 処理統計情報 */}
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={6}>
          <Card size="small">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                {tasks.filter(t => t.status === 'completed').length}
              </div>
              <div style={{ color: '#666' }}>完了</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                {tasks.filter(t => t.status === 'processing').length}
              </div>
              <div style={{ color: '#666' }}>処理中</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#faad14' }}>
                {tasks.filter(t => t.status === 'waiting').length}
              </div>
              <div style={{ color: '#666' }}>待機中</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff4d4f' }}>
                {tasks.filter(t => t.status === 'failed').length}
              </div>
              <div style={{ color: '#666' }}>失敗</div>
            </div>
          </Card>
        </Col>
      </Row>

      <Drawer
        title="処理結果プレビュー"
        width={720}
        onClose={() => setPreviewVisible(false)}
        open={previewVisible}
      >
        {selectedTask && (
          <div>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Card size="small">
                <Row gutter={16}>
                  <Col span={12}>
                    <Text strong>ファイル名:</Text>
                    <br />
                    <Text>{selectedTask.fileName}</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>チャンク数:</Text>
                    <br />
                    <Text>{selectedTask.chunks} チャンク</Text>
                  </Col>
                </Row>
                <Row gutter={16} style={{ marginTop: 16 }}>
                  <Col span={12}>
                    <Text strong>処理設定:</Text>
                    <br />
                    <Text>サイズ: {selectedTask.config.chunkSize}文字</Text>
                    <br />
                    <Text>方法: {chunkMethods.find(m => m.value === selectedTask.config.chunkMethod)?.label}</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>処理時間:</Text>
                    <br />
                    <Text>開始: {selectedTask.startTime}</Text>
                    <br />
                    <Text>終了: {selectedTask.endTime}</Text>
                  </Col>
                </Row>
              </Card>
              
              <Divider />
              
              <Title level={5}>分割されたチャンク</Title>
              <List
                dataSource={sampleChunks}
                renderItem={(item, index) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar>{index + 1}</Avatar>}
                      title={
                        <Space>
                          <Text>チャンク {item.id}</Text>
                          <Tag>
                            ページ {item.metadata.page}
                          </Tag>
                          <Tag>
                            {item.metadata.tokens} トークン
                          </Tag>
                        </Space>
                      }
                      description={
                        <Paragraph style={{ marginBottom: 0 }}>
                          {item.content}
                        </Paragraph>
                      }
                    />
                  </List.Item>
                )}
              />
            </Space>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default Processing;