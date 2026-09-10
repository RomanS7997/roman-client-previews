'use strict';
const returnFocus = new WeakMap();
let previousOverflow = '';
function openDialog(dialog, opener) {
  returnFocus.set(dialog, opener);
  previousOverflow = document.body.style.overflow;
  dialog.showModal();
  document.body.style.overflow = 'hidden';
}
const documents = document.getElementById('documents');
const documentsOpen = document.getElementById('documents-open');
documentsOpen?.addEventListener('click', () => openDialog(documents, documentsOpen));
document.getElementById('documents-close')?.addEventListener('click', () => documents.close());
document.querySelectorAll('[data-close-dialog]').forEach(button => {
  button.addEventListener('click', () => button.closest('dialog').close());
});
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    dialog.querySelector('video')?.pause();
    document.body.style.overflow = previousOverflow;
    returnFocus.get(dialog)?.focus({preventScroll:true});
  });
});
const lessonDialog = document.getElementById('lesson-dialog');
const player = lessonDialog?.querySelector('video');
const videoError = lessonDialog?.querySelector('.video-error');
player?.addEventListener('error', () => { videoError.hidden = false; });
document.querySelectorAll('[data-lesson]').forEach(link => {
  link.addEventListener('click', event => {
    if (!lessonDialog || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    document.getElementById('lesson-title').textContent = link.dataset.lesson;
    document.getElementById('lesson-external').href = link.href;
    videoError.hidden = true;
    player.poster = link.querySelector('.lesson-thumb').src;
    player.src = link.href;
    openDialog(lessonDialog, link);
    player.play().catch(() => {});
  });
});
