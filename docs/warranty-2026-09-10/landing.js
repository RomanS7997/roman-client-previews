'use strict';
const dialog = document.getElementById('documents');
const opener = document.getElementById('documents-open');
opener.addEventListener('click', () => {
  dialog.showModal();
  document.body.style.overflow = 'hidden';
});
document.getElementById('documents-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
dialog.addEventListener('close', () => {
  document.body.style.overflow = '';
  opener.focus();
});
