import { useState, useEffect } from 'react';
import { Button, List, Card, Typography, message, Layout, Form, Input, Image, Space, Spin, Tag, Empty } from 'antd';
import { UserOutlined, RobotOutlined, SaveOutlined, LockOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { charactersApi } from '../lib/api';
import { useParams } from 'react-router-dom';
import type { Character } from '../lib/api';

const { Sider, Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;

export const CharacterStudio = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [generatingAvatar, setGeneratingAvatar] = useState(false);
  const [tempAvatar, setTempAvatar] = useState<string | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (projectId) {
      fetchCharacters();
    }
  }, [projectId]);

  const fetchCharacters = async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const data = await charactersApi.getAll(projectId);
      setCharacters(data);
      if (data.length > 0 && !selectedCharacter) {
        // Optional: select first
        // setSelectedCharacter(data[0]);
      }
    } catch (error) {
      message.error('Failed to load characters');
    } finally {
      setLoading(false);
    }
  };

  const handleExtract = async () => {
    if (!projectId) return;
    setExtracting(true);
    try {
      const newCharacters = await charactersApi.extract(projectId);
      setCharacters(prev => [...prev, ...newCharacters]); 
      message.success(`Extracted ${newCharacters.length} characters`);
      fetchCharacters(); 
    } catch (error) {
      message.error('Failed to extract characters. Ensure script exists.');
    } finally {
      setExtracting(false);
    }
  };

  const handleSelectCharacter = (char: Character) => {
    setSelectedCharacter(char);
    setTempAvatar(null);
    form.setFieldsValue(char);
  };

  const handleUpdateInfo = async (values: any) => {
    if (!selectedCharacter) return;
    try {
      const updated = await charactersApi.update(selectedCharacter.id, values);
      setCharacters(prev => prev.map(c => c.id === updated.id ? updated : c));
      setSelectedCharacter(updated);
      message.success('Character info updated');
    } catch (error) {
      message.error('Failed to update character');
    }
  };

  const handleGenerateAvatar = async () => {
    if (!selectedCharacter) return;
    setGeneratingAvatar(true);
    try {
      const res = await charactersApi.generateAvatar(selectedCharacter.id);
      setTempAvatar(res.avatarUrl);
      message.success('Avatar generated');
    } catch (error) {
      message.error('Failed to generate avatar');
    } finally {
      setGeneratingAvatar(false);
    }
  };

  const handleLock = async () => {
    if (!selectedCharacter || !tempAvatar) return;
    try {
      const updated = await charactersApi.lock(selectedCharacter.id, tempAvatar, form.getFieldValue('tags'));
      setCharacters(prev => prev.map(c => c.id === updated.id ? updated : c));
      setSelectedCharacter(updated);
      setTempAvatar(null);
      message.success('Character avatar locked');
    } catch (error) {
      message.error('Failed to lock avatar');
    }
  };

  return (
    <Layout style={{ height: '100%', background: '#fff' }}>
      <Sider width={300} theme="light" style={{ borderRight: '1px solid #f0f0f0' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={5} style={{ margin: 0 }}>角色列表</Title>
          <Button icon={<RobotOutlined />} onClick={handleExtract} loading={extracting} size="small">
            AI 提取
          </Button>
        </div>
        <List
          itemLayout="horizontal"
          dataSource={characters}
          loading={loading}
          renderItem={(item) => (
            <List.Item 
              onClick={() => handleSelectCharacter(item)}
              style={{ 
                padding: '12px 16px', 
                cursor: 'pointer',
                background: selectedCharacter?.id === item.id ? '#e6f7ff' : 'transparent'
              }}
            >
              <List.Item.Meta
                avatar={
                    item.avatarUrl ? <Image src={item.avatarUrl} width={40} height={40} preview={false} style={{ borderRadius: '50%', objectFit: 'cover' }} /> :
                    <div style={{ width: 40, height: 40, background: '#eee', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><UserOutlined /></div>
                }
                title={item.name}
                description={<Text type="secondary" ellipsis>{item.tags || item.description}</Text>}
              />
            </List.Item>
          )}
        />
      </Sider>
      <Content style={{ padding: '24px', overflowY: 'auto' }}>
        {selectedCharacter ? (
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between' }}>
              <Title level={4}>{selectedCharacter.name}</Title>
              <Button type="text" danger onClick={async () => {
                  await charactersApi.delete(selectedCharacter.id);
                  setCharacters(prev => prev.filter(c => c.id !== selectedCharacter.id));
                  setSelectedCharacter(null);
                  message.success('Character deleted');
              }}>删除角色</Button>
            </div>
            
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 300 }}>
                <Card title="角色信息" bordered={false} style={{ background: '#fafafa' }}>
                  <Form form={form} layout="vertical" onFinish={handleUpdateInfo}>
                    <Form.Item name="name" label="姓名">
                      <Input />
                    </Form.Item>
                    <Form.Item name="description" label="描述">
                      <TextArea rows={4} />
                    </Form.Item>
                    <Form.Item name="tags" label="特征标签 (Tags)">
                      <Input placeholder="brave, warrior, red hair..." />
                    </Form.Item>
                    <Button icon={<SaveOutlined />} htmlType="submit">保存信息</Button>
                  </Form>
                </Card>
              </div>

              <div style={{ width: 320 }}>
                <Card title="定妆照 (Visual Anchor)" bordered={false} style={{ background: '#fafafa' }}>
                  <div style={{ width: '100%', aspectRatio: '1/1', background: '#eee', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: 8 }}>
                    {tempAvatar || selectedCharacter.avatarUrl ? (
                      <Image 
                        src={tempAvatar || selectedCharacter.avatarUrl} 
                        width="100%" 
                        height="100%" 
                        style={{ objectFit: 'cover' }} 
                      />
                    ) : (
                      <UserOutlined style={{ fontSize: 48, color: '#ccc' }} />
                    )}
                  </div>
                  
                  <Space orientation="vertical" style={{ width: '100%' }}>
                    <Button 
                        type="primary" 
                        icon={<ThunderboltOutlined />} 
                        block 
                        onClick={handleGenerateAvatar} 
                        loading={generatingAvatar}
                    >
                      AI 生成/重绘
                    </Button>
                    
                    {tempAvatar && (
                        <Button 
                            type="dashed" 
                            icon={<LockOutlined />} 
                            block 
                            onClick={handleLock}
                            style={{ borderColor: '#52c41a', color: '#52c41a' }}
                        >
                            锁定为定妆照
                        </Button>
                    )}
                  </Space>
                  <div style={{ marginTop: 12, fontSize: 12, color: '#888' }}>
                    <p>* 锁定后，该图片将作为角色的一致性参考图。</p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        ) : (
          <Empty description="选择或提取角色以开始设定" style={{ marginTop: 100 }} />
        )}
      </Content>
    </Layout>
  );
};
