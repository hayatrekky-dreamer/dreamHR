document.addEventListener("DOMContentLoaded", function(){

const animSection = document.querySelector(".opening-animation");

/* =========================
   🎵 MUSIC
========================== */
const music = document.getElementById("bgMusic");
const btn = document.getElementById("musicBtn");
let isPlaying = false;

window.toggleMusic = function(){
  if(isPlaying){
    music.pause();
    btn.innerText = "🔇";
  } else {
    music.play().then(()=> btn.innerText = "🔊");
  }
  isPlaying = !isPlaying;
}

/* =========================
   💌 OPEN INVITATION
========================== */
window.openInvitation = function () {
  const cover = document.querySelector(".cover");
  const content = document.getElementById("content");
  const hero = document.querySelector(".hero");

  const music = document.getElementById("music");
  const btn = document.getElementById("musicBtn");
  let isPlaying = false;

  // fade cover
  cover.classList.add("hide");

  // 🎬 delay biar smooth
  setTimeout(() => {

    // ✅ AKTIFKAN BACKGROUND PREMIUM
    document.body.classList.add("opened");

    // tampilkan konten
    cover.style.display = "none";
    content.style.display = "block";

    // reset scroll
    window.scrollTo({ top: 0, behavior: "instant" });

    // 🎬 GSAP TIMELINE
    const tl = gsap.timeline();

    tl.fromTo(".bg-anim",
      { opacity: 0 },
      { opacity: 1, duration: 2 }
    )

    .fromTo(".fog",
      { opacity: 0 },
      { opacity: 0.5, duration: 3 },
      "-=1.5"
    )

    .fromTo(".pohon",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 2 },
      "-=2"
    )

    .fromTo(".rumah-anim",
      { scale: 0.6, opacity: 0, y: 50 },
      { scale: 1, opacity: 1, y: 0, duration: 1.5, ease: "power3.out" },
      "-=1.5"
    );

    // 🌳 animasi loop
    gsap.to(".pohon", {
      rotate: 2,
      duration: 3,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
      delay: 2.5
    });

    // 🌫️ kabut loop
    gsap.to(".fog-1", {
      x: "-50%",
      duration: 60,
      repeat: -1,
      ease: "linear"
    });

    gsap.to(".fog-2", {
      x: "50%",
      duration: 80,
      repeat: -1,
      ease: "linear"
    });

    // 🦋 kupu optional
    if (document.querySelector(".kupu")) {
      gsap.to(".kupu", {
        x: 80,
        y: -40,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      gsap.to(".kupu2", {
        x: -100,
        y: 30,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: "sine.OutIn"
      });
    }

    // 🎵 MUSIC
    if (music) {
      music.play().then(() => {
        isPlaying = true;
        if (btn) btn.innerText = "🔊";
      }).catch(() => {});
    }

    // ⏳ AUTO SCROLL
    setTimeout(() => {
      if (hero) {
        hero.scrollIntoView({ behavior: "smooth" });
      }
    }, 6000);

  }, 800); // sedikit lebih cepat biar responsif
};
/* =========================
   👤 NAMA TAMU
========================== */
const target = document.getElementById("guestName");

if(target){
  const params = new URLSearchParams(window.location.search);
  let guest = params.get("to") || "Tamu Undangan";

  let i = 0;
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
   ✨ SPARKLE
========================== */
function createSparkle(){
  const container = document.getElementById("sparkle-container");
  if(!container) return;

  const el = document.createElement("div");
  el.className = "sparkle";

  el.style.left = Math.random()*100+"%";
  el.style.top = Math.random()*100+"%";

  container.appendChild(el);
  setTimeout(()=> el.remove(), 2000);
}
setInterval(createSparkle, 500);

/* =========================
   ⏳ COUNTDOWN
========================== */
const targetDate = new Date("June 26, 2026 09:00:00").getTime();

function format(n){
  return n < 10 ? "0" + n : n;
}

setInterval(()=>{
  const now = Date.now();
  const gap = targetDate - now;

  const d = Math.floor(gap/(1000*60*60*24));
  const h = Math.floor((gap/(1000*60*60))%24);
  const m = Math.floor((gap/(1000*60))%60);
  const s = Math.floor((gap/1000)%60);

  document.getElementById("days").innerText = format(d);
  document.getElementById("hours").innerText = format(h);
  document.getElementById("minutes").innerText = format(m);
  document.getElementById("seconds").innerText = format(s);
},1000);

/* =========================
   ✨ SCROLL ANIMATION
========================== */
const observer = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add("show");
    }
  });
},{threshold:0.2});

document.querySelectorAll(".fade, .fade-up").forEach(el => observer.observe(el));

/* =========================
   🧭 MAP
========================== */
window.openNavigation = function(){
  const dest = "-0.8047586,100.6853504";
  window.open(`https://www.google.com/maps/dir/?api=1&destination=${dest}`);
}

/* =========================
   💬 RSVP
========================== */
const sheetURL = "https://script.google.com/macros/s/AKfycbxT4iS4Qb6LHWsjJ9GvrweeWwZLk-aGiaypGLEdPC2qDBXo5JYxmViFDugyqeVEVxi9/exec";
const form = document.getElementById("rsvpForm");

if(form){
  form.addEventListener("submit", e=>{
    e.preventDefault();

    const data = new FormData(form);
    const status = document.getElementById("status");
    status.innerText = "Mengirim...";

    fetch(sheetURL,{method:"POST",mode:"no-cors",body:data})
    .then(()=>{
      status.innerText = "Terkirim ❤️";

      tambahChatBaru(form.nama.value, form.ucapan.value);
      form.reset();

      setTimeout(loadUcapan,2000);
    })
    .catch(()=> status.innerText = "Gagal 😢");
  });
}

/* =========================
   ➕ TAMBAH CHAT BARU (REALTIME)
========================== */
function tambahChatBaru(nama, ucapan){
  const list = document.getElementById("listUcapan");

  const now = new Date();

  const jam = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit"
  });

  const tanggal = now.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });

  const div = document.createElement("div");
  div.className = "chat-bubble chat-right";
  div.innerHTML = `
    <div class="chat-name">${nama}</div>
    <div class="chat-text">${ucapan}</div>
    <div class="chat-time">${tanggal} • ${jam}</div>
  `;

  list.appendChild(div);
  list.scrollTop = list.scrollHeight;
}

/* =========================
   📥 RENDER DATA DARI SHEET
========================== */
function renderUcapan(data){
  const list = document.getElementById("listUcapan");
  const judul = document.getElementById("judulUcapan");

  list.innerHTML = "";

  // 🔥 UPDATE JUMLAH UCAPAN
  judul.innerHTML = `Ucapan Tamu<br> (${data.length} Ucapan)`;

  data.slice().reverse().forEach(item=>{
    const div = document.createElement("div");

    let jamTanggal = "--";

    if(item.waktu){
      const waktu = new Date(item.waktu);

      if(!isNaN(waktu)){
        const jam = waktu.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit"
        });

        const tanggal = waktu.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric"
        });

        jamTanggal = `${tanggal} • ${jam}`;
      }
    }

    div.className="chat-bubble chat-left";
    div.innerHTML=`
      <div class="chat-name">${item.nama}</div>
      <div class="chat-text">${item.ucapan}</div>
      <div class="chat-time">${jamTanggal}</div>
    `;

    list.appendChild(div);
  });

  list.scrollTop = 0;
}

/* =========================
   🔄 LOAD DATA
========================== */
function loadUcapan(){
  fetch(sheetURL)
    .then(res=>res.json())
    .then(data=>{
      if(data) renderUcapan(data);
    })
    .catch(()=>{});
}

setTimeout(loadUcapan,500);
setInterval(loadUcapan,80000);

/* =========================
   💍 SLIDER
========================== */
const slider = document.querySelector(".slider-wrapper");
let currentIndex = 0;
let startX = 0;
let isDown = false;

function updateSlide(){
  const slides = document.querySelectorAll(".slide");

  slides.forEach((s,i)=>{
    s.classList.toggle("active", i===currentIndex);
  });

  slider.style.transform = `translateX(-${currentIndex * 100}%)`;
}

if(slider){

  slider.addEventListener("mousedown", e=>{
    isDown = true;
    startX = e.pageX;
  });

  slider.addEventListener("mouseup", e=>{
    if(!isDown) return;
    isDown=false;

    let diff = startX - e.pageX;

    if(diff>50) currentIndex++;
    if(diff<-50) currentIndex--;

    currentIndex = Math.max(0, Math.min(currentIndex, 1));
    updateSlide();
  });

  slider.addEventListener("mousemove", e=>{
    if(!isDown) return;
    let diff = startX - e.pageX;
    slider.style.transform = `translateX(calc(-${currentIndex * 100}% - ${diff}px))`;
  });

  slider.addEventListener("touchstart", e=>{
    startX = e.touches[0].clientX;
  });

  slider.addEventListener("touchend", e=>{
    let diff = startX - e.changedTouches[0].clientX;

    if(diff>50) currentIndex++;
    if(diff<-50) currentIndex--;

    currentIndex = Math.max(0, Math.min(currentIndex, 1));
    updateSlide();
  });

  updateSlide();
}

/* =========================
   🔁 AUTO SLIDE
========================== */
let autoSlide = setInterval(() => {
  currentIndex++;
  if(currentIndex > 1){
    currentIndex = 0;
  }
  updateSlide();
}, 4000);

slider.addEventListener("mouseenter", () => clearInterval(autoSlide));
slider.addEventListener("mousedown", () => clearInterval(autoSlide));
slider.addEventListener("touchstart", () => clearInterval(autoSlide));

slider.addEventListener("mouseleave", startAuto);
slider.addEventListener("mouseup", startAuto);
slider.addEventListener("touchend", startAuto);

function startAuto(){
  clearInterval(autoSlide);
  autoSlide = setInterval(() => {
    currentIndex++;
    if(currentIndex > 1){
      currentIndex = 0;
    }
    updateSlide();
  }, 4000);
}

/* =========================
   💸 COPY REK
========================== */

});


/* =========================
   💸 COPY REK GLOBAL
========================== */
function copyRek(nomor) {

  if (navigator.clipboard) {
    navigator.clipboard.writeText(nomor)
      .then(() => showToast("Nomor rekening berhasil disalin 💛"))
      .catch(() => fallbackCopy(nomor));
  } else {
    fallbackCopy(nomor);
  }
}

function fallbackCopy(text) {
  const input = document.createElement("input");
  input.value = text;
  document.body.appendChild(input);

  input.select();
  input.setSelectionRange(0, 99999);

  document.execCommand("copy");
  document.body.removeChild(input);

  showToast("Nomor rekening berhasil disalin 💛");
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.innerText = message;

  toast.style.position = "fixed";
  toast.style.bottom = "30px";
  toast.style.left = "50%";
  toast.style.transform = "translateX(-50%)";
  toast.style.background = "#D4AF37";
  toast.style.color = "#000";
  toast.style.padding = "10px 20px";
  toast.style.borderRadius = "10px";
  toast.style.fontSize = "13px";
  toast.style.zIndex = "9999";

  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 2000);
}

/* =========================
   ✨ SCROLL REVEAL
========================= */
const elements = document.querySelectorAll(".fade-up");

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    } else {
      entry.target.classList.remove("show"); // 🔥 biar bisa muncul lagi
    }
  });
}, {
  threshold: 0.2
});

elements.forEach(el => observer.observe(el));



