import { useEffect, useState } from 'react';
import { Card, Button, List, Modal, Form, Input, Typography, message } from 'antd';
import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { projectsApi, type Project } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Title } = Typography;
const { TextArea } = Input;

export const ProjectListPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await projectsApi.getAll();
      setProjects(data);
    } catch (error) {
      message.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateOrUpdate = async (values: { name: string; description?: string }) => {
    try {
      if (editingProject) {
        await projectsApi.update(editingProject.id, values);
        message.success('Project updated');
      } else {
        await projectsApi.create(values);
        message.success('Project created');
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingProject(null);
      fetchProjects();
    } catch (error) {
      message.error('Operation failed');
    }
  };

  const openModal = (project?: Project, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (project) {
      setEditingProject(project);
      form.setFieldsValue(project);
    } else {
      setEditingProject(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await projectsApi.delete(id);
      message.success('Project deleted');
      fetchProjects();
    } catch (error) {
      message.error('Failed to delete project');
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>我的项目</Title>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button onClick={logout}>退出登录</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
            新建项目
          </Button>
        </div>
      </div>

      <List
        grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
        dataSource={projects}
        loading={loading}
        renderItem={(item) => (
          <List.Item>
            <Card
              hoverable
              title={item.name}
              extra={
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button type="text" icon={<EditOutlined />} onClick={(e) => openModal(item, e)} />
                  <Button type="text" danger icon={<DeleteOutlined />} onClick={(e) => handleDelete(item.id, e)} />
                </div>
              }
              onClick={() => navigate(`/projects/${item.id}`)}
            >
              <Card.Meta
                description={
                  <>
                    <div style={{ height: 40, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.description || '暂无描述'}
                    </div>
                    <div style={{ marginTop: 10, color: '#888' }}>
                      集数: {item._count?.episodes || 0} | 更新于: {new Date(item.updatedAt).toLocaleDateString()}
                    </div>
                  </>
                }
              />
            </Card>
          </List.Item>
        )}
      />

      <Modal
        title={editingProject ? '编辑项目' : '新建项目'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateOrUpdate}>
          <Form.Item name="name" label="项目名称" rules={[{ required: true, message: '请输入项目名称' }]}>
            <Input placeholder="例如：仙侠传" />
          </Form.Item>
          <Form.Item name="description" label="项目简介">
            <TextArea rows={4} placeholder="简要描述项目背景..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
