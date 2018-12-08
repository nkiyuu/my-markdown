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

  ipc.on('selected-file', (event, content) => {
    editor.setValue(content);
  });

  const searchTextArea = document.getElementById('search-text-area');
  searchTextArea.addEventListener('keydown', (event) => {
    if (event.code === 'Enter') {
      ipc.send('search-text', searchTextArea.value);
    }
  });
});

mouseTrap.bind('command+o', () => {
  ipc.send('open-file-dialog')
});

mouseTrap.bind('command+s', () => {
  ipc.send('save-file-dialog', editor.getValue());
});

window.addEventListener('DOMContentLoaded', onLoad);