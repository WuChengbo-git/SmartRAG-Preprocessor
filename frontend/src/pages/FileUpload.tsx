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
  Tooltip,
  Tree,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Divider,
  Alert,
  Collapse,
  Switch
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
  FileOutlined,
  FolderOutlined,
  FolderOpenOutlined,
  PlusOutlined,
  PlayCircleOutlined,
  BulbOutlined
} from '@ant-design/icons';
import type { UploadProps } from 'antd/es/upload/interface';

const { Title, Text } = Typography;
const { Dragger } = Upload;
const { Panel } = Collapse;

interface FileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  status: 'uploading' | 'done' | 'error';
  progress: number;
  uploadTime: string;
  chunks?: number;
  folderId: string;
}

interface FolderItem {
  id: string;
  name: string;
  parentId?: string;
  children?: FolderItem[];
  files?: FileItem[];
}

interface ChunkConfig {
  method: string;
  size: number;
  overlap: number;
  parentChunk: boolean;
  parentMethod: string;
  parentSize: number;
  parentOverlap: number;
}

const FileUpload: React.FC = () => {
  const [form] = Form.useForm();
  const [selectedFolderId, setSelectedFolderId] = useState<string>('1');
  const [configModalVisible, setConfigModalVisible] = useState(false);
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
      progress: 100,
      uploadTime: '2024-01-15 14:30',
      chunks: 25,
      folderId: '1-1'
    },
    {
      id: '2',
      name: 'マニュアル.pdf',
      type: 'application/pdf',
      size: 5120000,
      status: 'uploading',
      progress: 65,
      uploadTime: '2024-01-15 14:25',
      folderId: '1-2'
    },
    {
      id: '3',
      name: 'API仕様書.docx',
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      size: 1024000,
      status: 'done',
      progress: 100,
      uploadTime: '2024-01-15 13:15',
      chunks: 18,
      folderId: '2-2'
    }
  ]);
  
  const [chunkConfig, setChunkConfig] = useState<ChunkConfig>({
    method: 'paragraph',
    size: 500,
    overlap: 50,
    parentChunk: true,
    parentMethod: 'document',
    parentSize: 1000,
    parentOverlap: 100
  });

  const chunkMethods = [
    { value: 'paragraph', label: '段落ごと', description: 'テキストを段落単位で分割' },
    { value: 'page', label: 'ページごと', description: 'ドキュメントをページ単位で分割' },
    { value: 'heading', label: '見出しごと', description: '見出しを基準にして分割' },
    { value: 'sentence', label: '文章ごと', description: '文章単位で分割' },
    { value: 'token', label: 'トークンごと', description: 'トークン数を基準にして分割' }
  ];

  const parentChunkMethods = [
    { value: 'document', label: 'ドキュメント全体', description: '文書全体を一つの親チャンクとして扱う' },
    { value: 'section', label: 'セクションごと', description: '大きなセクション単位で分割' },
    { value: 'page_group', label: 'ページ群ごと', description: '複数ページをまとめて分割' },
    { value: 'token_large', label: '大きなトークン単位', description: '大きなトークン数で分割' },
    { value: 'fixed_size', label: '固定サイズ', description: '指定された文字数で分割' }
  ];

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
          uploadTime: new Date().toLocaleString('ja-JP'),
          folderId: selectedFolderId
        };
        setFileList(prev => {
          const exists = prev.find(f => f.id === newFile.id);
          if (exists) {
            return prev.map(f => f.id === newFile.id ? { ...f, progress: newFile.progress } : f);
          }
          return [...prev, { ...newFile, folderId: selectedFolderId }];
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
    setConfigModalVisible(true);
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
  
  const handleStartBatchProcessing = () => {
    const readyFiles = getCurrentFolderFiles().filter(f => f.status === 'done');
    if (readyFiles.length === 0) {
      message.warning('処理可能なファイルがありません');
      return;
    }
    setConfigModalVisible(true);
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
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
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
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center'
                }}>
                  <Title level={4} style={{ margin: 0 }}>
                    現在のフォルダ内ファイル ({getCurrentFolderFiles().length})
                  </Title>
                  <Space>
                    <Button 
                      type="primary" 
                      icon={<PlayCircleOutlined />}
                      disabled={getCurrentFolderFiles().filter(f => f.status === 'done').length === 0}
                      onClick={handleStartBatchProcessing}
                    >
                      一括処理開始
                    </Button>
                  </Space>
                </div>
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
      
      {/* チャンク設定モーダル */}
      <Modal
        title="チャンク分割設定"
        open={configModalVisible}
        onCancel={() => setConfigModalVisible(false)}
        width={600}
        footer={[
          <Button key="cancel" onClick={() => setConfigModalVisible(false)}>
            キャンセル
          </Button>,
          <Button key="submit" type="primary" onClick={() => {
            setConfigModalVisible(false);
            message.success('処理を開始しました');
          }}>
            処理開始
          </Button>
        ]}
      >
        <Collapse defaultActiveKey={['1', '2']} size="small">
          <Panel header={
            <Space>
              <BulbOutlined />
              基本設定
            </Space>
          } key="1">
            <Form form={form} layout="vertical" size="small">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item 
                    label="分割手法" 
                    name="chunkMethod"
                    initialValue={chunkConfig.method}
                  >
                    <Select>
                      {chunkMethods.map(method => (
                        <Select.Option key={method.value} value={method.value}>
                          <div>
                            <div>{method.label}</div>
                            <Text type="secondary" style={{ fontSize: '11px' }}>
                              {method.description}
                            </Text>
                          </div>
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item 
                    label="チャンクサイズ" 
                    name="chunkSize"
                    initialValue={chunkConfig.size}
                  >
                    <InputNumber 
                      min={100} 
                      max={2000} 
                      step={100} 
                      style={{ width: '100%' }}
                      addonAfter="文字"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item 
                    label="オーバーラップ" 
                    name="chunkOverlap"
                    initialValue={chunkConfig.overlap}
                  >
                    <InputNumber 
                      min={0} 
                      max={500} 
                      step={10} 
                      style={{ width: '100%' }}
                      addonAfter="文字"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Panel>
          
          <Panel header="親子チャンク設定" key="2">
            <Alert 
              message="親子チャンクとは"
              description="大きなチャンク（親）と小さなチャンク（子）の2階層構造で、より精度の高い検索を実現します。親チャンクで大まかなコンテキストを把握し、子チャンクで詳細な情報を取得できます。"
              type="info"
              style={{ marginBottom: 16 }}
            />
            <Form layout="vertical" size="small">
              <Form.Item 
                label="親子チャンクを使用する"
                name="parentChunk"
                valuePropName="checked"
                initialValue={chunkConfig.parentChunk}
              >
                <Switch 
                  onChange={(checked) => {
                    form.setFieldsValue({ parentChunk: checked });
                    // 強制的にフォームを再レンダリング
                    setChunkConfig(prev => ({ ...prev, parentChunk: checked }));
                  }}
                />
              </Form.Item>
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item 
                    label="親チャンク分割方法" 
                    name="parentMethod"
                    initialValue={chunkConfig.parentMethod}
                  >
                    <Select 
                      disabled={!chunkConfig.parentChunk}
                      onChange={(value) => {
                        form.setFieldsValue({ parentMethod: value });
                      }}
                    >
                      {parentChunkMethods.map(method => (
                        <Select.Option key={method.value} value={method.value}>
                          <div>
                            <div>{method.label}</div>
                            <Text type="secondary" style={{ fontSize: '11px' }}>
                              {method.description}
                            </Text>
                          </div>
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item 
                    label="親チャンクサイズ" 
                    name="parentSize"
                    initialValue={chunkConfig.parentSize}
                  >
                    <InputNumber 
                      min={500} 
                      max={10000} 
                      step={100} 
                      style={{ width: '100%' }}
                      addonAfter="文字"
                      disabled={!chunkConfig.parentChunk}
                    />
                  </Form.Item>
                </Col>
              </Row>
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item 
                    label="親チャンクオーバーラップ" 
                    name="parentOverlap"
                    initialValue={chunkConfig.parentOverlap}
                  >
                    <InputNumber 
                      min={0} 
                      max={1000} 
                      step={50} 
                      style={{ width: '100%' }}
                      addonAfter="文字"
                      disabled={!chunkConfig.parentChunk}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <div style={{ marginTop: '24px' }}>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      親チャンクのサイズは子チャンクの2-10倍程度に設定することを推奨します
                    </Text>
                  </div>
                </Col>
              </Row>
              
              <Alert 
                message="設定例"
                description={
                  <div>
                    <div><strong>文書全体:</strong> 単一ファイル向け、全体をコンテキストとして使用</div>
                    <div><strong>セクションごと:</strong> 章単位での分割、構造化された文書向け</div>
                    <div><strong>固定サイズ:</strong> 均等な分割、一般的な文書向け</div>
                  </div>
                }
                type="info"
                style={{ marginTop: 16 }}
              />
            </Form>
          </Panel>
        </Collapse>
      </Modal>
      
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