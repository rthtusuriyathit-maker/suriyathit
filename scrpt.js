const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const questionCard = document.getElementById('question-card');
const successCard = document.getElementById('success-card');

let clickCount = 0; // เก็บจำนวนครั้งที่แฟนพยายามกดปุ่มปฏิเสธ

// =========================================================
// 1. ระบบสุ่มพิกัดให้ปุ่ม "ไม่เป็นนนTT" วิ่งหนี พร้อมย่อปุ่ม และขยายปุ่ม Yes
// =========================================================
function moveNoButton() {
    clickCount++;
    
    // หาขอบเขตหน้าจอเพื่อล็อกไม่ให้วิ่งหลุดกรอบจอมือถือ/คอมพ์
    const xMax = window.innerWidth - noBtn.offsetWidth - 40;
    const yMax = window.innerHeight - noBtn.offsetHeight - 40;

    const randomX = Math.max(20, Math.floor(Math.random() * xMax));
    const randomY = Math.max(20, Math.floor(Math.random() * yMax));

    // เปลี่ยนระบบปุ่มให้ย้ายไปตามตำแหน่งนิ้ว/เมาส์
    noBtn.style.position = 'fixed';
    noBtn.style.left = randomX + 'px';
    noBtn.style.top = randomY + 'px';

    // ยิ่งกด/ชี้ ปุ่ม No จะหดเล็กลงทีละนิด
    const newScale = Math.max(0.3, 1 - (clickCount * 0.12));
    noBtn.style.transform = `scale(${newScale})`;

    // ยิ่งหนี ปุ่ม Yes จะบวมเป่งขยายขึ้นเรื่อยๆ จนเต็มกรอบ บังคับทางอ้อม 😂
    const yesScale = 1 + (clickCount * 0.25);
    yesBtn.style.transform = `scale(${yesScale})`;

    // แกล้งสั่นหน้าการ์ดสร้างลูกเล่นตื่นเต้น
    questionCard.style.transform = `scale(0.98) rotate(${Math.sin(clickCount) * 2}deg)`;
    setTimeout(() => {
        questionCard.style.transform = 'scale(1) rotate(0deg)';
    }, 150);
}

// =========================================================
// 2. ฟังก์ชันหลักเมื่อตอบตกลง "เป็นนน" (สลับหน้า + เอฟเฟกต์ฉลอง)
// =========================================================
function celebrate() {
    // สลับการแสดงผลหน้าการ์ดคำถามเป็นหน้าสำเร็จ
    questionCard.classList.add('hidden');
    successCard.classList.remove('hidden');

    // เรียกฟังก์ชันจุดพลุกระดาษฉลอง (ชมพู-ขาว-แดง) ระยะเวลา 5 วินาที
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 99 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        
        // จุดกระจายเฉียงจากซ้ายขวา
        confetti(Object.assign({}, defaults, { 
            particleCount, 
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            colors: ['#ff4d6d', '#ff758f', '#ffb3c1', '#ffffff']
        }));
        confetti(Object.assign({}, defaults, { 
            particleCount, 
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            colors: ['#ff4d6d', '#ff758f', '#ffb3c1', '#ffffff']
        }));
    }, 250);

    // ปล่อยหัวใจลอยพุ่งจากขอบหน้าจอด้านล่างขึ้นบนฟ้า
    for (let i = 0; i < 30; i++) {
        setTimeout(createHeart, i * 150);
    }
}

// =========================================================
// 3. ฟังก์ชันเสริมสร้างเม็ดหัวใจลอยตัว
// =========================================================
function createHeart() {
    const heart = document.createElement('i');
    heart.className = 'fa-solid fa-heart';
    heart.style.position = 'fixed';
    heart.style.bottom = '-20px';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.fontSize = Math.random() * 20 + 15 + 'px';
    heart.style.color = ['#ff4d6d', '#ff758f', '#ff85a1', '#ffb3c1', '#ffffff'][Math.floor(Math.random() * 5)];
    heart.style.opacity = Math.random();
    heart.style.zIndex = '98';
    heart.style.pointerEvents = 'none';
    heart.style.transition = 'transform 4s linear, opacity 4s linear';
    
    document.body.appendChild(heart);

    setTimeout(() => {
        heart.style.transform = `translateY(-110vh) translateX(${Math.random() * 100 - 50}px) rotate(${Math.random() * 360}deg)`;
        heart.style.opacity = '0';
    }, 50);

    // เคลียร์แท็กทิ้งเมื่อลอยพ้นขอบจอไปแล้วเพื่อไม่ให้เว็บบั๊กและหน่วงคอมพ์
    setTimeout(() => {
        heart.remove();
    }, 4000);
}

// ดักจับเพิ่มเติมสำหรับหน้าจอมือถือ (ป้องกันไม่ให้สัมผัสโดนปุ่ม "ไม่เป็น")
noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault(); // ป้องกันอาการดีเลย์และการซูมหน้าจอบนสมาร์ตโฟน
    moveNoButton();
});