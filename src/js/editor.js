const tuiEditor = require('tui-editor');
const ipc = require('electron').ipcRenderer;

const openFileButton = document.getElementById('open-file');
const saveFileButton = document.getElementById('save-file');

const offset = 20;

const onLoad = (() => {
  const editor = new tuiEditor({
    el: document.querySelector('#edit-area'),
    initialEditType: 'markdown',
    previewStyle: 'vertical',
    height: 'auto',
  });

  window.addEventListener('resize', () => {
    const editArea = document.getElementById('edit-area');
    editAreaTop = editArea.getBoundingClientRect().top;
    editor.height(window.innerHeight - editAreaTop - offset);
  });

  openFileButton.addEventListener('click', () => {
    ipc.send('open-file-dialog')
  });
  
  ipc.on('selected-file', (event, content) => {
    editor.setValue(content);
  });

  saveFileButton.addEventListener('click', () => {
    ipc.send('save-file-dialog', editor.getValue());
  });
});

window.addEventListener('DOMContentLoaded', onLoad);
