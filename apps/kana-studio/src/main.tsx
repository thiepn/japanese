import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { hasValidKanaHandoff, watchKanaWorkspace } from './services/japaneseBridge';
import './index.css';

if (!hasValidKanaHandoff()) {
  window.location.replace('/japanese/?kana=resume');
} else {
  watchKanaWorkspace();
  createRoot(document.getElementById('root')!).render(<App />);
}
