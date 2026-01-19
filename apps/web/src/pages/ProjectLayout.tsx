import { Layout, Menu, Typography, Button, Spin } from 'antd';
import { Outlet, useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  SettingOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
  VideoCameraOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { projectsApi, type Project } from '../lib/api';

const { Sider, Content, Header } = Layout;
const { Title } = Typography;

export const ProjectLayout = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (projectId) {
      projectsApi.getOne(projectId)
        .then(setProject)
        .catch(() => {
            // handle error
        })
        .finally(() => setLoading(false));
    }
  }, [projectId]);

  if (loading) {
      return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Spin size="large" /></div>;
  }

  if (!project) {
      return <div>Project not found</div>;
  }

  const selectedKey = location.pathname.split('/').pop() || 'episodes';

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} theme="light" style={{ borderRight: '1px solid #f0f0f0' }}>
        <div style={{ padding: '16px', textAlign: 'center', borderBottom: '1px solid #f0f0f0' }}>
            <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate('/projects')}>
                返回列表
            </Button>
        </div>
        <div style={{ padding: '16px' }}>
             <Title level={5} style={{ margin: 0 }} ellipsis>{project.name}</Title>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          style={{ borderRight: 0 }}
          items={[
            {
              key: 'settings',
              icon: <SettingOutlined />,
              label: <Link to={`/projects/${projectId}/settings`}>项目设定</Link>,
            },
            {
              key: 'episodes',
              icon: <UnorderedListOutlined />,
              label: <Link to={`/projects/${projectId}/episodes`}>集数管理</Link>,
            },
            {
              key: 'storyboard',
              icon: <AppstoreOutlined />,
              label: <Link to={`/projects/${projectId}/storyboard`}>分镜管理</Link>,
            },
            {
              key: 'editing',
              icon: <VideoCameraOutlined />,
              label: <Link to={`/projects/${projectId}/editing`}>剪辑制作</Link>,
            },
          ]}
        />
      </Sider>
      <Layout>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
          <Outlet context={{ project }} />
        </Content>
      </Layout>
    </Layout>
  );
};
