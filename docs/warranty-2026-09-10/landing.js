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

document.querySelectorAll('[data-carousel]').forEach(track => {
  const dots = track.closest('section')?.querySelectorAll('[data-carousel-dots] [data-slide]');
  if (!dots?.length) return;

  let frame = 0;
  const setActiveDot = index => {
    dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === index;
      dot.classList.toggle('is-active', isActive);
      if (isActive) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  };

  const updateFromScroll = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const slides = [...track.children];
      const trackLeft = track.getBoundingClientRect().left;
      const index = slides.reduce((closest, slide, slideIndex) => {
        const distance = Math.abs(slide.getBoundingClientRect().left - trackLeft);
        return distance < closest.distance ? {index: slideIndex, distance} : closest;
      }, {index: 0, distance: Number.POSITIVE_INFINITY}).index;
      setActiveDot(index);
    });
  };

  track.addEventListener('scroll', updateFromScroll, {passive: true});
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      track.children[Number(dot.dataset.slide)]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start'
      });
    });
  });
});
