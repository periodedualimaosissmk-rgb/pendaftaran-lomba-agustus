/* =========================================================
   LOMBA AGUSTUSAN — animasi "sobek tiket"
   Diputar beberapa saat setelah kartu lomba diklik, sebelum
   berpindah ke halaman pendaftaran masing-masing lomba.
   Hanya dipakai di index.html (halaman daftar lomba).
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('sobek-overlay');
  const backdrop = document.getElementById('sobek-backdrop');
  if (!overlay || !backdrop) return;

  let sedangBerjalan = false;
  const WARNA_SOBEKAN = ['#E8A33D', '#FBF3E2', '#8C0F1E', '#2F6B4F'];

  document.querySelectorAll('a.tiket').forEach((kartu) => {
    kartu.addEventListener('click', (e) => {
      const target = kartu.getAttribute('href');
      if (!target || sedangBerjalan) { e.preventDefault(); return; }
      e.preventDefault();
      sedangBerjalan = true;
      mainkanAnimasi(kartu, target);
    });
  });

  function mainkanAnimasi(kartuAsli, target) {
    const rect = kartuAsli.getBoundingClientRect();

    const clone = kartuAsli.cloneNode(true);
    clone.classList.add('sobek-clone');
    clone.removeAttribute('href');
    clone.style.margin = '0';
    clone.style.transform = 'none';
    clone.style.top = rect.top + 'px';
    clone.style.left = rect.left + 'px';
    clone.style.width = rect.width + 'px';
    clone.style.height = rect.height + 'px';
    overlay.appendChild(clone);

    // paksa reflow supaya transisi berikutnya benar-benar berjalan dari posisi awal
    // eslint-disable-next-line no-unused-expressions
    clone.offsetHeight;

    backdrop.classList.add('show');

    // -- tahap 1: tiket "terangkat" & membesar ke tengah layar --
    const targetW = Math.min(560, window.innerWidth * 0.9);
    const targetH = Math.max(rect.height, 170);
    const targetTop = (window.innerHeight - targetH) / 2;
    const targetLeft = (window.innerWidth - targetW) / 2;

    requestAnimationFrame(() => {
      clone.style.top = targetTop + 'px';
      clone.style.left = targetLeft + 'px';
      clone.style.width = targetW + 'px';
      clone.style.height = targetH + 'px';
    });

    // -- tahap 2: sobek jadi dua bagian --
    setTimeout(() => {
      clone.classList.add('robek');
      sebarkanSobekan(targetLeft + targetW / 2, targetTop + targetH / 2);
    }, 520);

    // -- tahap 3: pindah ke halaman pendaftaran --
    setTimeout(() => {
      window.location.href = target;
    }, 520 + 720);
  }

  function sebarkanSobekan(cx, cy) {
    const jumlah = 14;
    for (let i = 0; i < jumlah; i++) {
      const bit = document.createElement('span');
      bit.className = 'sobrek-bit';
      const ukuran = 5 + Math.random() * 9;
      bit.style.width = ukuran + 'px';
      bit.style.height = (ukuran * (0.5 + Math.random() * 0.6)) + 'px';
      bit.style.left = (cx + (Math.random() * 40 - 20)) + 'px';
      bit.style.top = (cy + (Math.random() * 20 - 10)) + 'px';
      bit.style.background = WARNA_SOBEKAN[i % WARNA_SOBEKAN.length];

      const sudut = Math.random() * Math.PI * 2;
      const jarak = 80 + Math.random() * 140;
      const dx = Math.cos(sudut) * jarak;
      const dy = Math.sin(sudut) * jarak + 60; // sedikit condong jatuh ke bawah
      const rot = (Math.random() * 480 - 240) + 'deg';

      bit.style.setProperty('--dx', dx + 'px');
      bit.style.setProperty('--dy', dy + 'px');
      bit.style.setProperty('--rot', rot);

      overlay.appendChild(bit);
      requestAnimationFrame(() => bit.classList.add('fly'));
    }
  }
});
