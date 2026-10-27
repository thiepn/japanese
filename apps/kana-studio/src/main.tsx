import {currentKanaView} from './services/japaneseBridge';

// Compatibility endpoint only. Kana lessons, flashcards, vocabulary and charts
// now run inside the one Japanese application and its existing Account shell.
// No standalone Google page mounts, even with a previously valid handoff.
const view=currentKanaView();
const requested=view==='home'?'':'&kanaView='+encodeURIComponent(view);
window.location.replace('/japanese/?kana=resume'+requested);
