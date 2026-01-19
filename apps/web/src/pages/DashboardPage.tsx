import { useAuth } from '../context/AuthContext';
import { Button, Typography, Card } from 'antd';
import { Button as SharedButton } from '@repo/ui';

const { Title, Paragraph } = Typography;

export const DashboardPage = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Card title="仪表盘" style={{ width: 400 }}>
        <Title level={3}>欢迎，{user?.name || user?.email}！</Title>
        <Paragraph>您已成功登录。</Paragraph>
        <div style={{ display: 'flex', gap: 10 }}>
          <SharedButton />
          <Button onClick={logout} danger>退出登录</Button>
        </div>
      </Card>
    </div>
  );
};
