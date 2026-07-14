
(function () {
  'use strict';
  var PASSWORD = '2008';
  var lock = document.getElementById('lock');
  var form = document.getElementById('lockForm');
  var input = document.getElementById('password');
  var button = document.getElementById('unlockButton');
  var error = document.getElementById('error');
  var protectedNodes = document.querySelectorAll('.protected-content');
  var unlocking = false;

  function revealDocument() {
    if (unlocking) return;
    unlocking = true;
    error.textContent = '';
    button.disabled = true;
    document.body.classList.add('is-unlocking');
    for (var i = 0; i < protectedNodes.length; i++) {
      protectedNodes[i].setAttribute('aria-hidden', 'false');
    }
    window.setTimeout(function () {
      document.body.classList.remove('locked');
      document.body.classList.add('unlocked');
      lock.setAttribute('aria-hidden', 'true');
      window.setTimeout(function () {
        lock.hidden = true;
        document.body.classList.remove('is-unlocking');
        window.scrollTo(0, 0);
      }, 520);
    }, 80);
  }

  function validateAndOpen(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    var value = String(input.value || '').replace(/\s+/g, '');
    if (value === PASSWORD) {
      input.blur();
      revealDocument();
      return false;
    }
    error.textContent = 'Неверный пароль';
    form.classList.remove('shake');
    void form.offsetWidth;
    form.classList.add('shake');
    input.focus();
    try { input.select(); } catch (_) {}
    return false;
  }

  form.addEventListener('submit', validateAndOpen, false);
  button.addEventListener('click', validateAndOpen, false);
  button.addEventListener('touchend', function (event) {
    event.preventDefault();
    validateAndOpen(event);
  }, { passive: false });
  input.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' || event.keyCode === 13) validateAndOpen(event);
  }, false);
  input.addEventListener('input', function () {
    if (error.textContent) error.textContent = '';
  }, false);

  var ticking = false;
  function updateProgress() {
    var doc = document.documentElement;
    var max = Math.max(1, doc.scrollHeight - window.innerHeight);
    var ratio = Math.min(1, Math.max(0, window.scrollY / max));
    document.getElementById('progress').style.transform = 'scaleX(' + ratio + ')';
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(updateProgress);
    }
  }, { passive: true });
  updateProgress();
})();


(function(){
  var chapterStatus=document.getElementById('chapterStatus');
  var tracked=[].slice.call(document.querySelectorAll('[data-chapter-title], h3[data-section-title]'));
  if ('IntersectionObserver' in window) {
    var sectionObserver=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting && chapterStatus){
          chapterStatus.textContent=entry.target.getAttribute('data-chapter-title')||entry.target.getAttribute('data-section-title')||'Раздел';
        }
      });
    },{rootMargin:'-18% 0px -68% 0px',threshold:0});
    tracked.forEach(function(node){sectionObserver.observe(node)});

    var revealNodes=[].slice.call(document.querySelectorAll('.chapter-scene,.pullquote,.archive-transition,.epilogue-inner,.prelude-line,.breath,.archive-overview'));
    revealNodes.forEach(function(n){n.classList.add('reveal-on-scroll')});
    var revealObserver=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target)}})},{rootMargin:'0px 0px -10% 0px',threshold:.08});
    revealNodes.forEach(function(n){revealObserver.observe(n)});
  }
})();
