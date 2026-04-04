document.addEventListener("DOMContentLoaded", function(){

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
window.openInvitation = function(){
  const cover = document.querySelector(".cover");
  const content = document.getElementById("content");

  cover.classList.add("open");

  setTimeout(() => {
    cover.style.display = "none";
    content.style.display = "block";

    music.play().then(()=> {
      isPlaying = true;
      btn.innerText = "🔊";
    }).catch(()=>{});

    window.scrollTo({top:0, behavior:"smooth"});
  }, 2600);
}

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
const targetDate = new Date("June 26, 2026 00:00:00").getTime();

setInterval(()=>{
  const now = Date.now();
  const gap = targetDate - now;

  const d = Math.floor(gap/(1000*60*60*24));
  const h = Math.floor((gap/(1000*60*60))%24);
  const m = Math.floor((gap/(1000*60))%60);
  const s = Math.floor((gap/1000)%60);

  document.getElementById("days").innerText = d;
  document.getElementById("hours").innerText = h;
  document.getElementById("minutes").innerText = m;
  document.getElementById("seconds").innerText = s;
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

document.querySelectorAll(".fade").forEach(el=> observer.observe(el));

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
  list.scrollTop = list.scrollHeight;
}

function renderUcapan(data){
  const list = document.getElementById("listUcapan");
  list.innerHTML = "";

  data.forEach(item=>{
    const div = document.createElement("div");

    let jam="--:--";
    if(item.waktu){
      const t=new Date(item.waktu);
      if(!isNaN(t)){
        jam=t.toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"});
      }
    }

    div.className="chat-bubble chat-left";
    div.innerHTML=`
      <div class="chat-name">${item.nama}</div>
      <div class="chat-text">${item.ucapan}</div>
      <div class="chat-time">${jam}</div>
    `;
    list.appendChild(div);
  });

  list.scrollTop = list.scrollHeight;
}

function loadUcapan(){
  fetch(sheetURL)
    .then(res=>res.json())
    .then(data=>{
      if(data) renderUcapan(data);
    })
    .catch(()=>{});
}

setTimeout(loadUcapan,500);
setInterval(loadUcapan,5000);

/* =========================
   💍 SLIDER (FINAL FIX)
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

  // mouse
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

  // touch
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
   🔁 AUTO SLIDE LOOP
========================== */
let autoSlide = setInterval(() => {
  currentIndex++;

  if(currentIndex > 1){ // jumlah slide - 1
    currentIndex = 0; // 🔥 balik ke awal
  }

  updateSlide();
}, 4000); // ganti speed di sini (ms)

// stop saat disentuh
slider.addEventListener("mouseenter", () => clearInterval(autoSlide));
slider.addEventListener("mousedown", () => clearInterval(autoSlide));
slider.addEventListener("touchstart", () => clearInterval(autoSlide));

// jalan lagi setelah dilepas
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
window.copyRek = function(){
  const rek = document.getElementById("rek").innerText;
  navigator.clipboard.writeText(rek);
  alert("Nomor rekening berhasil disalin 💸");
}

});