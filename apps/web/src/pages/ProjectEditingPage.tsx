import { useState, useEffect } from 'react';
import { Layout, Card, Button, Typography, Space, message, Timeline as AntTimeline, List, Image, Tag, Spin, Input, Modal, Row, Col } from 'antd';
import { PlayCircleOutlined, ExportOutlined, SoundOutlined, VideoCameraOutlined, PlusOutlined } from '@ant-design/icons';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { storyboardsApi, episodesApi } from '../lib/api';
import type { Storyboard, Episode } from '../lib/api';

const { Sider, Content, Footer } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;

export const ProjectEditingPage = () => {
  const { project } = useOutletContext<{ project: any }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<string | null>(null);
  const [storyboards, setStoryboards] = useState<Storyboard[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Video Generation State
  const [generateModalVisible, setGenerateModalVisible] = useState(false);
  const [currentStoryboard, setCurrentStoryboard] = useState<Storyboard | null>(null);
  const [motionPrompt, setMotionPrompt] = useState('');
  const [generating, setGenerating] = useState(false);

  // Export State
  const [exporting, setExporting] = useState(false);
  const [generatingTTS, setGeneratingTTS] = useState(false);

  // Preview
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
        const epId = searchParams.get('episodeId') || data[0].id;
        setSelectedEpisodeId(epId);
        setSearchParams({ episodeId: epId });
      }
    } catch (error) {
      message.error('Failed to load episodes');
    }
  };

  const loadStoryboards = async (episodeId: string) => {
    setLoading(true);
    try {
      const data = await storyboardsApi.getAll(episodeId);
      setStoryboards(data);
    } catch (error) {
      message.error('Failed to load timeline assets');
    } finally {
      setLoading(false);
    }
  };

  const handleEpisodeChange = (episodeId: string) => {
    setSelectedEpisodeId(episodeId);
    setSearchParams({ episodeId });
  };

  const handleOpenGenerate = (sb: Storyboard) => {
    if (!sb.imageUrl) {
      message.warning('Please generate an image first in Storyboard Lab');
      return;
    }
    setCurrentStoryboard(sb);
    setMotionPrompt(''); // Reset or set default
    setGenerateModalVisible(true);
  };

  const handleGenerateVideo = async () => {
    if (!currentStoryboard) return;
    setGenerating(true);
    try {
      const updated = await storyboardsApi.generateVideo(currentStoryboard.id, motionPrompt);
      setStoryboards(prev => prev.map(sb => sb.id === updated.id ? updated : sb));
      message.success('Video generation started/completed');
      setGenerateModalVisible(false);
    } catch (error) {
      message.error('Failed to generate video');
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateTTS = async () => {
    if (!selectedEpisodeId) return;
    setGeneratingTTS(true);
    try {
      const res = await episodesApi.generateTTS(selectedEpisodeId);
      message.success(`Generated TTS for ${res.count} clips`);
      loadStoryboards(selectedEpisodeId); // Reload to get audio URLs
    } catch (error) {
      message.error('Failed to generate TTS');
    } finally {
      setGeneratingTTS(false);
    }
  };

  const handleExport = async () => {
    if (!selectedEpisodeId) return;
    setExporting(true);
    try {
      const res = await episodesApi.exportVideo(selectedEpisodeId);
      message.success('Export successful!');
      window.open(res.exportUrl, '_blank');
    } catch (error) {
      message.error('Export failed. Ensure you have generated videos.');
    } finally {
      setExporting(false);
    }
  };

  const handlePreview = (url: string) => {
    setPreviewUrl(url);
  };

  return (
    <Layout style={{ height: '100%', background: '#fff' }}>
      <Sider width={300} theme="light" style={{ borderRight: '1px solid #f0f0f0', padding: 16, overflowY: 'auto' }}>
        <Title level={5} style={{ marginTop: 0 }}>素材库 (Assets)</Title>
        <div style={{ marginBottom: 16 }}>
            {episodes.map(ep => (
                <Button 
                    key={ep.id} 
                    type={ep.id === selectedEpisodeId ? 'primary' : 'default'}
                    onClick={() => handleEpisodeChange(ep.id)}
                    size="small"
                    style={{ marginRight: 8, marginBottom: 8 }}
                >
                    {ep.title}
                </Button>
            ))}
        </div>
        
        <List
            dataSource={storyboards}
            loading={loading}
            renderItem={(item) => (
                <List.Item style={{ padding: '8px 0', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div style={{ position: 'relative', width: '100%', cursor: 'pointer' }} onClick={() => handleOpenGenerate(item)}>
                        {item.imageUrl ? (
                            <Image 
                                src={item.imageUrl} 
                                preview={false} 
                                style={{ borderRadius: 4, opacity: item.videoUrl ? 0.5 : 1 }} 
                            />
                        ) : (
                            <div style={{ height: 100, background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4 }}>
                                No Image
                            </div>
                        )}
                        {item.videoUrl && (
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                                <PlayCircleOutlined style={{ fontSize: 24, color: '#fff' }} />
                            </div>
                        )}
                        <div style={{ position: 'absolute', top: 4, left: 4 }}>
                            <Tag color="black">#{item.sortOrder}</Tag>
                        </div>
                    </div>
                    <div style={{ marginTop: 4, width: '100%', display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                        <Text ellipsis style={{ maxWidth: 180 }}>{item.action || 'Untitled'}</Text>
                        {item.videoUrl ? <Tag color="green">Ready</Tag> : <Tag>Image</Tag>}
                    </div>
                </List.Item>
            )}
        />
      </Sider>

      <Layout>
        <Content style={{ padding: 24, display: 'flex', flexDirection: 'column' }}>
            {/* Preview Area */}
            <div style={{ flex: 2, background: '#000', marginBottom: 24, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {previewUrl ? (
                    <video src={previewUrl} controls style={{ maxHeight: '100%', maxWidth: '100%' }} autoPlay />
                ) : (
                    <div style={{ color: '#666' }}>
                        <PlayCircleOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                        <div>Select a clip to preview</div>
                    </div>
                )}
            </div>

            {/* Timeline Area (Simplified) */}
            <div style={{ flex: 1, background: '#f5f5f5', borderRadius: 8, padding: 16, overflowX: 'auto' }}>
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                    <Space>
                        <Button icon={<SoundOutlined />} onClick={handleGenerateTTS} loading={generatingTTS}>批量配音 (TTS)</Button>
                        <Button icon={<ExportOutlined />} type="primary" onClick={handleExport} loading={exporting}>导出视频</Button>
                    </Space>
                    <Text type="secondary">Total Duration: {storyboards.filter(s => s.videoUrl).length * 3}s (Est.)</Text>
                </div>
                
                <div style={{ display: 'flex', gap: 8, paddingBottom: 8 }}>
                    {storyboards.map((sb) => (
                        <Card 
                            key={sb.id}
                            size="small" 
                            style={{ 
                                width: 160, 
                                flexShrink: 0, 
                                border: sb.videoUrl ? '2px solid #52c41a' : '1px solid #d9d9d9',
                                opacity: sb.videoUrl ? 1 : 0.6
                            }}
                            bodyStyle={{ padding: 8 }}
                            onClick={() => sb.videoUrl && handlePreview(sb.videoUrl)}
                        >
                            <div style={{ height: 90, background: '#eee', marginBottom: 8, position: 'relative' }}>
                                {sb.imageUrl && <img src={sb.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                                {sb.videoUrl && <PlayCircleOutlined style={{ position: 'absolute', bottom: 4, right: 4, color: '#fff' }} />}
                            </div>
                            <div style={{ fontSize: 12 }}>
                                <div style={{ marginBottom: 4 }}>
                                    {sb.videoUrl ? <Tag color="green">Video</Tag> : <Button size="small" icon={<VideoCameraOutlined />} block onClick={(e) => { e.stopPropagation(); handleOpenGenerate(sb); }}>生成视频</Button>}
                                </div>
                                {sb.audioUrl && <Tag color="orange" icon={<SoundOutlined />}>Audio</Tag>}
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </Content>
      </Layout>

      <Modal
        title={`图生视频 - 分镜 #${currentStoryboard?.sortOrder}`}
        open={generateModalVisible}
        onCancel={() => setGenerateModalVisible(false)}
        onOk={handleGenerateVideo}
        confirmLoading={generating}
        okText="生成视频 (Doubao-Video)"
      >
        <div style={{ marginBottom: 16 }}>
            {currentStoryboard?.imageUrl && <Image src={currentStoryboard.imageUrl} height={200} />}
        </div>
        <TextArea 
            rows={3} 
            placeholder="输入动态提示词 (Motion Prompt)，例如：镜头缓慢推近，树叶随风飘动..." 
            value={motionPrompt}
            onChange={(e) => setMotionPrompt(e.target.value)}
        />
        <div style={{ marginTop: 8 }}>
            <Text type="secondary">预计时长: 3秒</Text>
        </div>
      </Modal>
    </Layout>
  );
};
