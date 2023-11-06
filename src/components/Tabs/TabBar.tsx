import { h } from 'preact';
import { StateUpdater } from 'preact/hooks';
import { ETabs } from '../../types';
import { IconButton, Toggle } from '@create-figma-plugin/ui';
import { RefreshIcon } from '../../icons';
import { handleInspectPage } from '../../utils/event-handlers';

interface TabBarProps {
  activeTab: ETabs;
  setActiveTab: StateUpdater<ETabs>;
}

export default function TabBar({ activeTab, setActiveTab }: TabBarProps): JSX.Element {
  // todo: implement inspect selection
  // const handleInspectSelectionClick = useCallback(function () {
  //   emit<InspectSelectionHandler>('INSPECT_SELECTION');
  // }, []);

  return (
    <div
      className="fixed left-0 right-0 top-0 z-10 flex items-center justify-between p-3"
      style={{
        borderBottom: '1px solid var(--figma-color-border)',
        backgroundColor: 'var(--figma-color-bg)',
      }}
    >
      <div className="flex items-center gap-4">
        {Object.values(ETabs).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`${activeTab === tab ? 'opacity-100' : 'opacity-60'}`}
          >
            {tab}
          </button>
        ))}
      </div>
      <IconButton onClick={handleInspectPage}>
        <RefreshIcon />
      </IconButton>
    </div>
  );
}
