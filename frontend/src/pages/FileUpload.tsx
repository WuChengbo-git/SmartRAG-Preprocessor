import React, { useState } from 'react';
import { 
  Upload, 
  Card, 
  Row, 
  Col, 
  Typography, 
  Button, 
  Table, 
  Tag,
  Space,
  message,
  Popconfirm,
  Tooltip,
  Tree,
  Modal,
  Form,
  Input,
  Select,
  Spin,
} from 'antd';
import { 
  InboxOutlined, 
  DeleteOutlined, 
  EyeOutlined, 
  FileTextOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FilePptOutlined,
  FileOutlined,
  FolderOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  LoadingOutlined
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
  uploadTime: string;
  folderId: string;
}

interface FolderItem {
  id: string;
  name: string;
  parentId?: string;
  children?: FolderItem[];
  files?: FileItem[];
}


const FileUpload: React.FC = () => {
  const [form] = Form.useForm();
  const [selectedFolderId, setSelectedFolderId] = useState<string>('1');
  const [newFolderModalVisible, setNewFolderModalVisible] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState<string[]>(['1']);
  
  const [folderData, setFolderData] = useState<FolderItem[]>([
    {
      id: '1',
      name: 'プロジェクトA',
      children: [
        { id: '1-1', name: '資料', parentId: '1' },
        { id: '1-2', name: 'マニュアル', parentId: '1' }
      ]
    },
    {
      id: '2',
      name: 'プロジェクトB',
      children: [
        { id: '2-1', name: '技術文書', parentId: '2' },
        { id: '2-2', name: '仕様書', parentId: '2' }
      ]
    }
  ]);
  
  const [fileList, setFileList] = useState<FileItem[]>([
    {
      id: '1',
      name: 'プレゼンテーション資料.pptx',
      type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      size: 2048000,
      status: 'done',
      uploadTime: '2024-01-15 14:30',
      folderId: '1-1'
    },
    {
      id: '2',
      name: 'マニュアル.pdf',
      type: 'application/pdf',
      size: 5120000,
      status: 'uploading',
      uploadTime: '2024-01-15 14:25',
      folderId: '1-2'
    },
    {
      id: '3',
      name: 'API仕様書.docx',
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      size: 1024000,
      status: 'done',
      uploadTime: '2024-01-15 13:15',
      folderId: '2-2'
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done': return <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 16 }} />;
      case 'uploading': return <Spin indicator={<LoadingOutlined style={{ fontSize: 16 }} />} />;
      case 'error': return <CheckCircleOutlined style={{ color: '#ff4d4f', fontSize: 16 }} />;
      default: return null;
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
          uploadTime: new Date().toLocaleString('ja-JP'),
          folderId: selectedFolderId
        };
        setFileList(prev => {
          const exists = prev.find(f => f.id === newFile.id);
          if (exists) {
            return prev.map(f => f.id === newFile.id ? { ...f, status: 'uploading' } : f);
          }
          return [...prev, { ...newFile, folderId: selectedFolderId }];
        });
      } else if (status === 'done') {
        message.success(`${info.file.name} のアップロードが完了しました。`);
        setFileList(prev => prev.map(f => 
          f.id === info.file.uid 
            ? { ...f, status: 'done' }
            : f
        ));
      } else if (status === 'error') {
        message.error(`${info.file.name} のアップロードに失敗しました。`);
        setFileList(prev => prev.map(f => 
          f.id === info.file.uid 
            ? { ...f, status: 'error' }
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

  
  const handleCreateFolder = (values: { name: string; parentId?: string }) => {
    const newFolder: FolderItem = {
      id: Date.now().toString(),
      name: values.name,
      parentId: values.parentId
    };
    
    setFolderData(prev => {
      if (!values.parentId) {
        return [...prev, newFolder];
      }
      
      const updateFolder = (folders: FolderItem[]): FolderItem[] => {
        return folders.map(folder => {
          if (folder.id === values.parentId) {
            return {
              ...folder,
              children: [...(folder.children || []), newFolder]
            };
          }
          if (folder.children) {
            return {
              ...folder,
              children: updateFolder(folder.children)
            };
          }
          return folder;
        });
      };
      
      return updateFolder(prev);
    });
    
    setNewFolderModalVisible(false);
    message.success('フォルダを作成しました');
  };
  
  const generateTreeData = (folders: FolderItem[]): any[] => {
    return folders.map(folder => ({
      title: (
        <Space>
          <FolderOutlined />
          {folder.name}
          <Text type="secondary">({getFilesInFolder(folder.id).length})</Text>
        </Space>
      ),
      key: folder.id,
      children: folder.children ? generateTreeData(folder.children) : []
    }));
  };
  
  const getFilesInFolder = (folderId: string): FileItem[] => {
    return fileList.filter(file => file.folderId === folderId);
  };
  
  const getCurrentFolderFiles = (): FileItem[] => {
    return getFilesInFolder(selectedFolderId);
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
      render: (status: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {getStatusIcon(status)}
          <span style={{ fontSize: '12px', color: '#666' }}>
            {status === 'uploading' ? 'アップロード中' : status === 'done' ? '完了' : status === 'error' ? 'エラー' : ''}
          </span>
        </div>
      ),
    },
    {
      title: 'アップロード時間',
      dataIndex: 'uploadTime',
      key: 'uploadTime',
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
        ファイル管理
      </Title>
      
      <Row gutter={16}>
        <Col span={6}>
          <Card 
            title={
              <Space>
                <FolderOutlined />
                フォルダ管理
              </Space>
            }
            extra={
              <Button 
                type="text" 
                size="small" 
                icon={<PlusOutlined />}
                onClick={() => setNewFolderModalVisible(true)}
              >
                新規
              </Button>
            }
            size="small"
            style={{ height: '100%' }}
            bodyStyle={{ height: 'calc(100% - 57px)', overflow: 'auto' }}
          >
            <Tree
              showIcon
              defaultExpandedKeys={expandedKeys}
              expandedKeys={expandedKeys}
              onExpand={(keys) => setExpandedKeys(keys as string[])}
              selectedKeys={[selectedFolderId]}
              onSelect={(keys) => {
                if (keys.length > 0) {
                  setSelectedFolderId(keys[0] as string);
                }
              }}
              treeData={generateTreeData(folderData)}
            />
          </Card>
        </Col>
        
        <Col span={18}>
          <Space direction="vertical" style={{ width: '100%', height: '100%' }} size="middle">
            <Card 
              title="ファイルアップロード" 
              extra={
                <Text type="secondary">
                  対応形式: PDF, Word, Excel, PowerPoint, TXT, HTML, CSV
                </Text>
              }
              size="small"
            >
              <Dragger {...uploadProps} style={{ height: 120 }}>
                <p className="ant-upload-drag-icon" style={{ margin: '8px 0' }}>
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text" style={{ margin: '4px 0', fontSize: '14px' }}>
                  ファイルをドラッグ＆ドロップまたはクリックしてアップロード
                </p>
                <p className="ant-upload-hint" style={{ margin: '4px 0', fontSize: '12px' }}>
                  ファイルサイズは100MB以下である必要があります
                </p>
              </Dragger>
            </Card>
            
            <Card 
              title={
                <Title level={4} style={{ margin: 0 }}>
                  現在のフォルダ内ファイル ({getCurrentFolderFiles().length})
                </Title>
              }
            >
              <Table 
                columns={columns} 
                dataSource={getCurrentFolderFiles()} 
                rowKey="id"
                pagination={{ 
                  pageSize: 8,
                  showSizeChanger: false,
                  showQuickJumper: false,
                  showTotal: (total, range) => 
                    `${range[0]}-${range[1]} / ${total} 件`
                }}
                size="small"
              />
            </Card>
          </Space>
        </Col>
      </Row>
      
      {/* 新規フォルダ作成モーダル */}
      <Modal
        title="新規フォルダ作成"
        open={newFolderModalVisible}
        onCancel={() => setNewFolderModalVisible(false)}
        onOk={() => {
          form.validateFields().then(values => {
            handleCreateFolder(values);
          });
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item 
            label="フォルダ名" 
            name="name"
            rules={[{ required: true, message: 'フォルダ名を入力してください' }]}
          >
            <Input placeholder="フォルダ名を入力" />
          </Form.Item>
          
          <Form.Item 
            label="親フォルダ" 
            name="parentId"
          >
            <Select placeholder="ルートフォルダを選択" allowClear>
              {folderData.map(folder => (
                <Select.Option key={folder.id} value={folder.id}>
                  {folder.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FileUpload;