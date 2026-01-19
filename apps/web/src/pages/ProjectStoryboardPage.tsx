import { useState, useEffect } from 'react';
import { Card, Button, Input, Modal, message, Row, Col, Typography, Tag, Space, Image, Tooltip, Spin } from 'antd';
import { AppstoreOutlined, ThunderboltOutlined, EditOutlined, DeleteOutlined, SyncOutlined, MessageOutlined } from '@ant-design/icons';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { storyboardsApi, episodesApi } from '../lib/api';
import type { Storyboard, Episode } from '../lib/api';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

export const ProjectStoryboardPage = () => {
  const { project } = useOutletContext<{ project: any }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<string | null>(null);
  const [storyboards, setStoryboards] = useState<Storyboard[]>([]);
  const [loading, setLoading] = useState(false);
  const [autoSplitting, setAutoSplitting] = useState(false);
  
  // Refine Modal State
  const [refineModalVisible, setRefineModalVisible] = useState(false);
  const [currentStoryboard, setCurrentStoryboard] = useState<Storyboard | null>(null);
  const [refineInstruction, setRefineInstruction] = useState('');
  const [refining, setRefining] = useState(false);

  useEffect(() => {
    if (project?.id) {
      loadEpisodes();
    }
  }, [project?.id]);

  useEffect(() => {
    if (selectedEpisodeId) {
      loadStoryboards(selectedEpisodeId);
    } else {
      setStoryboards([]);
    }
  }, [selectedEpisodeId]);

  const loadEpisodes = async () => {
    try {
      const data = await episodesApi.getAll(project.id);
      setEpisodes(data);
      if (data.length > 0 && !selectedEpisodeId) {
        // Use URL param or default to first
        const epId = searchParams.get('episodeId') || data[0].id;
        setSelectedEpisodeId(epId);
        setSearchParams({ episodeId: epId });
      }
    } catch (error) {
      message.error('加载集数失败');
    }
  };

  const loadStoryboards = async (episodeId: string) => {
    setLoading(true);
    try {
      const data = await storyboardsApi.getAll(episodeId);
      setStoryboards(data);
    } catch (error) {
      message.error('加载分镜失败');
    } finally {
      setLoading(false);
    }
  };

  const handleEpisodeChange = (episodeId: string) => {
    setSelectedEpisodeId(episodeId);
    setSearchParams({ episodeId });
  };

  const handleAutoSplit = async () => {
    if (!selectedEpisodeId) return;
    setAutoSplitting(true);
    try {
      const newStoryboards = await storyboardsApi.autoSplit(selectedEpisodeId);
      setStoryboards(newStoryboards);
      message.success('自动拆解完成');
    } catch (error) {
      message.error('剧本自动拆解失败');
    } finally {
      setAutoSplitting(false);
    }
  };

  const handleGenerateImage = async (sb: Storyboard) => {
    // Optimistic update
    updateStoryboardInList(sb.id, { status: 'GENERATING' });
    try {
      const updated = await storyboardsApi.generateImage(sb.id);
      updateStoryboardInList(sb.id, updated);
      message.success(`分镜 ${sb.sortOrder} 生成完成`);
    } catch (error) {
      updateStoryboardInList(sb.id, { status: 'DRAFT' });
      message.error('生成失败');
    }
  };

  const handleOpenRefine = (sb: Storyboard) => {
    setCurrentStoryboard(sb);
    setRefineInstruction('');
    setRefineModalVisible(true);
  };

  const handleRefineSubmit = async () => {
    if (!currentStoryboard || !refineInstruction) return;
    setRefining(true);
    try {
      const updated = await storyboardsApi.refineImage(currentStoryboard.id, refineInstruction);
      updateStoryboardInList(currentStoryboard.id, updated);
      message.success('图片已精修');
      setRefineModalVisible(false);
    } catch (error) {
      message.error('精修失败');
    } finally {
      setRefining(false);
    }
  };

  const updateStoryboardInList = (id: string, updates: Partial<Storyboard>) => {
    setStoryboards(prev => prev.map(sb => sb.id === id ? { ...sb, ...updates } : sb));
  };

  const handleDelete = async (id: string) => {
    try {
      await storyboardsApi.delete(id);
      setStoryboards(prev => prev.filter(sb => sb.id !== id));
      message.success('分镜已删除');
    } catch (error) {
      message.error('删除失败');
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space>
          <Title level={4} style={{ margin: 0 }}>分镜台</Title>
          <Tag color="blue">{episodes.find(e => e.id === selectedEpisodeId)?.title || '选择集数'}</Tag>
        </Space>
        <Space>
            {episodes.map(ep => (
                <Button 
                    key={ep.id} 
                    type={ep.id === selectedEpisodeId ? 'primary' : 'default'}
                    onClick={() => handleEpisodeChange(ep.id)}
                    size="small"
                >
                    {ep.title}
                </Button>
            ))}
            <Button 
                type="primary" 
                icon={<AppstoreOutlined />} 
                onClick={handleAutoSplit} 
                loading={autoSplitting}
                disabled={!selectedEpisodeId}
            >
                AI 自动拆解与生成
            </Button>
        </Space>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 4 }}>
        {loading ? (
            <div style={{ textAlign: 'center', padding: 40 }}><Spin /></div>
        ) : (
            <Row gutter={[16, 16]}>
            {storyboards.map(sb => (
                <Col xs={24} sm={12} md={8} lg={6} xl={6} key={sb.id}>
                <Card 
                    hoverable
                    size="small"
                    cover={
                        <div style={{ position: 'relative', aspectRatio: '16/9', background: '#f0f0f0', overflow: 'hidden' }}>
                            {sb.imageUrl ? (
                                <Image 
                                    src={sb.imageUrl} 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    preview={{ src: sb.imageUrl }}
                                />
                            ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>
                                    {sb.status === 'GENERATING' ? <Spin /> : '暂无图片'}
                                </div>
                            )}
                            <div style={{ position: 'absolute', top: 5, left: 5 }}>
                                <Tag color="black">#{sb.sortOrder}</Tag>
                                {sb.shotType && <Tag color="blue">{sb.shotType}</Tag>}
                            </div>
                        </div>
                    }
                    actions={[
                        <Tooltip title="生成/重新生成">
                            <ThunderboltOutlined key="gen" onClick={() => handleGenerateImage(sb)} spin={sb.status === 'GENERATING'} />
                        </Tooltip>,
                        <Tooltip title="精修 (对话编辑)">
                            <MessageOutlined key="refine" onClick={() => handleOpenRefine(sb)} />
                        </Tooltip>,
                        <DeleteOutlined key="del" onClick={() => handleDelete(sb.id)} />,
                    ]}
                >
                    <Card.Meta 
                        title={<Text ellipsis style={{ width: '100%' }}>{sb.action || '暂无动作'}</Text>}
                        description={
                            <div style={{ fontSize: 12 }}>
                                <Paragraph ellipsis={{ rows: 2 }} style={{ marginBottom: 4 }}>
                                    {sb.dialogue ? `🗣️ ${sb.dialogue}` : '(暂无对白)'}
                                </Paragraph>
                            </div>
                        }
                    />
                </Card>
                </Col>
            ))}
            </Row>
        )}
      </div>

      <Modal
        title={`精修分镜 #${currentStoryboard?.sortOrder}`}
        open={refineModalVisible}
        onCancel={() => setRefineModalVisible(false)}
        onOk={handleRefineSubmit}
        confirmLoading={refining}
        okText="AI 精修"
      >
        <div style={{ marginBottom: 16 }}>
            {currentStoryboard?.imageUrl && (
                <img src={currentStoryboard.imageUrl} style={{ width: '100%', borderRadius: 8, marginBottom: 10 }} />
            )}
            <Paragraph type="secondary">
                原始提示词: {currentStoryboard?.prompt}
            </Paragraph>
        </div>
        <TextArea 
            rows={3} 
            placeholder="输入修改指令，例如：'让他笑得更开心一点' 或 '背景改成下雨天'" 
            value={refineInstruction}
            onChange={(e) => setRefineInstruction(e.target.value)}
        />
      </Modal>
    </div>
  );
};
