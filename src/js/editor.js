const tuiEditor = require('tui-editor');
const ipc = require('electron').ipcRenderer;
const openFileButton = document.getElementById('open-file');

const onLoad = (() => {
  const editor = new tuiEditor({
    el: document.querySelector('#edit-area'),
    initialEditType: 'markdown',
    previewStyle: 'vertical',
    height: '500px',
  });

  openFileButton.addEventListener('click', () => {
    ipc.send('open-file-dialog')
  });
  
  ipc.on('selected-file', (event, path) => {
    editor.setValue(path);
  });
});

window.addEventListener('DOMContentLoaded', onLoad);
