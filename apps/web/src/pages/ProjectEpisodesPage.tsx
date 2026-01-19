import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, message, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { episodesApi, type Episode } from '../lib/api';

export const ProjectEpisodesPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEpisode, setEditingEpisode] = useState<Episode | null>(null);
  const [form] = Form.useForm();

  const fetchEpisodes = async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const data = await episodesApi.getAll(projectId);
      setEpisodes(data);
    } catch (error) {
      message.error('Failed to load episodes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEpisodes();
  }, [projectId]);

  const handleCreateOrUpdate = async (values: { title: string; sortOrder: number }) => {
    if (!projectId) return;
    try {
      if (editingEpisode) {
        await episodesApi.update(editingEpisode.id, values);
        message.success('Episode updated');
      } else {
        await episodesApi.create({ ...values, projectId });
        message.success('Episode created');
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingEpisode(null);
      fetchEpisodes();
    } catch (error) {
      message.error('Operation failed');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await episodesApi.delete(id);
      message.success('Episode deleted');
      fetchEpisodes();
    } catch (error) {
      message.error('Failed to delete episode');
    }
  };

  const openModal = (episode?: Episode) => {
    if (episode) {
      setEditingEpisode(episode);
      form.setFieldsValue(episode);
    } else {
      setEditingEpisode(null);
      form.resetFields();
      // Auto-increment sort order
      const maxSortOrder = Math.max(...episodes.map(e => e.sortOrder), 0);
      form.setFieldsValue({ sortOrder: maxSortOrder + 1 });
    }
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      width: 80,
      sorter: (a: Episode, b: Episode) => a.sortOrder - b.sortOrder,
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => new Date(text).toLocaleDateString(),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: Episode) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => openModal(record)}>编辑</Button>
          <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>删除</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>集数管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
          新建集数
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={episodes}
        rowKey="id"
        loading={loading}
        pagination={false}
      />

      <Modal
        title={editingEpisode ? '编辑集数' : '新建集数'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateOrUpdate}>
          <Form.Item name="sortOrder" label="序号" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]}>
            <Input placeholder="例如：第一集 初入江湖" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
