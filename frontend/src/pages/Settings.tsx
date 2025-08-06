import React, { useState } from 'react';
import { 
  Card, 
  Typography, 
  Form, 
  Input, 
  InputNumber, 
  Switch, 
  Button, 
  Select,
  Divider,
  Space,
  message,
  Tabs,
  Alert
} from 'antd';
import { 
  SettingOutlined, 
  DatabaseOutlined, 
  SecurityScanOutlined,
  NotificationOutlined,
  SaveOutlined,
  ReloadOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const Settings: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSave = async (_values: any) => {
    setLoading(true);
    try {
      // API呼び出しをシミュレート
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('設定が保存されました');
    } catch (error) {
      message.error('設定の保存に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    message.info('設定をリセットしました');
  };

  const generalSettings = (
    <Form form={form} layout="vertical" onFinish={handleSave}>
      <Title level={4}>一般設定</Title>
      
      <Form.Item 
        label="最大ファイルサイズ (MB)" 
        name="maxFileSize"
        initialValue={100}
      >
        <InputNumber 
          min={1} 
          max={1000} 
          style={{ width: '100%' }}
        />
      </Form.Item>
      
      <Form.Item 
        label="同時処理数" 
        name="concurrentTasks"
        initialValue={3}
      >
        <InputNumber 
          min={1} 
          max={10} 
          style={{ width: '100%' }}
        />
      </Form.Item>
      
      <Form.Item 
        label="言語設定" 
        name="language"
        initialValue="ja"
      >
        <Select>
          <Option value="ja">日本語</Option>
          <Option value="en">English</Option>
          <Option value="zh">中文</Option>
        </Select>
      </Form.Item>
      
      <Form.Item 
        label="自動保存" 
        name="autoSave"
        valuePropName="checked"
        initialValue={true}
      >
        <Switch />
      </Form.Item>
      
      <Form.Item 
        label="デバッグモード" 
        name="debugMode"
        valuePropName="checked"
        initialValue={false}
      >
        <Switch />
      </Form.Item>
      
      <Divider />
      
      <Title level={4}>デフォルト処理設定</Title>
      
      <Form.Item 
        label="デフォルトチャンクサイズ" 
        name="defaultChunkSize"
        initialValue={500}
      >
        <InputNumber 
          min={100} 
          max={2000} 
          style={{ width: '100%' }}
          addonAfter="文字"
        />
      </Form.Item>
      
      <Form.Item 
        label="デフォルトオーバーラップ" 
        name="defaultOverlap"
        initialValue={50}
      >
        <InputNumber 
          min={0} 
          max={500} 
          style={{ width: '100%' }}
          addonAfter="文字"
        />
      </Form.Item>
      
      <Form.Item 
        label="デフォルト分割方法" 
        name="defaultChunkMethod"
        initialValue="paragraph"
      >
        <Select>
          <Option value="paragraph">段落ごと</Option>
          <Option value="page">ページごと</Option>
          <Option value="heading">見出しごと</Option>
          <Option value="sentence">文章ごと</Option>
        </Select>
      </Form.Item>
    </Form>
  );

  const storageSettings = (
    <Card>
      <Title level={4}>ストレージ設定</Title>
      
      <Form layout="vertical">
        <Form.Item 
          label="ファイル保存場所" 
          name="storagePath"
          initialValue="/uploads"
        >
          <Input />
        </Form.Item>
        
        <Form.Item 
          label="自動クリーンアップ" 
          name="autoCleanup"
          valuePropName="checked"
          initialValue={true}
        >
          <Switch />
        </Form.Item>
        
        <Form.Item 
          label="保存期間 (日)" 
          name="retentionDays"
          initialValue={30}
        >
          <InputNumber 
            min={1} 
            max={365} 
            style={{ width: '100%' }}
          />
        </Form.Item>
        
        <Form.Item 
          label="バックアップ設定" 
          name="backupEnabled"
          valuePropName="checked"
          initialValue={false}
        >
          <Switch />
        </Form.Item>
        
        <Form.Item 
          label="バックアップパス" 
          name="backupPath"
          initialValue="/backup"
        >
          <Input disabled />
        </Form.Item>
      </Form>
      
      <Divider />
      
      <Alert 
        message="ストレージ使用量"
        description={
          <div>
            <Text>現在の使用量: 2.4 GB / 100 GB</Text>
            <br />
            <Text type="secondary">利用可能: 97.6 GB</Text>
          </div>
        }
        type="info"
        style={{ marginBottom: 16 }}
      />
    </Card>
  );

  const apiSettings = (
    <Card>
      <Title level={4}>API設定</Title>
      
      <Form layout="vertical">
        <Form.Item 
          label="API Base URL" 
          name="apiBaseUrl"
          initialValue="http://localhost:8090"
        >
          <Input />
        </Form.Item>
        
        <Form.Item 
          label="タイムアウト (秒)" 
          name="apiTimeout"
          initialValue={30}
        >
          <InputNumber 
            min={5} 
            max={300} 
            style={{ width: '100%' }}
          />
        </Form.Item>
        
        <Form.Item 
          label="認証トークン" 
          name="authToken"
        >
          <Input.Password placeholder="認証トークン (オプション)" />
        </Form.Item>
        
        <Form.Item 
          label="リトライ回数" 
          name="retryCount"
          initialValue={3}
        >
          <InputNumber 
            min={0} 
            max={10} 
            style={{ width: '100%' }}
          />
        </Form.Item>
      </Form>
      
      <Divider />
      
      <Title level={4}>外部サービス連携</Title>
      
      <Form layout="vertical">
        <Form.Item 
          label="Dify API エンドポイント" 
          name="difyEndpoint"
        >
          <Input placeholder="https://api.dify.ai/v1/knowledge" />
        </Form.Item>
        
        <Form.Item 
          label="Dify API キー" 
          name="difyApiKey"
        >
          <Input.Password placeholder="Dify API キー" />
        </Form.Item>
        
        <Form.Item 
          label="Elasticsearch URL" 
          name="elasticsearchUrl"
        >
          <Input placeholder="http://localhost:9200" />
        </Form.Item>
        
        <Form.Item 
          label="Elasticsearch インデックス" 
          name="elasticsearchIndex"
          initialValue="smartrag_docs"
        >
          <Input />
        </Form.Item>
      </Form>
    </Card>
  );

  const notificationSettings = (
    <Card>
      <Title level={4}>通知設定</Title>
      
      <Form layout="vertical">
        <Form.Item 
          label="処理完了通知" 
          name="processCompleteNotification"
          valuePropName="checked"
          initialValue={true}
        >
          <Switch />
        </Form.Item>
        
        <Form.Item 
          label="エラー通知" 
          name="errorNotification"
          valuePropName="checked"
          initialValue={true}
        >
          <Switch />
        </Form.Item>
        
        <Form.Item 
          label="メール通知" 
          name="emailNotification"
          valuePropName="checked"
          initialValue={false}
        >
          <Switch />
        </Form.Item>
        
        <Form.Item 
          label="メールアドレス" 
          name="emailAddress"
        >
          <Input placeholder="notification@example.com" />
        </Form.Item>
        
        <Form.Item 
          label="Webhook URL" 
          name="webhookUrl"
        >
          <Input placeholder="https://hooks.slack.com/services/..." />
        </Form.Item>
      </Form>
    </Card>
  );

  const tabItems = [
    {
      key: 'general',
      label: (
        <span>
          <SettingOutlined />
          一般
        </span>
      ),
      children: generalSettings
    },
    {
      key: 'storage',
      label: (
        <span>
          <DatabaseOutlined />
          ストレージ
        </span>
      ),
      children: storageSettings
    },
    {
      key: 'api',
      label: (
        <span>
          <SecurityScanOutlined />
          API
        </span>
      ),
      children: apiSettings
    },
    {
      key: 'notification',
      label: (
        <span>
          <NotificationOutlined />
          通知
        </span>
      ),
      children: notificationSettings
    }
  ];

  return (
    <div>
      <Title level={2} style={{ marginBottom: 24 }}>
        設定
      </Title>
      
      <Card>
        <Tabs 
          defaultActiveKey="general"
          items={tabItems}
          tabBarExtraContent={
            <Space>
              <Button 
                icon={<ReloadOutlined />}
                onClick={handleReset}
              >
                リセット
              </Button>
              <Button 
                type="primary"
                icon={<SaveOutlined />}
                loading={loading}
                onClick={() => form.submit()}
              >
                保存
              </Button>
            </Space>
          }
        />
      </Card>
    </div>
  );
};

export default Settings;