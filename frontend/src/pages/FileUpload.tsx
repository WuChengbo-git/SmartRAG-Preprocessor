import React, { useState } from 'react';
import { 
  Upload, 
  Card, 
  Row, 
  Col, 
  Typography, 
  Button, 
  Table, 
  Progress,
  Tag,
  Space,
  message,
  Popconfirm,
  Tooltip
} from 'antd';
import { 
  InboxOutlined, 
  DeleteOutlined, 
  EyeOutlined, 
  SettingOutlined as ProcessorOutlined,
  FileTextOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FilePptOutlined,
  FileOutlined
} from '@ant-design/icons';
import type { UploadProps } from 'antd/es/upload/interface';

const { Title, Text } = Typography;
const { Dragger } = Upload;

interface FileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  status: 'uploading' | 'done' | 'error';
  progress: number;
  uploadTime: string;
  chunks?: number;
}

const FileUpload: React.FC = () => {
  const [fileList, setFileList] = useState<FileItem[]>([
    {
      id: '1',
      name: 'プレゼンテーション資料.pptx',
      type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      size: 2048000,
      status: 'done',
      progress: 100,
      uploadTime: '2024-01-15 14:30',
      chunks: 25
    },
    {
      id: '2',
      name: 'マニュアル.pdf',
      type: 'application/pdf',
      size: 5120000,
      status: 'uploading',
      progress: 65,
      uploadTime: '2024-01-15 14:25'
    }
  ]);

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FilePdfOutlined style={{ color: '#ff4d4f' }} />;
    if (type.includes('word')) return <FileWordOutlined style={{ color: '#1890ff' }} />;
    if (type.includes('excel')) return <FileExcelOutlined style={{ color: '#52c41a' }} />;
    if (type.includes('presentation')) return <FilePptOutlined style={{ color: '#fa8c16' }} />;
    if (type.includes('text')) return <FileTextOutlined style={{ color: '#722ed1' }} />;
    return <FileOutlined style={{ color: '#8c8c8c' }} />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'done': return <Tag color="success">完了</Tag>;
      case 'uploading': return <Tag color="processing">アップロード中</Tag>;
      case 'error': return <Tag color="error">エラー</Tag>;
      default: return <Tag color="default">待機中</Tag>;
    }
  };

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: true,
    action: '/api/v1/upload/files',
    accept: '.pdf,.docx,.xlsx,.pptx,.txt,.html,.csv',
    showUploadList: false,
    beforeUpload: (file) => {
      const isLt100M = file.size / 1024 / 1024 < 100;
      if (!isLt100M) {
        message.error('ファイルサイズは100MB以下である必要があります！');
        return false;
      }
      return true;
    },
    onChange: (info) => {
      const { status } = info.file;
      if (status === 'uploading') {
        const newFile: FileItem = {
          id: info.file.uid,
          name: info.file.name,
          type: info.file.type || 'application/octet-stream',
          size: info.file.size || 0,
          status: 'uploading',
          progress: info.file.percent || 0,
          uploadTime: new Date().toLocaleString('ja-JP')
        };
        setFileList(prev => {
          const exists = prev.find(f => f.id === newFile.id);
          if (exists) {
            return prev.map(f => f.id === newFile.id ? { ...f, progress: newFile.progress } : f);
          }
          return [...prev, newFile];
        });
      } else if (status === 'done') {
        message.success(`${info.file.name} のアップロードが完了しました。`);
        setFileList(prev => prev.map(f => 
          f.id === info.file.uid 
            ? { ...f, status: 'done', progress: 100 }
            : f
        ));
      } else if (status === 'error') {
        message.error(`${info.file.name} のアップロードに失敗しました。`);
        setFileList(prev => prev.map(f => 
          f.id === info.file.uid 
            ? { ...f, status: 'error', progress: 0 }
            : f
        ));
      }
    },
    onDrop: (e) => {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  const handleDelete = (id: string) => {
    setFileList(prev => prev.filter(f => f.id !== id));
    message.success('ファイルを削除しました');
  };

  const handleProcess = (_id: string) => {
    message.info('処理を開始します...');
    // 処理ページに遷移またはモーダルを開く
  };

  const columns = [
    {
      title: 'ファイル名',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: FileItem) => (
        <Space>
          {getFileIcon(record.type)}
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: 'サイズ',
      dataIndex: 'size',
      key: 'size',
      render: (size: number) => formatFileSize(size),
    },
    {
      title: '状態',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: FileItem) => (
        <div>
          {getStatusTag(status)}
          {status === 'uploading' && (
            <Progress 
              percent={record.progress} 
              size="small" 
              style={{ marginTop: 4 }}
            />
          )}
        </div>
      ),
    },
    {
      title: 'アップロード時間',
      dataIndex: 'uploadTime',
      key: 'uploadTime',
    },
    {
      title: 'チャンク数',
      dataIndex: 'chunks',
      key: 'chunks',
      render: (chunks: number) => chunks ? `${chunks} チャンク` : '-',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: FileItem) => (
        <Space>
          <Tooltip title="プレビュー">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              size="small"
              disabled={record.status !== 'done'}
            />
          </Tooltip>
          <Tooltip title="処理">
            <Button 
              type="text" 
              icon={<ProcessorOutlined />} 
              size="small"
              disabled={record.status !== 'done'}
              onClick={() => handleProcess(record.id)}
            />
          </Tooltip>
          <Tooltip title="削除">
            <Popconfirm
              title="ファイルを削除しますか？"
              onConfirm={() => handleDelete(record.id)}
              okText="削除"
              cancelText="キャンセル"
            >
              <Button 
                type="text" 
                icon={<DeleteOutlined />} 
                size="small"
                danger
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={2} style={{ marginBottom: 24 }}>
        ファイルアップロード
      </Title>
      
      <Row gutter={16}>
        <Col span={24}>
          <Card 
            title="ファイルをアップロード" 
            extra={
              <Text type="secondary">
                対応形式: PDF, Word, Excel, PowerPoint, TXT, HTML, CSV
              </Text>
            }
          >
            <Dragger {...uploadProps} style={{ marginBottom: 24 }}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                ファイルをドラッグ＆ドロップするか、クリックしてアップロード
              </p>
              <p className="ant-upload-hint">
                単一ファイルまたは複数ファイルのアップロードに対応しています。
                ファイルサイズは100MB以下である必要があります。
              </p>
            </Dragger>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: 16 
            }}>
              <Title level={4} style={{ margin: 0 }}>
                アップロード済みファイル ({fileList.length})
              </Title>
              <Button 
                type="primary" 
                disabled={fileList.filter(f => f.status === 'done').length === 0}
              >
                選択したファイルを処理
              </Button>
            </div>
            
            <Table 
              columns={columns} 
              dataSource={fileList} 
              rowKey="id"
              pagination={{ 
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => 
                  `${range[0]}-${range[1]} / ${total} 件`
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default FileUpload;