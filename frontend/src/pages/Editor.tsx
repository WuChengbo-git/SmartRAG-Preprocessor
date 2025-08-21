import React, { useState } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Button, 
  Space, 
  Tag, 
  Divider, 
  Switch, 
  Input, 
  Select,
  Modal,
  Form,
  Table,
  Tooltip,
  Alert,
  Tabs
} from 'antd';
import { 
  EditOutlined, 
  EyeOutlined, 
  MergeCellsOutlined, 
  SplitCellsOutlined,
  FileTextOutlined,
  SaveOutlined,
  UndoOutlined,
  RedoOutlined,
  SettingOutlined,
  SearchOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;

interface ChunkItem {
  id: number;
  content: string;
  html: string;
  markdown: string;
  startPos: number;
  endPos: number;
  tokens: number;
  metadata: {
    page?: number;
    section?: string;
    type: string;
  };
}

interface DocumentData {
  id: string;
  name: string;
  fullText: string;
  chunks: ChunkItem[];
  metadata: {
    category: string;
    tags: string[];
    source: string;
    author: string;
    date: string;
    description: string;
  };
}

const Editor: React.FC = () => {
  const [viewMode, setViewMode] = useState<'html' | 'markdown'>('html');
  const [selectedChunk, setSelectedChunk] = useState<number | null>(null);
  const [editingChunk, setEditingChunk] = useState<ChunkItem | null>(null);
  const [metadataModalVisible, setMetadataModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  const documentData: DocumentData = {
    id: '1',
    name: 'SmartRAG システム仕様書.pdf',
    fullText: `SmartRAGシステムの概要

このドキュメントは、SmartRAGシステムの概要と使用方法について説明します。RAG（Retrieval-Augmented Generation）は、検索機能を強化した生成AIの手法です。

主な機能と特徴

システムの主な機能には、文書の自動分割、ベクトル化処理、検索インデックスの構築が含まれます。これらの機能により、効率的な情報検索が可能になります。

使用方法とセットアップ

SmartRAGシステムを使用するには、まずファイルをアップロードし、適切な設定を行います。システムは多様な文書形式に対応しており、PDF、Word、Excel、PowerPointなどのファイルを処理できます。

設定とカスタマイズ

ユーザーは、チャンクサイズ、オーバーラップ、分割方法などの各種パラメータをカスタマイズできます。これにより、文書の特性に応じた最適な処理が可能になります。`,
    chunks: [
      {
        id: 1,
        content: 'SmartRAGシステムの概要\n\nこのドキュメントは、SmartRAGシステムの概要と使用方法について説明します。RAG（Retrieval-Augmented Generation）は、検索機能を強化した生成AIの手法です。',
        html: '<h2>SmartRAGシステムの概要</h2><p>このドキュメントは、SmartRAGシステムの概要と使用方法について説明します。RAG（Retrieval-Augmented Generation）は、検索機能を強化した生成AIの手法です。</p>',
        markdown: '## SmartRAGシステムの概要\n\nこのドキュメントは、SmartRAGシステムの概要と使用方法について説明します。RAG（Retrieval-Augmented Generation）は、検索機能を強化した生成AIの手法です。',
        startPos: 0,
        endPos: 120,
        tokens: 45,
        metadata: { page: 1, section: '概要', type: 'heading' }
      },
      {
        id: 2,
        content: '主な機能と特徴\n\nシステムの主な機能には、文書の自動分割、ベクトル化処理、検索インデックスの構築が含まれます。これらの機能により、効率的な情報検索が可能になります。',
        html: '<h3>主な機能と特徴</h3><p>システムの主な機能には、文書の自動分割、ベクトル化処理、検索インデックスの構築が含まれます。これらの機能により、効率的な情報検索が可能になります。</p>',
        markdown: '### 主な機能と特徴\n\nシステムの主な機能には、文書の自動分割、ベクトル化処理、検索インデックスの構築が含まれます。これらの機能により、効率的な情報検索が可能になります。',
        startPos: 121,
        endPos: 230,
        tokens: 52,
        metadata: { page: 1, section: '機能', type: 'heading' }
      },
      {
        id: 3,
        content: 'システムを使用するには、まずファイルをアップロードし、適切な設定を行います。システムは多様な文書形式に対応しており、PDF、Word、Excel、PowerPointなどのファイルを処理できます。',
        html: '<p>システムを使用するには、まずファイルをアップロードし、適切な設定を行います。システムは多様な文書形式に対応しており、PDF、Word、Excel、PowerPointなどのファイルを処理できます。</p>',
        markdown: 'システムを使用するには、まずファイルをアップロードし、適切な設定を行います。システムは多様な文書形式に対応しており、PDF、Word、Excel、PowerPointなどのファイルを処理できます。',
        startPos: 231,
        endPos: 340,
        tokens: 38,
        metadata: { page: 2, section: '使用方法', type: 'paragraph' }
      },
      {
        id: 4,
        content: 'ユーザーは、チャンクサイズ、オーバーラップ、分割方法などの各種パラメータをカスタマイズできます。これにより、文書の特性に応じた最適な処理が可能になります。',
        html: '<p>ユーザーは、チャンクサイズ、オーバーラップ、分割方法などの各種パラメータをカスタマイズできます。これにより、文書の特性に応じた最適な処理が可能になります。</p>',
        markdown: 'ユーザーは、チャンクサイズ、オーバーラップ、分割方法などの各種パラメータをカスタマイズできます。これにより、文書の特性に応じた最適な処理が可能になります。',
        startPos: 341,
        endPos: 450,
        tokens: 42,
        metadata: { page: 2, section: '設定', type: 'paragraph' }
      }
    ],
    metadata: {
      category: '技術仕様書',
      tags: ['RAG', 'AI', 'システム仕様'],
      source: 'internal',
      author: '開発チーム',
      date: '2024-01-15',
      description: 'SmartRAGシステムの概要と使用方法についての技術仕様書'
    }
  };

  const highlightText = (text: string, chunk: ChunkItem) => {
    if (selectedChunk !== chunk.id) return text;
    
    const before = text.substring(0, chunk.startPos);
    const highlighted = text.substring(chunk.startPos, chunk.endPos);
    const after = text.substring(chunk.endPos);
    
    return (
      <>
        {before}
        <span style={{ 
          backgroundColor: '#fffbe6', 
          border: '2px solid #faad14',
          padding: '2px 4px',
          borderRadius: '4px'
        }}>
          {highlighted}
        </span>
        {after}
      </>
    );
  };

  const handleChunkEdit = (chunk: ChunkItem) => {
    setEditingChunk(chunk);
  };

  const handleSaveChunk = () => {
    // Save chunk logic
    setEditingChunk(null);
  };

  const chunkColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 50,
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      render: (text: string) => (
        <Text ellipsis={{ tooltip: text }} style={{ maxWidth: 200 }}>
          {text}
        </Text>
      ),
    },
    {
      title: 'トークン',
      dataIndex: 'tokens',
      key: 'tokens',
      width: 80,
    },
    {
      title: 'ページ',
      key: 'page',
      width: 80,
      render: (_: any, record: ChunkItem) => record.metadata.page || '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: ChunkItem) => (
        <Space>
          <Button 
            type="text" 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => handleChunkEdit(record)}
          />
          <Button 
            type="text" 
            size="small" 
            icon={<MergeCellsOutlined />}
          />
          <Button 
            type="text" 
            size="small" 
            icon={<SplitCellsOutlined />}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={2} style={{ marginBottom: 24 }}>
        文書編集とチャンク管理
      </Title>
      
      <Alert
        message={`編集中: ${documentData.name}`}
        description={`カテゴリ: ${documentData.metadata.category} | 作成者: ${documentData.metadata.author} | 総チャンク数: ${documentData.chunks.length}`}
        type="info"
        style={{ marginBottom: 16 }}
        action={
          <Button 
            size="small" 
            icon={<SettingOutlined />}
            onClick={() => setMetadataModalVisible(true)}
          >
            メタデータ編集
          </Button>
        }
      />
      
      <Row gutter={16}>
        <Col span={10}>
          <Card 
            title={
              <Space>
                <FileTextOutlined />
                全文表示
              </Space>
            }
            extra={
              <Space>
                <Input.Search
                  placeholder="文書内検索"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: 200 }}
                  size="small"
                />
              </Space>
            }
            size="small"
          >
            <div 
              style={{ 
                height: '600px', 
                overflow: 'auto',
                padding: '16px',
                background: '#fafafa',
                fontSize: '14px',
                lineHeight: '1.6',
                fontFamily: 'Georgia, serif',
                whiteSpace: 'pre-wrap',
                border: '1px solid #d9d9d9',
                borderRadius: '4px'
              }}
            >
              {documentData.chunks.map(chunk => (
                <div
                  key={chunk.id}
                  onClick={() => setSelectedChunk(chunk.id)}
                  style={{
                    cursor: 'pointer',
                    display: 'inline'
                  }}
                >
                  {highlightText(documentData.fullText, chunk)}
                </div>
              ))}
            </div>
          </Card>
        </Col>
        
        <Col span={8}>
          <Card 
            title="チャンク一覧" 
            extra={
              <Space>
                <Button size="small" icon={<MergeCellsOutlined />}>
                  結合
                </Button>
                <Button size="small" icon={<SplitCellsOutlined />}>
                  分割
                </Button>
              </Space>
            }
            size="small"
          >
            <Table
              columns={chunkColumns}
              dataSource={documentData.chunks}
              rowKey="id"
              size="small"
              pagination={false}
              scroll={{ y: 500 }}
              onRow={(record) => ({
                onClick: () => setSelectedChunk(record.id),
                style: {
                  backgroundColor: selectedChunk === record.id ? '#e6f7ff' : undefined,
                  cursor: 'pointer'
                }
              })}
            />
          </Card>
        </Col>
        
        <Col span={6}>
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <Card 
              title="チャンク詳細"
              size="small"
            >
              {selectedChunk ? (
                <div>
                  {(() => {
                    const chunk = documentData.chunks.find(c => c.id === selectedChunk);
                    return chunk ? (
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <div>
                          <Text strong>ID:</Text> {chunk.id}
                        </div>
                        <div>
                          <Text strong>位置:</Text> {chunk.startPos}-{chunk.endPos}
                        </div>
                        <div>
                          <Text strong>トークン数:</Text> {chunk.tokens}
                        </div>
                        <div>
                          <Text strong>タイプ:</Text> {chunk.metadata.type}
                        </div>
                        <div>
                          <Text strong>セクション:</Text> {chunk.metadata.section}
                        </div>
                        <Divider />
                        <Button 
                          type="primary" 
                          block 
                          icon={<EditOutlined />}
                          onClick={() => handleChunkEdit(chunk)}
                        >
                          編集
                        </Button>
                      </Space>
                    ) : null;
                  })()}
                </div>
              ) : (
                <Text type="secondary">チャンクを選択してください</Text>
              )}
            </Card>
            
            <Card 
              title="操作パネル"
              size="small"
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button block icon={<SaveOutlined />}>
                  変更を保存
                </Button>
                <Button block icon={<UndoOutlined />}>
                  元に戻す
                </Button>
                <Button block icon={<RedoOutlined />}>
                  やり直し
                </Button>
                <Divider />
                <Button block>
                  エクスポート
                </Button>
              </Space>
            </Card>
          </Space>
        </Col>
      </Row>

      {/* チャンク編集モーダル */}
      <Modal
        title={`チャンク ${editingChunk?.id} を編集`}
        open={!!editingChunk}
        onCancel={() => setEditingChunk(null)}
        width={800}
        footer={[
          <Button key="cancel" onClick={() => setEditingChunk(null)}>
            キャンセル
          </Button>,
          <Button key="save" type="primary" onClick={handleSaveChunk}>
            保存
          </Button>
        ]}
      >
        {editingChunk && (
          <Tabs defaultActiveKey="1">
            <TabPane tab="内容編集" key="1">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Text strong>原文（参考）:</Text>
                  <div style={{ 
                    background: '#f5f5f5', 
                    padding: '8px', 
                    borderRadius: '4px',
                    fontSize: '12px',
                    marginTop: '4px'
                  }}>
                    {editingChunk.content}
                  </div>
                </div>
                
                <div>
                  <Text strong>編集内容:</Text>
                  <TextArea
                    rows={6}
                    defaultValue={editingChunk.content}
                    style={{ marginTop: '4px' }}
                  />
                </div>
                
                <div>
                  <Switch 
                    checked={viewMode === 'html'}
                    onChange={(checked) => setViewMode(checked ? 'html' : 'markdown')}
                    checkedChildren="HTML"
                    unCheckedChildren="Markdown"
                  />
                </div>
                
                <div>
                  <Text strong>プレビュー:</Text>
                  <div 
                    style={{ 
                      border: '1px solid #d9d9d9', 
                      padding: '16px',
                      borderRadius: '4px',
                      marginTop: '4px'
                    }}
                    dangerouslySetInnerHTML={{ 
                      __html: editingChunk.html
                    }}
                  />
                </div>
              </Space>
            </TabPane>
            
            <TabPane tab="メタデータ" key="2">
              <Form layout="vertical" size="small">
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="ページ番号">
                      <InputNumber 
                        min={1} 
                        defaultValue={editingChunk.metadata.page} 
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="セクション">
                      <Input defaultValue={editingChunk.metadata.section} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="タイプ">
                      <Select defaultValue={editingChunk.metadata.type} style={{ width: '100%' }}>
                        <Select.Option value="heading">見出し</Select.Option>
                        <Select.Option value="paragraph">段落</Select.Option>
                        <Select.Option value="list">リスト</Select.Option>
                        <Select.Option value="table">表</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="トークン数">
                      <InputNumber 
                        min={1} 
                        defaultValue={editingChunk.tokens} 
                        style={{ width: '100%' }}
                        disabled
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </TabPane>
          </Tabs>
        )}
      </Modal>

      {/* メタデータ編集モーダル */}
      <Modal
        title="ドキュメントメタデータ編集"
        open={metadataModalVisible}
        onCancel={() => setMetadataModalVisible(false)}
        width={600}
        footer={[
          <Button key="cancel" onClick={() => setMetadataModalVisible(false)}>
            キャンセル
          </Button>,
          <Button key="save" type="primary" onClick={() => {
            setMetadataModalVisible(false);
          }}>
            保存
          </Button>
        ]}
      >
        <Form form={form} layout="vertical" initialValues={documentData.metadata}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="カテゴリ" name="category">
                <Select>
                  <Select.Option value="技術仕様書">技術仕様書</Select.Option>
                  <Select.Option value="マニュアル">マニュアル</Select.Option>
                  <Select.Option value="プレゼンテーション">プレゼンテーション</Select.Option>
                  <Select.Option value="レポート">レポート</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="作成者" name="author">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="ソース" name="source">
                <Select>
                  <Select.Option value="internal">内部文書</Select.Option>
                  <Select.Option value="external">外部文書</Select.Option>
                  <Select.Option value="public">公開文書</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="作成日" name="date">
                <Input type="date" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item label="タグ" name="tags">
            <Select mode="tags" placeholder="タグを入力">
              <Select.Option value="RAG">RAG</Select.Option>
              <Select.Option value="AI">AI</Select.Option>
              <Select.Option value="システム仕様">システム仕様</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item label="説明" name="description">
            <TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Editor;