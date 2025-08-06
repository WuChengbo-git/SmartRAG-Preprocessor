import React, { useState } from 'react';
import { 
  Card, 
  Table, 
  Tag, 
  Progress, 
  Space, 
  Button, 
  Typography,
  Select,
  DatePicker,
  Row,
  Col,
  Statistic,
  Timeline,
  Tooltip
} from 'antd';
import { 
  PlayCircleOutlined, 
  PauseCircleOutlined, 
  DeleteOutlined,
  ReloadOutlined,
  FilterOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface Task {
  id: string;
  type: 'upload' | 'process' | 'export';
  fileName: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  startTime: string;
  endTime?: string;
  duration?: string;
  error?: string;
  details?: string;
}

const Tasks: React.FC = () => {
  const [_filter, setFilter] = useState({
    status: 'all',
    type: 'all',
    dateRange: null
  });

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      type: 'upload',
      fileName: 'プレゼンテーション資料.pptx',
      status: 'completed',
      progress: 100,
      startTime: '2024-01-15 14:30:00',
      endTime: '2024-01-15 14:30:15',
      duration: '15秒'
    },
    {
      id: '2',
      type: 'process',
      fileName: 'マニュアル.pdf',
      status: 'running',
      progress: 65,
      startTime: '2024-01-15 14:25:00',
      details: 'チャンク分割中...'
    },
    {
      id: '3',
      type: 'export',
      fileName: 'データ分析.xlsx',
      status: 'failed',
      progress: 0,
      startTime: '2024-01-15 14:20:00',
      endTime: '2024-01-15 14:20:30',
      duration: '30秒',
      error: 'APIエンドポイントに接続できませんでした'
    },
    {
      id: '4',
      type: 'upload',
      fileName: 'レポート.docx',
      status: 'pending',
      progress: 0,
      startTime: '2024-01-15 14:35:00'
    }
  ]);

  const getTaskTypeColor = (type: string) => {
    switch (type) {
      case 'upload': return 'blue';
      case 'process': return 'orange';
      case 'export': return 'green';
      default: return 'default';
    }
  };

  const getTaskTypeText = (type: string) => {
    switch (type) {
      case 'upload': return 'アップロード';
      case 'process': return '処理';
      case 'export': return 'エクスポート';
      default: return '不明';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'running': return 'processing';
      case 'failed': return 'error';
      case 'cancelled': return 'default';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return '完了';
      case 'running': return '実行中';
      case 'failed': return '失敗';
      case 'cancelled': return 'キャンセル';
      case 'pending': return '待機中';
      default: return '不明';
    }
  };

  const handleTaskAction = (taskId: string, action: 'pause' | 'resume' | 'cancel' | 'retry') => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        switch (action) {
          case 'pause':
            return { ...task, status: 'cancelled' as const };
          case 'resume':
            return { ...task, status: 'running' as const };
          case 'cancel':
            return { ...task, status: 'cancelled' as const, progress: 0 };
          case 'retry':
            return { ...task, status: 'pending' as const, progress: 0, error: undefined };
          default:
            return task;
        }
      }
      return task;
    }));
  };

  const columns = [
    {
      title: 'タスク',
      key: 'task',
      render: (_: any, record: Task) => (
        <Space direction="vertical" size="small">
          <div>
            <Tag color={getTaskTypeColor(record.type)}>
              {getTaskTypeText(record.type)}
            </Tag>
            <Text strong>{record.fileName}</Text>
          </div>
          {record.details && (
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.details}
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: '状態',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: Task) => (
        <div>
          <Tag color={getStatusColor(status)}>
            {getStatusText(status)}
          </Tag>
          {status === 'running' && (
            <Progress 
              percent={record.progress} 
              size="small" 
              style={{ marginTop: 4 }}
            />
          )}
          {status === 'failed' && record.error && (
            <div style={{ marginTop: 4 }}>
              <Tooltip title={record.error}>
                <Text type="danger" style={{ fontSize: '12px' }} ellipsis>
                  {record.error}
                </Text>
              </Tooltip>
            </div>
          )}
        </div>
      ),
    },
    {
      title: '開始時間',
      dataIndex: 'startTime',
      key: 'startTime',
    },
    {
      title: '実行時間',
      dataIndex: 'duration',
      key: 'duration',
      render: (duration: string) => duration || '-',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Task) => (
        <Space>
          {record.status === 'running' && (
            <Button 
              size="small"
              icon={<PauseCircleOutlined />}
              onClick={() => handleTaskAction(record.id, 'pause')}
            >
              一時停止
            </Button>
          )}
          {record.status === 'pending' && (
            <Button 
              type="primary"
              size="small"
              icon={<PlayCircleOutlined />}
              onClick={() => handleTaskAction(record.id, 'resume')}
            >
              実行
            </Button>
          )}
          {record.status === 'failed' && (
            <Button 
              size="small"
              icon={<ReloadOutlined />}
              onClick={() => handleTaskAction(record.id, 'retry')}
            >
              再試行
            </Button>
          )}
          {(record.status === 'pending' || record.status === 'running') && (
            <Button 
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleTaskAction(record.id, 'cancel')}
            >
              キャンセル
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const taskStats = {
    total: tasks.length,
    running: tasks.filter(t => t.status === 'running').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    failed: tasks.filter(t => t.status === 'failed').length,
    pending: tasks.filter(t => t.status === 'pending').length
  };

  return (
    <div>
      <Title level={2} style={{ marginBottom: 24 }}>
        タスクキュー
      </Title>
      
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={4}>
          <Card>
            <Statistic 
              title="総タスク数" 
              value={taskStats.total} 
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic 
              title="実行中" 
              value={taskStats.running} 
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic 
              title="完了" 
              value={taskStats.completed} 
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic 
              title="失敗" 
              value={taskStats.failed} 
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic 
              title="待機中" 
              value={taskStats.pending} 
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic 
              title="成功率" 
              value={Math.round((taskStats.completed / taskStats.total) * 100)} 
              suffix="%" 
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={16}>
          <Card 
            title="タスク一覧" 
            extra={
              <Space>
                <Button 
                  icon={<FilterOutlined />}
                  onClick={() => {/* フィルター機能 */}}
                >
                  フィルター
                </Button>
                <Button 
                  icon={<ReloadOutlined />}
                  onClick={() => {/* リフレッシュ機能 */}}
                >
                  更新
                </Button>
              </Space>
            }
          >
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Select 
                  defaultValue="all" 
                  style={{ width: 120 }}
                  onChange={(value) => setFilter(prev => ({ ...prev, status: value }))}
                >
                  <Option value="all">すべて</Option>
                  <Option value="running">実行中</Option>
                  <Option value="completed">完了</Option>
                  <Option value="failed">失敗</Option>
                  <Option value="pending">待機中</Option>
                </Select>
                
                <Select 
                  defaultValue="all" 
                  style={{ width: 120 }}
                  onChange={(value) => setFilter(prev => ({ ...prev, type: value }))}
                >
                  <Option value="all">すべて</Option>
                  <Option value="upload">アップロード</Option>
                  <Option value="process">処理</Option>
                  <Option value="export">エクスポート</Option>
                </Select>
                
                <RangePicker 
                  style={{ width: 260 }}
                  onChange={(_dates) => {/* フィルター機能は開発中 */}}
                />
              </Space>
            </div>
            
            <Table 
              columns={columns} 
              dataSource={tasks} 
              rowKey="id"
              pagination={{ pageSize: 10 }}
              size="middle"
            />
          </Card>
        </Col>
        
        <Col span={8}>
          <Card title="最近のアクティビティ">
            <Timeline
              items={[
                {
                  color: 'green',
                  children: (
                    <div>
                      <Text strong>プレゼンテーション資料.pptx</Text>
                      <br />
                      <Text type="secondary">アップロード完了</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        14:30
                      </Text>
                    </div>
                  )
                },
                {
                  color: 'blue',
                  children: (
                    <div>
                      <Text strong>マニュアル.pdf</Text>
                      <br />
                      <Text type="secondary">処理開始</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        14:25
                      </Text>
                    </div>
                  )
                },
                {
                  color: 'red',
                  children: (
                    <div>
                      <Text strong>データ分析.xlsx</Text>
                      <br />
                      <Text type="secondary">エクスポート失敗</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        14:20
                      </Text>
                    </div>
                  )
                }
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Tasks;