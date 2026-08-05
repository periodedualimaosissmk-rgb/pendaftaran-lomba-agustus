/* =========================================================
   LOMBA AGUSTUSAN — logika form pendaftaran (dipakai semua
   halaman lomba, konfigurasi per-halaman lewat window.LOMBA)
   Kotak input anggota sudah statis langsung di HTML — script
   ini hanya menangani validasi "berbadan besar" dan submit.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  const cfg = window.LOMBA;
  if (!cfg) return;

  const form = document.getElementById('form-pendaftaran');
  const submitBtn = document.getElementById('submit-btn');
  const formMsg = document.getElementById('form-msg');
  const suksesBox = document.getElementById('sukses');
  const kodeTiketEl = document.getElementById('kode-tiket');

  // ---- submit ----
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    formMsg.classList.remove('show', 'error');

    const namaTim = document.getElementById('nama-tim').value.trim();
    const kelas = document.getElementById('kelas').value.trim();
    const whatsapp = document.getElementById('whatsapp').value.trim();
    const anggota = Array.from(document.querySelectorAll('.anggota-input')).map(i => i.value.trim());

    const payload = {
      lomba: cfg.namaSheet,
      namaTim,
      kelas,
      whatsapp,
      anggota,
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Mengirim...';

    const GAS_URL = window.GAS_URL;
    const belumDikonfigurasi = !GAS_URL || GAS_URL.includes('PASTE_URL');

    try {
      if (!belumDikonfigurasi) {
        await fetch(GAS_URL, {
          method: 'POST',
          mode: 'no-cors', // GAS tidak mengirim header CORS; kita kirim "fire and forget"
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload),
        });
      }

      form.style.display = 'none';
      const kode = `${cfg.kodePrefix || 'LMB'}-${Math.floor(1000 + Math.random() * 9000)}`;
      kodeTiketEl.textContent = kode;
      suksesBox.classList.add('show');

      if (belumDikonfigurasi) {
        console.warn('GAS_URL belum diisi di config.js — data belum benar-benar tersimpan ke Spreadsheet. Lihat PANDUAN-SETUP.md');
      }
    } catch (err) {
      formMsg.textContent = 'Gagal mengirim pendaftaran. Periksa koneksi internet, lalu coba lagi.';
      formMsg.classList.add('show', 'error');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Daftar Sekarang';
    }
  });
});
