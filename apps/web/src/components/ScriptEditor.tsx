import { useState, useEffect } from 'react';
import { Button, Input, message, Card, Space, Typography, Select } from 'antd';
import { projectsApi } from '../lib/api';
import { useParams } from 'react-router-dom';

const { TextArea } = Input;
const { Option } = Select;

export const ScriptEditor = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [script, setScript] = useState('');
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [idea, setIdea] = useState('');
  const [genre, setGenre] = useState('Fantasy');

  useEffect(() => {
    if (projectId) {
      loadScript();
    }
  }, [projectId]);

  const loadScript = async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const content = await projectsApi.getScript(projectId);
      setScript(content || '');
    } catch (error) {
      message.error('Failed to load script');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!projectId) return;
    try {
      await projectsApi.updateScript(projectId, script);
      message.success('Script saved');
    } catch (error) {
      message.error('Failed to save script');
    }
  };

  const handleGenerate = async () => {
    if (!projectId) return;
    if (!idea) {
      message.warning('Please enter a story idea');
      return;
    }
    setGenerating(true);
    try {
      const result = await projectsApi.generateScript(projectId, idea, genre);
      setScript(result.script);
      message.success('Script generated');
    } catch (error) {
      message.error('Failed to generate script');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 16 }}>
      <Card title="剧本生成器">
        <Space orientation="vertical" style={{ width: '100%' }}>
          <Input 
            placeholder="输入故事核心创意 (例如: 一个失去记忆的剑客...)" 
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
          />
          <Space>
            <Select value={genre} onChange={setGenre} style={{ width: 120 }}>
              <Option value="Fantasy">奇幻</Option>
              <Option value="Sci-Fi">科幻</Option>
              <Option value="Romance">言情</Option>
              <Option value="Mystery">悬疑</Option>
            </Select>
            <Button type="primary" onClick={handleGenerate} loading={generating}>
              AI 生成大纲
            </Button>
          </Space>
        </Space>
      </Card>

      <Card title="剧本编辑" style={{ flex: 1, display: 'flex', flexDirection: 'column' }} styles={{ body: { flex: 1, display: 'flex', flexDirection: 'column' } }}>
        <TextArea 
          value={script} 
          onChange={(e) => setScript(e.target.value)} 
          style={{ flex: 1, resize: 'none', marginBottom: 16 }} 
          placeholder="在此编写或生成的剧本..."
        />
        <div style={{ textAlign: 'right' }}>
          <Button type="primary" onClick={handleSave}>保存剧本</Button>
        </div>
      </Card>
    </div>
  );
};
