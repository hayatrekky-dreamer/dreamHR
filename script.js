document.addEventListener("DOMContentLoaded", function(){

  /* =========================
     🎵 MUSIC SETUP
  ========================== */
  const music = document.getElementById("bgMusic");
  const btn = document.getElementById("musicBtn");
  let isPlaying = false;

  window.toggleMusic = function(){
    if(isPlaying){
      music.pause();
      isPlaying = false;
      btn.innerText = "🔇";
    } else {
      music.play().then(()=>{
        isPlaying = true;
        btn.innerText = "🔊";
      }).catch(()=>{});
    }
  }

  /* =========================
     💌 OPEN INVITATION (FIX SMOOTH)
  ========================== */
  window.openInvitation = function(){
    const cover = document.querySelector(".cover");
    const content = document.getElementById("content");

    cover.classList.add("open");

    setTimeout(() => {
      cover.style.display = "none";
      content.style.display = "block";

      // autoplay setelah klik (anti diblok browser)
      music.play().then(()=>{
        isPlaying = true;
        btn.innerText = "🔊";
      }).catch(()=>{});

      // scroll ke atas biar smooth
      window.scrollTo({top:0, behavior:"smooth"});

    }, 2600);
  }

document.addEventListener("mousemove", (e) => {
  const x = (e.clientX / window.innerWidth) - 0.5;
  const y = (e.clientY / window.innerHeight) - 0.5;

  const envelope = document.querySelector(".luxury-envelope");

  if(envelope){
    envelope.style.transform = `rotateY(${x * 10}deg) rotateX(${y * -10}deg)`;
  }
});

  /* =========================
     👤 NAMA TAMU (TYPEWRITER FIX)
  ========================== */
  const target = document.getElementById("guestName");

  if(target){
    const urlParams = new URLSearchParams(window.location.search);
    let guest = urlParams.get('to');

    if(!guest || guest.trim() === ""){
      guest = "Tamu Undangan";
    }

    let i = 0;
    target.innerHTML = "";

    function typeWriter(){
      if(i < guest.length){
        target.innerHTML += guest.charAt(i);
        i++;
        setTimeout(typeWriter, 50);
      }
    }

    typeWriter();
  }

  /* =========================
     ✨ SPARKLE EFFECT (OPTIMIZED)
  ========================== */
  function createSparkle(){
    const container = document.getElementById("sparkle-container");
    if(!container) return;

    const sparkle = document.createElement("div");
    sparkle.classList.add("sparkle");

    sparkle.style.left = Math.random() * 100 + "%";
    sparkle.style.top = Math.random() * 100 + "%";

    container.appendChild(sparkle);

    setTimeout(() => sparkle.remove(), 2000);
  }

  setInterval(createSparkle, 500);

  /* =========================
     ⏳ COUNTDOWN
  ========================== */
  const countdownEl = document.getElementById("countdown");

function format(n){
  return n < 10 ? "0" + n : n;
}

  
const targetDate = new Date("June 26, 2026 00:00:00").getTime();

setInterval(() => {
  const now = new Date().getTime();
  const gap = targetDate - now;

  const days = Math.floor(gap / (1000 * 60 * 60 * 24));
  const hours = Math.floor((gap / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((gap / (1000 * 60)) % 60);
  const seconds = Math.floor((gap / 1000) % 60);

  document.getElementById("days").innerText = days;
  document.getElementById("hours").innerText = hours;
  document.getElementById("minutes").innerText = minutes;
  document.getElementById("seconds").innerText = seconds;

}, 1000);

  /* =========================
     ✨ SCROLL ANIMATION
  ========================== */
  const faders = document.querySelectorAll('.fade');

  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add("show");
      }
    });
  }, {threshold: 0.2});

  faders.forEach(el => observer.observe(el));

  /* =========================
     🧭 GOOGLE MAP NAVIGATION (FIX)
  ========================== */
  window.openNavigation = function(){
    const destination = "-0.8047586,100.6853504"; // lokasi kamu
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination}`, "_blank");
  }
/* =========================
   💬 RSVP GOOGLE SHEET
========================== */
const sheetURL = "https://script.google.com/macros/s/AKfycbwYK08sIfX2BCCspYDIqA3UJ0hPQ3r8zLr20JispoEVYuSsvXjbtsFqSgR0Qu9dGrnA/exec";

const form = document.getElementById("rsvpForm");

if(form){
  form.addEventListener("submit", function(e){
    e.preventDefault();

    const data = new FormData(form);

    const status = document.getElementById("status");
    status.innerText = "Mengirim...";

   fetch(sheetURL, {
  method: "POST",
  mode: "no-cors",
  body: data
})
    .then(() => {
      status.innerText = "Terkirim ❤️";

      // 🔥 tampilkan langsung ke UI TANPA nunggu sheet
      const nama = form.nama.value;
      const ucapan = form.ucapan.value;

      tambahChatBaru(nama, ucapan);

      form.reset();

      // 🔥 sync ulang dari sheet (biar konsisten)
      setTimeout(() => {
        loadUcapan();
      }, 2000);

    })
    .catch(() => {
      status.innerText = "Gagal 😢";
    });
  });
}

/* =========================
   📖 RENDER UCAPAN
========================== */
function renderUcapan(data) {
  const list = document.getElementById("listUcapan");
  list.innerHTML = "";

  data.forEach((item, index) => {
    const div = document.createElement("div");

    const posisi = item.nama === form.nama.value ? "chat-right" : "chat-left";

    div.className = `chat-bubble ${posisi}`;

    div.innerHTML = `
      <div class="chat-name">${item.nama || "Anonim"}</div>
      <div class="chat-text">${item.ucapan || "-"}</div>
      <div class="chat-time">${new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })}</div>
    `;

    list.appendChild(div);
  });

  // 🔥 update judul
  document.getElementById("judulUcapan").innerText =
    `Ucapan Tamu (${data.length} Ucapan)`;

  // 🔥 scroll ke bawah
  list.scrollTop = list.scrollHeight;
}
/* =========================
   ➕ TAMBAH CHAT LANGSUNG (REALTIME FEEL)
========================== */
function tambahChatBaru(nama, ucapan){
  const list = document.getElementById("listUcapan");

  const div = document.createElement("div");
  div.className = "chat-bubble chat-right";

  div.innerHTML = `
    <div class="chat-name">${nama}</div>
    <div class="chat-text">${ucapan}</div>
    <div class="chat-time">Baru saja</div>
  `;

  list.appendChild(div);

  // scroll ke bawah
  list.scrollTop = list.scrollHeight;
}

/* =========================
   🔄 LOAD UCAPAN
========================== */
function loadUcapan(){
  fetch(sheetURL)
    .then(res => res.json())
    .then(data => {
      if(!data || data.length === 0) return;

      renderUcapan(data);
    })
    .catch((err)=>{
      console.log("Error load ucapan:", err);
    });
}

/* =========================
   🚀 AUTO LOAD SAAT HALAMAN DIBUKA
========================== */
setTimeout(() => {
  loadUcapan();
}, 500);

/* =========================
   🔁 AUTO REFRESH (OPSIONAL BIAR LIVE)
========================== */
setInterval(() => {
  loadUcapan();
}, 5000);

/* =========================
   💸 COPY REKENING
========================== */
window.copyRek = function(){
  const rek = document.getElementById("rek").innerText;
  navigator.clipboard.writeText(rek);
  alert("Nomor rekening berhasil disalin 💸");
}

});

