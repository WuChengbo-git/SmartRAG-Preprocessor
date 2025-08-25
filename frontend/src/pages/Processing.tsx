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
  Tree,
  Space,
  message,
  Modal,
  Divider,
  Alert,
  Switch,
  Radio
} from 'antd';
import { 
  SettingOutlined, 
  FolderOutlined,
  BulbOutlined,
  SaveOutlined,
  FileTextOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FilePptOutlined,
  FileOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

interface FolderItem {
  id: string;
  name: string;
  parentId?: string;
  children?: FolderItem[];
  files?: FileItem[];
  fileCount?: number;
}

interface FileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  folderId: string;
}

interface ChunkRule {
  id: string;
  name: string;
  method: string;
  size: number;
  overlap: number;
  parentChunk: boolean;
  parentMethod: string;
  parentSize: number;
  parentOverlap: number;
}

const Processing: React.FC = () => {
  const [selectedFolderId, setSelectedFolderId] = useState<string>('1');
  const [selectedRuleId, setSelectedRuleId] = useState<string>('default');
  const [expandedKeys, setExpandedKeys] = useState<string[]>(['1']);
  
  const [folderData, setFolderData] = useState<FolderItem[]>([
    {
      id: '1',
      name: 'プロジェクトA',
      fileCount: 5,
      children: [
        { 
          id: '1-1', 
          name: '資料', 
          parentId: '1', 
          fileCount: 3,
          files: [
            { id: 'f1', name: 'プレゼンテーション資料.pptx', type: 'pptx', size: 2048000, folderId: '1-1' },
            { id: 'f2', name: '会議資料.pdf', type: 'pdf', size: 1024000, folderId: '1-1' },
            { id: 'f3', name: '参考資料.docx', type: 'docx', size: 512000, folderId: '1-1' }
          ]
        },
        { 
          id: '1-2', 
          name: 'マニュアル', 
          parentId: '1', 
          fileCount: 2,
          files: [
            { id: 'f4', name: 'ユーザーマニュアル.pdf', type: 'pdf', size: 5120000, folderId: '1-2' },
            { id: 'f5', name: '操作ガイド.docx', type: 'docx', size: 1536000, folderId: '1-2' }
          ]
        }
      ]
    },
    {
      id: '2',
      name: 'プロジェクトB',
      fileCount: 8,
      children: [
        { 
          id: '2-1', 
          name: '技術文書', 
          parentId: '2', 
          fileCount: 4,
          files: [
            { id: 'f6', name: 'API仕様書.docx', type: 'docx', size: 1024000, folderId: '2-1' },
            { id: 'f7', name: 'データベース設計.xlsx', type: 'xlsx', size: 2048000, folderId: '2-1' },
            { id: 'f8', name: 'システム構成図.pptx', type: 'pptx', size: 3072000, folderId: '2-1' },
            { id: 'f9', name: 'テスト仕様書.pdf', type: 'pdf', size: 1536000, folderId: '2-1' }
          ]
        },
        { 
          id: '2-2', 
          name: '仕様書', 
          parentId: '2', 
          fileCount: 4,
          files: [
            { id: 'f10', name: '要件定義書.docx', type: 'docx', size: 2048000, folderId: '2-2' },
            { id: 'f11', name: '基本設計書.pdf', type: 'pdf', size: 4096000, folderId: '2-2' },
            { id: 'f12', name: '詳細設計書.docx', type: 'docx', size: 3072000, folderId: '2-2' },
            { id: 'f13', name: '運用手順書.pdf', type: 'pdf', size: 1024000, folderId: '2-2' }
          ]
        }
      ]
    }
  ]);

  const [chunkRules, setChunkRules] = useState<ChunkRule[]>([
    {
      id: 'default',
      name: 'デフォルト規則',
      method: 'paragraph',
      size: 500,
      overlap: 50,
      parentChunk: false,
      parentMethod: 'document',
      parentSize: 1000,
      parentOverlap: 100
    },
    {
      id: 'custom1',
      name: '定制規則1',
      method: 'page',
      size: 800,
      overlap: 80,
      parentChunk: true,
      parentMethod: 'section',
      parentSize: 2000,
      parentOverlap: 200
    },
    {
      id: 'custom2',
      name: '定制規則2',
      method: 'token',
      size: 300,
      overlap: 30,
      parentChunk: false,
      parentMethod: 'document',
      parentSize: 1500,
      parentOverlap: 150
    }
  ]);

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
    if (type.includes('docx') || type.includes('doc')) return <FileWordOutlined style={{ color: '#1890ff' }} />;
    if (type.includes('xlsx') || type.includes('xls')) return <FileExcelOutlined style={{ color: '#52c41a' }} />;
    if (type.includes('pptx') || type.includes('ppt')) return <FilePptOutlined style={{ color: '#fa8c16' }} />;
    if (type.includes('txt')) return <FileTextOutlined style={{ color: '#722ed1' }} />;
    return <FileOutlined style={{ color: '#8c8c8c' }} />;
  };

  const generateTreeData = (folders: FolderItem[]): any[] => {
    return folders.map(folder => {
      const children = [];
      
      // Add subfolders
      if (folder.children) {
        children.push(...generateTreeData(folder.children));
      }
      
      // Add files
      if (folder.files) {
        children.push(...folder.files.map(file => ({
          title: (
            <Space>
              {getFileIcon(file.type)}
              <span style={{ fontSize: '12px' }}>{file.name}</span>
            </Space>
          ),
          key: `file-${file.id}`,
          isLeaf: true
        })));
      }

      return {
        title: (
          <Space>
            <FolderOutlined />
            {folder.name}
            <Text type="secondary" style={{ fontSize: '11px' }}>({folder.fileCount || 0})</Text>
          </Space>
        ),
        key: folder.id,
        children: children.length > 0 ? children : undefined
      };
    });
  };

  const getSelectedRule = () => {
    return chunkRules.find(rule => rule.id === selectedRuleId) || chunkRules[0];
  };

  const handleApplyToFolder = () => {
    const selectedFolder = folderData.find(f => f.id === selectedFolderId) || 
                          folderData.flatMap(f => f.children || []).find(f => f.id === selectedFolderId);
    const folderName = selectedFolder?.name || 'フォルダ';
    const ruleName = getSelectedRule().name;
    message.success(`${folderName}に${ruleName}を適用しました`);
  };


  return (
    <div>
      <Title level={2} style={{ marginBottom: 24 }}>
        チャンク設定
      </Title>
      
      <Alert
        message="フォルダ別チャンク設定"
        description="各フォルダに対してチャンク分割ルールを設定できます。左側でフォルダを選択し、右側で詳細なルールを設定してください。"
        type="info"
        style={{ marginBottom: 16 }}
      />
      
      <Row gutter={16}>
        <Col span={6}>
          <Card 
            title={
              <Space>
                <FolderOutlined />
                フォルダ一覧
              </Space>
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
                if (keys.length > 0 && !keys[0].toString().startsWith('file-')) {
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
              title={
                <Space>
                  <SettingOutlined />
                  チャンク分割ルール選択
                </Space>
              }
              size="small"
            >
              <Row gutter={16} align="middle">
                <Col span={6}>
                  <Text strong>適用ルール:</Text>
                </Col>
                <Col span={12}>
                  <Select 
                    value={selectedRuleId} 
                    onChange={setSelectedRuleId}
                    style={{ width: '100%' }}
                    size="middle"
                  >
                    {chunkRules.map(rule => (
                      <Select.Option key={rule.id} value={rule.id}>
                        {rule.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Col>
                <Col span={6}>
                  <Button 
                    type="primary" 
                    icon={<SaveOutlined />}
                    onClick={handleApplyToFolder}
                  >
                    フォルダに適用
                  </Button>
                </Col>
              </Row>
            </Card>
            
            {selectedRuleId === 'default' && (
              <Card 
                title={
                  <Space>
                    <BulbOutlined />
                    デフォルトルール詳細設定
                  </Space>
                }
                size="small"
                style={{ flex: 1 }}
              >
                {(() => {
                  const rule = getSelectedRule();
                  return (
                    <Form layout="vertical" size="small">
                      <Row gutter={24}>
                        <Col span={12}>
                          <Space direction="vertical" style={{ width: '100%' }}>
                            <div>
                              <Text strong>基本設定</Text>
                              <Divider style={{ margin: '8px 0' }} />
                              <Form.Item label="分割方法" style={{ marginBottom: 12 }}>
                                <Select 
                                  value={rule.method}
                                  onChange={(value) => {
                                    setChunkRules(prev => prev.map(r => 
                                      r.id === 'default' ? { ...r, method: value } : r
                                    ));
                                  }}
                                  style={{ width: '100%' }}
                                >
                                  {chunkMethods.map(method => (
                                    <Select.Option key={method.value} value={method.value}>
                                      {method.label}
                                    </Select.Option>
                                  ))}
                                </Select>
                              </Form.Item>
                              
                              <Row gutter={16}>
                                <Col span={12}>
                                  <Form.Item label="チャンクサイズ" style={{ marginBottom: 12 }}>
                                    <InputNumber 
                                      min={100} 
                                      max={2000} 
                                      step={100}
                                      value={rule.size}
                                      onChange={(value) => {
                                        setChunkRules(prev => prev.map(r => 
                                          r.id === 'default' ? { ...r, size: value || 500 } : r
                                        ));
                                      }}
                                      style={{ width: '100%' }}
                                      addonAfter="文字"
                                    />
                                  </Form.Item>
                                </Col>
                                <Col span={12}>
                                  <Form.Item label="オーバーラップ" style={{ marginBottom: 12 }}>
                                    <InputNumber 
                                      min={0} 
                                      max={500} 
                                      step={10}
                                      value={rule.overlap}
                                      onChange={(value) => {
                                        setChunkRules(prev => prev.map(r => 
                                          r.id === 'default' ? { ...r, overlap: value || 0 } : r
                                        ));
                                      }}
                                      style={{ width: '100%' }}
                                      addonAfter="文字"
                                    />
                                  </Form.Item>
                                </Col>
                              </Row>
                            </div>
                            
                            <div>
                              <Row align="middle" style={{ marginBottom: 12 }}>
                                <Col span={12}>
                                  <Text strong>親子チャンク設定</Text>
                                </Col>
                                <Col span={12}>
                                  <Switch 
                                    checked={rule.parentChunk}
                                    onChange={(checked) => {
                                      setChunkRules(prev => prev.map(r => 
                                        r.id === 'default' ? { ...r, parentChunk: checked } : r
                                      ));
                                    }}
                                  />
                                </Col>
                              </Row>
                              <Divider style={{ margin: '8px 0' }} />
                              
                              {rule.parentChunk && (
                                <div>
                                  <Form.Item label="親チャンク分割方法" style={{ marginBottom: 12 }}>
                                    <Select 
                                      value={rule.parentMethod}
                                      onChange={(value) => {
                                        setChunkRules(prev => prev.map(r => 
                                          r.id === 'default' ? { ...r, parentMethod: value } : r
                                        ));
                                      }}
                                      style={{ width: '100%' }}
                                    >
                                      {parentChunkMethods.map(method => (
                                        <Select.Option key={method.value} value={method.value}>
                                          {method.label}
                                        </Select.Option>
                                      ))}
                                    </Select>
                                  </Form.Item>
                                  
                                  <Row gutter={16}>
                                    <Col span={12}>
                                      <Form.Item label="親チャンクサイズ" style={{ marginBottom: 12 }}>
                                        <InputNumber 
                                          min={500} 
                                          max={10000} 
                                          step={100}
                                          value={rule.parentSize}
                                          onChange={(value) => {
                                            setChunkRules(prev => prev.map(r => 
                                              r.id === 'default' ? { ...r, parentSize: value || 1000 } : r
                                            ));
                                          }}
                                          style={{ width: '100%' }}
                                          addonAfter="文字"
                                        />
                                      </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                      <Form.Item label="親オーバーラップ" style={{ marginBottom: 12 }}>
                                        <InputNumber 
                                          min={0} 
                                          max={1000} 
                                          step={50}
                                          value={rule.parentOverlap}
                                          onChange={(value) => {
                                            setChunkRules(prev => prev.map(r => 
                                              r.id === 'default' ? { ...r, parentOverlap: value || 0 } : r
                                            ));
                                          }}
                                          style={{ width: '100%' }}
                                          addonAfter="文字"
                                        />
                                      </Form.Item>
                                    </Col>
                                  </Row>
                                </div>
                              )}
                            </div>
                          </Space>
                        </Col>
                        
                        <Col span={12}>
                          <Alert
                            message="設定説明"
                            description={chunkMethods.find(m => m.value === rule.method)?.description}
                            type="info"
                            showIcon
                            style={{ marginBottom: 16 }}
                          />
                          {rule.parentChunk && (
                            <Alert
                              message="親子チャンク"
                              description="大きなチャンク（親）と小さなチャンク（子）の2階層構造で、より精度の高い検索を実現します。親チャンクで大まかなコンテキストを把握し、子チャンクで詳細な情報を取得できます。"
                              type="success"
                              showIcon
                            />
                          )}
                        </Col>
                      </Row>
                    </Form>
                  );
                })()}
              </Card>
            )}
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default Processing;