/* God's Plan · Games — utilidades compartidas (sin dependencias). */
(function () {
  var PREFIX = 'gp_games_';
  function read(key) { try { return JSON.parse(localStorage.getItem(PREFIX + key)); } catch (e) { return null; } }
  function write(key, value) { try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); } catch (e) {} }

  window.GP = {
    // Récords: higher=true guarda el mayor; higher=false guarda el menor (tiempos).
    best: function (game, value, higher) {
      var cur = read('best_' + game);
      if (value === undefined) return cur;
      var better = cur === null || (higher === false ? value < cur : value > cur);
      if (better) write('best_' + game, value);
      return better;
    },
    get: read,
    set: write,
    played: function (game) { write('last', { game: game, at: Date.now() }); },

    modal: function (opts) {
      var el = document.getElementById('g-modal');
      if (!el) {
        el = document.createElement('div');
        el.id = 'g-modal'; el.className = 'g-modal'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true');
        el.innerHTML = '<div class="g-modal__box"><h2 class="g-modal__title"></h2><p class="g-modal__text"></p><div class="g-actions"></div></div>';
        document.body.appendChild(el);
      }
      el.querySelector('.g-modal__title').textContent = opts.title;
      el.querySelector('.g-modal__text').textContent = opts.text || '';
      var actions = el.querySelector('.g-actions'); actions.innerHTML = '';
      (opts.buttons || [{ label: 'Jugar otra vez', primary: true, onClick: function () {} }]).forEach(function (b) {
        var btn = document.createElement('button');
        btn.className = 'btn' + (b.primary ? ' btn--primary' : '');
        btn.textContent = b.label;
        btn.onclick = function () { GP.closeModal(); if (b.onClick) b.onClick(); };
        actions.appendChild(btn);
      });
      if (opts.menu !== false) {
        var a = document.createElement('a'); a.className = 'btn'; a.href = 'index.html'; a.textContent = 'Menú de juegos';
        actions.appendChild(a);
      }
      el.classList.add('is-open');
      var first = actions.querySelector('button, a'); if (first) first.focus();
    },
    closeModal: function () { var el = document.getElementById('g-modal'); if (el) el.classList.remove('is-open'); },

    // Deslizar en pantallas táctiles: llama cb('up'|'down'|'left'|'right')
    swipe: function (target, cb) {
      var sx, sy;
      target.addEventListener('touchstart', function (e) { var t = e.touches[0]; sx = t.clientX; sy = t.clientY; }, { passive: true });
      target.addEventListener('touchend', function (e) {
        if (sx === undefined) return;
        var t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy;
        sx = undefined;
        if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
        cb(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'));
      }, { passive: true });
    },

    fmtTime: function (s) { var m = Math.floor(s / 60), r = s % 60; return m + ':' + (r < 10 ? '0' : '') + r; },
    shuffle: function (a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  };
})();
