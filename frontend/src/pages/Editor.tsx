import React, { useState } from 'react';
import { Card, Row, Col, Typography, Button, Space, Tag, Divider, Switch } from 'antd';
import { EditOutlined, EyeOutlined, MergeCellsOutlined, SplitCellsOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const Editor: React.FC = () => {
  const [viewMode, setViewMode] = useState<'html' | 'markdown'>('html');
  const [selectedChunk, setSelectedChunk] = useState<number | null>(null);

  const chunks = [
    {
      id: 1,
      content: 'SmartRAGシステムの概要について説明します。',
      html: '<h2>SmartRAGシステムの概要</h2><p>このシステムは、RAG（Retrieval-Augmented Generation）技術を用いて、効率的な文書処理を実現します。</p>',
      markdown: '## SmartRAGシステムの概要\n\nこのシステムは、RAG（Retrieval-Augmented Generation）技術を用いて、効率的な文書処理を実現します。'
    },
    {
      id: 2,
      content: '主な機能と特徴について詳しく解説します。',
      html: '<h3>主な機能</h3><ul><li>文書の自動分割</li><li>ベクトル化処理</li><li>検索インデックス構築</li></ul>',
      markdown: '### 主な機能\n\n- 文書の自動分割\n- ベクトル化処理\n- 検索インデックス構築'
    },
    {
      id: 3,
      content: 'システムの使用方法と設定について説明します。',
      html: '<h3>使用方法</h3><p>システムを使用するには、まずファイルをアップロードし、適切な設定を行います。</p>',
      markdown: '### 使用方法\n\nシステムを使用するには、まずファイルをアップロードし、適切な設定を行います。'
    }
  ];

  return (
    <div>
      <Title level={2} style={{ marginBottom: 24 }}>
        ビジュアルエディタ
      </Title>
      
      <Row gutter={16}>
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
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              {chunks.map((chunk) => (
                <Card 
                  key={chunk.id}
                  size="small"
                  hoverable
                  style={{ 
                    cursor: 'pointer',
                    border: selectedChunk === chunk.id ? '2px solid #1890ff' : '1px solid #d9d9d9'
                  }}
                  onClick={() => setSelectedChunk(chunk.id)}
                >
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Space>
                      <Tag color="blue">チャンク {chunk.id}</Tag>
                      <Tag color="green">HTML</Tag>
                    </Space>
                    <Paragraph 
                      ellipsis={{ rows: 2 }}
                      style={{ margin: 0, fontSize: '12px' }}
                    >
                      {chunk.content}
                    </Paragraph>
                  </Space>
                </Card>
              ))}
            </Space>
          </Card>
        </Col>
        
        <Col span={16}>
          <Card 
            title={
              <Space>
                <EditOutlined />
                編集エリア
              </Space>
            }
            extra={
              <Space>
                <Switch 
                  checked={viewMode === 'html'}
                  onChange={(checked) => setViewMode(checked ? 'html' : 'markdown')}
                  checkedChildren="HTML"
                  unCheckedChildren="Markdown"
                />
                <Button icon={<EyeOutlined />}>
                  プレビュー
                </Button>
              </Space>
            }
          >
            {selectedChunk ? (
              <div>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div style={{ 
                    background: '#f5f5f5', 
                    padding: '16px', 
                    borderRadius: '4px',
                    minHeight: '400px',
                    fontFamily: 'monospace'
                  }}>
                    {viewMode === 'html' 
                      ? chunks.find(c => c.id === selectedChunk)?.html 
                      : chunks.find(c => c.id === selectedChunk)?.markdown
                    }
                  </div>
                  
                  <Divider />
                  
                  <div>
                    <Title level={5}>プレビュー</Title>
                    <div 
                      style={{ 
                        border: '1px solid #d9d9d9', 
                        padding: '16px',
                        borderRadius: '4px'
                      }}
                      dangerouslySetInnerHTML={{ 
                        __html: chunks.find(c => c.id === selectedChunk)?.html || ''
                      }}
                    />
                  </div>
                </Space>
              </div>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '60px 0',
                color: '#999'
              }}>
                左側からチャンクを選択して編集を開始してください
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Editor;