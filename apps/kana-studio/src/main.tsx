import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { hasValidKanaHandoff, watchKanaWorkspace, currentKanaView } from './services/japaneseBridge';
import './index.css';

if (!hasValidKanaHandoff()) {
  const view = currentKanaView();
  window.location.replace('/japanese/?kana=resume' + (view === 'home' ? '' : '&kanaView=' + view));
} else {
  watchKanaWorkspace();
  createRoot(document.getElementById('root')!).render(<App />);
}
