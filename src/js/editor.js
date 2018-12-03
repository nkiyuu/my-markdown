require('tui-editor/dist/tui-editor-extScrollSync.js');

const tuiEditor = require('tui-editor');
const electron = require('electron');
const mouseTrap = require('mousetrap');
const ipc = electron.ipcRenderer;

const offset = 30;
let editor = null;

const onLoad = (() => {
  const editArea = document.getElementById('edit-area');
  editAreaTop = editArea.getBoundingClientRect().top;
  editor = new tuiEditor({
    el: document.querySelector('#edit-area'),
    initialEditType: 'markdown',
    previewStyle: 'vertical',
    height: window.innerHeight - editAreaTop - offset,
    exts: ['scrollSync'],
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

mouseTrap.bind('command+o', () => {
  ipc.send('open-file-dialog')
});

mouseTrap.bind('command+s', () => {
  ipc.send('save-file-dialog', editor.getValue());
});

window.addEventListener('DOMContentLoaded', onLoad);
