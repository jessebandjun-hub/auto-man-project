import { Tabs } from 'antd';
import { ScriptEditor } from '../components/ScriptEditor';
import { CharacterStudio } from '../components/CharacterStudio';

export const AssetStudioPage = () => {
  return (
    <div style={{ height: '100%', padding: '0 24px 24px 24px', display: 'flex', flexDirection: 'column' }}>
      <Tabs
        defaultActiveKey="script"
        style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
        items={[
          {
            key: 'script',
            label: '剧本创作',
            children: <div style={{ height: '100%', overflow: 'hidden' }}><ScriptEditor /></div>,
          },
          {
            key: 'characters',
            label: '角色设定',
            children: <div style={{ height: '100%', overflow: 'hidden' }}><CharacterStudio /></div>,
          },
        ]}
      />
    </div>
  );
};
