/* =========================================================
   LOMBA AGUSTUSAN — logika form pendaftaran (dipakai semua
   halaman lomba, konfigurasi per-halaman lewat window.LOMBA)
   Kotak input anggota sudah statis langsung di HTML — script
   ini menangani validasi & submit, termasuk field opsional
   "cadangan", "tema", dan "sound" (link atau upload file) kalau
   field tsb ada di halaman (dideteksi otomatis, tidak wajib ada
   di semua lomba).
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  const cfg = window.LOMBA;
  if (!cfg) return;

  const form = document.getElementById('form-pendaftaran');
  const submitBtn = document.getElementById('submit-btn');
  const formMsg = document.getElementById('form-msg');
  const suksesBox = document.getElementById('sukses');
  const kodeTiketEl = document.getElementById('kode-tiket');

  const elCadangan = document.getElementById('cadangan');
  const elTema = document.getElementById('tema');
  const elSoundLink = document.getElementById('sound-link');
  const elSoundFile = document.getElementById('sound-file');

  const MAKS_UKURAN_SOUND = 8 * 1024 * 1024; // 8MB

  // ---- baca file jadi base64 (dipakai utk file sound, tanpa kompresi) ----
  function bacaFileBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Gagal membaca file'));
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  }

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

    if (elCadangan) payload.cadangan = elCadangan.value.trim();
    if (elTema) payload.tema = elTema.value.trim();

    // ---- validasi & siapkan field sound (kalau halaman ini punya) ----
    if (elSoundLink || elSoundFile) {
      const linkIsi = elSoundLink ? elSoundLink.value.trim() : '';
      const fileTerpilih = elSoundFile && elSoundFile.files && elSoundFile.files[0];

      if (!linkIsi && !fileTerpilih) {
        formMsg.textContent = 'Isi salah satu: link sound atau upload file sound.';
        formMsg.classList.add('show', 'error');
        return;
      }
      if (fileTerpilih && fileTerpilih.size > MAKS_UKURAN_SOUND) {
        formMsg.textContent = 'Ukuran file sound terlalu besar (maks 8MB). Pakai link saja, atau kompres filenya.';
        formMsg.classList.add('show', 'error');
        return;
      }

      if (fileTerpilih) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Memproses file...';
        try {
          payload.soundBase64 = await bacaFileBase64(fileTerpilih);
          payload.soundMime = fileTerpilih.type || 'audio/mpeg';
          payload.soundNama = fileTerpilih.name;
        } catch (err) {
          formMsg.textContent = 'Gagal memproses file sound: ' + err.message;
          formMsg.classList.add('show', 'error');
          submitBtn.disabled = false;
          submitBtn.textContent = 'Daftar Sekarang';
          return;
        }
      } else {
        payload.soundLink = linkIsi;
      }
    }

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
