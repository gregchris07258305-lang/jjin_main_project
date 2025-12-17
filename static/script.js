document.addEventListener("DOMContentLoaded", () => {
    
    // ============================================================
    // [1] 헤더 애니메이션 초기화 & 실행 (Flash 방지 핵심 로직)
    // ============================================================
    
    // 1-1. [초기화] 화면이 보이기 전에 요소들을 미리 안 보이고 내려가 있는 상태로 '강제 고정'합니다.
    window.initHeaderAnimation = () => {
        const headerTitle = document.querySelector('.header-text h1');
        const headerDesc = document.querySelector('.header-text p');
        const headerVideo = document.querySelector('.header-image');

        if (headerTitle && headerDesc) {
            // ★ 중요: 애니메이션 시작 전에 미리 상태를 Set 해둡니다. (커튼 뒤 준비)
            gsap.set([headerTitle, headerDesc], { 
                autoAlpha: 0, // opacity: 0 + visibility: hidden
                y: 50         // 아래로 50px 내려둠
            });
            
            if (headerVideo) {
                gsap.set(headerVideo, { 
                    autoAlpha: 0, 
                    x: 50 
                });
            }
        }
    };

    // 1-2. [실행] 준비된 요소들을 원래 위치로 부드럽게 올립니다.
    window.playHeaderAnimation = () => {
        const headerTitle = document.querySelector('.header-text h1');
        const headerDesc = document.querySelector('.header-text p');
        const headerVideo = document.querySelector('.header-image');
        
        if (headerTitle && headerDesc) {
            const tl = gsap.timeline();
            
            // to()를 사용합니다. (이미 set으로 내려가 있으므로 0으로 올리기만 하면 됨)
            tl.to([headerTitle, headerDesc], { 
                autoAlpha: 1, 
                y: 0, 
                duration: 1, 
                ease: "power3.out", 
                stagger: 0.2 
            });

            if (headerVideo) {
                tl.to(headerVideo, { 
                    autoAlpha: 1, 
                    x: 0, 
                    duration: 1, 
                    ease: "power3.out" 
                }, "<0.2"); // 텍스트보다 살짝 늦게 출발
            }
        }
    };

    // ★ 문서 로드 즉시 초기화 실행 (프리로더 뒤에서 몰래 준비)
    window.initHeaderAnimation();


    // ============================================================
    // [2] Lottie 로드 & 프리로더 제어
    // ============================================================
    const lottieContainer = document.getElementById('lottie-container');
    const preloader = document.getElementById("preloader");

    function finishLoading() {
        if (!preloader || preloader.style.display === 'none') return;
        
        gsap.to(preloader, {
            opacity: 0,
            duration: 0.5,
            ease: "power2.inOut",
            onComplete: () => {
                preloader.style.display = "none";
                // 프리로더가 완전히 사라진 후 애니메이션 시작 (순차 실행)
                if (window.playHeaderAnimation) window.playHeaderAnimation();
            }
        });
    }

    const urlParams = new URLSearchParams(window.location.search);
    const showAnim = urlParams.get('anim');

    if (showAnim === '1' && lottieContainer) {
        const localPath = '/static/images/intro_animation.json';

        try {
            const animation = lottie.loadAnimation({
                container: lottieContainer,
                renderer: 'svg',
                loop: false,
                autoplay: true,
                path: localPath 
            });

            animation.addEventListener('complete', finishLoading);
            
            animation.addEventListener('data_failed', () => {
                console.warn("Lottie Fail. Force Start.");
                finishLoading();
            });
            animation.addEventListener('error', () => {
                console.warn("Lottie Error. Force Start.");
                finishLoading();
            });

        } catch (e) {
            console.error("Lottie Init Error:", e);
            finishLoading();
        }
    }
});

// ==================== [3] 나머지 기존 로직 (변경 없음) ====================
// (이 아래부터는 기존 코드 그대로 두시면 됩니다.)
gsap.registerPlugin(ScrollTrigger);
const categories = ["교육/역량", "취업/창업", "금융/자산", "창업", "복지/건강", "참여/권리"];
function generatePolicyData(count) {
    const data = [];
    for (let i = 1; i <= count; i++) {
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        data.push({
            id: i,
            category: randomCategory,
            title: `[${randomCategory}] 청년 정책 제목 ${i}`,
            desc: "이 정책은 서울시 청년들을 위한 맞춤형 지원 사업입니다. 혜택을 놓치지 마세요.",
            date: `2025.12.${String(Math.floor(Math.random() * 30) + 1).padStart(2, '0')} 마감`,
            image: `https://placehold.co/600x400/transparent/dddddd?text=Img+${i}`
        });
    }
    return data;
}
const tinderData = generatePolicyData(10);
const allSlideData = generatePolicyData(30);
const myLikedData = generatePolicyData(5);

function createCardHTML(item, isTinder = false) {
    if (isTinder) {
        const cardClass = 'policy-card tinder-card absolute top-0 left-0 w-full h-full flex flex-col bg-white overflow-hidden shadow-xl rounded-[30px] cursor-grab';
        const swipeIcons = `
            <div class="swipe-icon left absolute top-1/2 -translate-y-1/2 -left-[100px] w-24 h-24 bg-white rounded-full flex justify-center items-center shadow-lg text-primary-teal z-20 opacity-0 transition-opacity"><i class="fa-solid fa-heart text-4xl"></i></div>
            <div class="swipe-icon right absolute top-1/2 -translate-y-1/2 -right-[100px] w-24 h-24 bg-white rounded-full flex justify-center items-center shadow-lg text-primary-red z-20 opacity-0 transition-opacity"><i class="fa-solid fa-xmark text-4xl"></i></div>
        `;
        const itemData = encodeURIComponent(JSON.stringify(item));
        return `
            <div class="${cardClass}" data-id="${item.id}" onclick="openModal('${itemData}')">
                ${swipeIcons}
                <div class="card-image w-full h-[320px] bg-gray-50 relative shrink-0">
                    <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover pointer-events-none">
                    <div class="absolute bottom-0 w-full h-20 bg-gradient-to-t from-white to-transparent"></div>
                </div>
                <div class="card-content flex flex-col justify-between flex-grow p-8 text-left bg-white relative z-10">
                    <div>
                        <span class="inline-block py-1 px-3 rounded-full bg-orange-50 text-primary-orange text-sm font-bold mb-3 border border-orange-100">${item.category}</span>
                        <h3 class="card-title text-2xl font-extrabold text-gray-900 leading-tight mb-3 line-clamp-2">${item.title}</h3>
                        <p class="card-desc text-base text-gray-500 font-medium line-clamp-3 leading-relaxed">${item.desc}</p>
                    </div>
                    <div class="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                        <span class="card-date text-sm text-gray-400 font-bold"><i class="fa-regular fa-clock mr-1"></i> ${item.date}</span>
                        <button class="text-sm font-bold text-gray-900 underline decoration-gray-300 underline-offset-4">자세히 보기</button>
                    </div>
                </div>
            </div>
        `;
    } else {
        const hoverEffects = "transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl hover:bg-white group";
        const baseClass = 'policy-card relative flex flex-col overflow-hidden rounded-[20px] bg-[#F6F6F7] shadow-sm cursor-pointer';
        const cardClass = `${baseClass} ${hoverEffects}`;
        const itemData = encodeURIComponent(JSON.stringify(item));
        return `
            <div class="${cardClass}" data-id="${item.id}" onclick="openModal('${itemData}')">
                <div class="card-image w-full h-[180px] flex items-end justify-center overflow-hidden bg-white">
                    <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                </div>
                <div class="card-content p-6 flex flex-col gap-2">
                    <div class="flex justify-between items-center">
                        <span class="text-xs font-bold text-primary-orange bg-orange-50 px-2 py-1 rounded-md">${item.category}</span>
                    </div>
                    <h3 class="card-title text-xl font-extrabold text-[#222] line-clamp-2">${item.title}</h3>
                    <p class="card-desc text-sm text-[#666] font-medium line-clamp-2">${item.desc}</p>
                    <span class="card-date text-xs text-[#888] mt-2">${item.date}</span>
                </div>
            </div>
        `;
    }
}
const modal = document.getElementById('policy-modal');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalImg = document.getElementById('modal-img');
const modalCategory = document.getElementById('modal-category');
const modalDate = document.getElementById('modal-date');
const modalCloseBtn = document.getElementById('modal-close-btn');
const modalHeartBtn = document.getElementById('modal-heart-btn');
window.openModal = function (itemDataEncoded) {
    const item = JSON.parse(decodeURIComponent(itemDataEncoded));
    if (modalTitle) modalTitle.innerText = item.title;
    if (modalDesc) modalDesc.innerText = item.desc;
    if (modalImg) modalImg.src = item.image;
    if (modalCategory) modalCategory.innerText = item.category;
    if (modalDate) modalDate.innerText = item.date;
    if (modalHeartBtn) {
        modalHeartBtn.classList.remove('active');
        modalHeartBtn.innerHTML = '<i class="fa-regular fa-heart"></i>';
    }
    if (modal) {
        modal.classList.remove('hidden');
        setTimeout(() => { modal.classList.add('active'); }, 10);
    }
};
function closeModal() {
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => { modal.classList.add('hidden'); }, 300);
    }
}
if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
class CardSwiper {
    constructor(container, data) {
        this.container = container;
        this.data = data;
        this.init();
    }
    init() {
        if (!this.container) return;
        this.container.innerHTML = '<div class="no-more-cards">모든 카드를 확인했습니다! 🎉</div>';
        [...this.data].reverse().forEach(item => {
            const cardHTML = createCardHTML(item, true);
            this.container.insertAdjacentHTML('beforeend', cardHTML);
        });
        this.cards = document.querySelectorAll('.tinder-card');
        this.setupEvents();
        gsap.from(".tinder-card", {
            y: 100, opacity: 0, duration: 0.8, stagger: 0.1, ease: "back.out(1.7)"
        });
    }
    setupEvents() { this.cards.forEach((card) => { this.addListeners(card); }); }
    addListeners(card) {
        let isDragging = false; let startX = 0; let currentX = 0;
        const leftIcon = card.querySelector('.swipe-icon.left');
        const rightIcon = card.querySelector('.swipe-icon.right');
        const startDrag = (e) => {
            isDragging = true;
            startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            card.style.transition = 'none';
        };
        const moveDrag = (e) => {
            if (!isDragging) return;
            const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            currentX = clientX - startX;
            const rotate = currentX * 0.05;
            card.style.transform = `translateX(${currentX}px) rotate(${rotate}deg)`;
            const opacity = Math.min(Math.abs(currentX) / 100, 1);
            if (currentX > 0) { rightIcon.style.opacity = opacity; leftIcon.style.opacity = 0; }
            else { leftIcon.style.opacity = opacity; rightIcon.style.opacity = 0; }
        };
        const endDrag = () => {
            if (!isDragging) return;
            isDragging = false;
            card.style.transition = 'transform 0.3s ease';
            leftIcon.style.opacity = 0; rightIcon.style.opacity = 0;
            const threshold = 100;
            if (currentX > threshold) { this.swipeCard(card, 'right'); }
            else if (currentX < -threshold) { this.swipeCard(card, 'left'); }
            else { card.style.transform = 'translateX(0) rotate(0)'; }
        };
        card.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', moveDrag);
        document.addEventListener('mouseup', endDrag);
        card.addEventListener('touchstart', startDrag);
        document.addEventListener('touchmove', moveDrag, { passive: false });
        document.addEventListener('touchend', endDrag);
    }
    swipeCard(card, direction) {
        const moveX = direction === 'right' ? 1000 : -1000;
        const rotate = direction === 'right' ? 30 : -30;
        card.style.transform = `translateX(${moveX}px) rotate(${rotate}deg)`;
        card.style.opacity = '0';
        setTimeout(() => { card.remove(); }, 300);
    }
}
function renderSlide(data) {
    const slideRow1 = document.getElementById('slide-row-1');
    const slideRow2 = document.getElementById('slide-row-2');
    if (!slideRow1 || !slideRow2) return;
    const row1Data = data.filter((_, i) => i % 2 === 0);
    const row2Data = data.filter((_, i) => i % 2 !== 0);
    const infiniteRow1 = [...row1Data, ...row1Data, ...row1Data];
    const infiniteRow2 = [...row2Data, ...row2Data, ...row2Data];
    slideRow1.innerHTML = infiniteRow1.map(item => createCardHTML(item, false)).join('');
    slideRow2.innerHTML = infiniteRow2.map(item => createCardHTML(item, false)).join('');
    const resultMessage = document.getElementById('result-message');
    if (resultMessage) resultMessage.innerText = `추천 정책 (${data.length}건)`;
}
function renderMyPage() {
    const mypageList = document.getElementById('mypage-list');
    if (!mypageList) return;
    if (myLikedData.length === 0) {
        mypageList.innerHTML = `<div class="empty-state"><i class="fa-regular fa-folder-open"></i><p>아직 찜한 정책이 없어요.</p></div>`;
    } else {
        mypageList.innerHTML = myLikedData.map(item => createCardHTML(item, false)).join('');
        gsap.from(".policy-grid .policy-card", {
            y: 50, opacity: 0, duration: 0.6, stagger: 0.1,
            scrollTrigger: { trigger: ".policy-grid", start: "top 80%" }
        });
    }
    const ctx = document.getElementById('myChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['금융/자산', '주거', '취업/창업', '복지', '교육', '참여'],
                datasets: [{
                    label: '나의 관심도',
                    data: [85, 90, 70, 60, 40, 50],
                    backgroundColor: 'rgba(244, 130, 69, 0.2)',
                    borderColor: '#F48245',
                    pointBackgroundColor: '#F48245',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                scales: { r: { angleLines: { color: '#eee' }, grid: { color: '#eee' }, pointLabels: { font: { size: 12, family: 'Pretendard' }, color: '#666' }, ticks: { display: false, maxTicksLimit: 5 } } },
                plugins: { legend: { display: false } }
            }
        });
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const lenis = new Lenis({
        duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), direction: 'vertical', gestureDirection: 'vertical', smooth: true, mouseMultiplier: 1, smoothTouch: false, touchMultiplier: 2,
    });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    
    // About 페이지 애니메이션
    if (document.querySelector('.about-title')) {
        gsap.from(".about-title", {
            y: 50, opacity: 0, duration: 1, ease: "power3.out"
        });
    }
    if (document.querySelector('.team-card')) {
        gsap.from(".team-card", { y: 100, opacity: 0, duration: 0.8, stagger: 0.2, scrollTrigger: { trigger: ".team-grid", start: "top 80%" } });
    }
    const tinderList = document.getElementById('tinder-list');
    if (tinderList) new CardSwiper(tinderList, tinderData);
    const guideEl = document.getElementById('swipe-guide');
    const handIcon = document.getElementById('hand-icon');
    if (guideEl && handIcon) {
        const tl = gsap.timeline({ paused: true, onComplete: () => { gsap.to(guideEl, { opacity: 0, duration: 0.5 }); } });
        tl.fromTo(guideEl, { opacity: 0, x: -30, rotation: -10 }, { opacity: 1, x: 0, rotation: 0, duration: 0.5, ease: "power2.out" })
            .to(handIcon, { x: 40, rotation: 15, duration: 0.8, ease: "power1.inOut" })
            .to(guideEl, { opacity: 0, x: 20, duration: 0.3 }, "+=0.1");
        ScrollTrigger.create({ trigger: ".tinder-section", start: "top 60%", onEnter: () => { if (guideEl.style.display !== 'none') { tl.play(); } }, once: true });
        const hideGuide = () => { tl.kill(); gsap.to(guideEl, { opacity: 0, duration: 0.3, onComplete: () => { guideEl.style.display = 'none'; } }); };
        if (tinderList) { tinderList.addEventListener('mousedown', hideGuide); tinderList.addEventListener('touchstart', hideGuide); }
    }
    renderSlide(allSlideData);
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');
    if (searchBtn && searchInput) {
        const handleSearch = () => {
            const keyword = searchInput.value.trim().toLowerCase();
            if (keyword === "") { renderSlide(allSlideData); return; }
            const filteredData = allSlideData.filter(item => item.title.toLowerCase().includes(keyword) || item.category.toLowerCase().includes(keyword));
            renderSlide(filteredData);
            const resultMessage = document.getElementById('result-message');
            if (resultMessage) resultMessage.innerText = `'${keyword}' 검색 결과 (${filteredData.length}건)`;
        };
        searchBtn.addEventListener('click', handleSearch);
        searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSearch(); });
    }
    renderMyPage();
    const btnSignup = document.getElementById('btn-signup');
    const signupModal = document.getElementById('signup-modal');
    if (btnSignup && signupModal) {
        btnSignup.addEventListener('click', () => { signupModal.classList.remove('hidden'); setTimeout(() => { signupModal.classList.add('active'); }, 10); });
        window.closeSignupModal = function () { signupModal.classList.remove('active'); setTimeout(() => { signupModal.classList.add('hidden'); }, 300); }
        signupModal.addEventListener('click', (e) => { if (e.target === signupModal) closeSignupModal(); });
    }
    const btnShare = document.getElementById('btn-share');
    const shareModal = document.getElementById('share-modal');
    if (btnShare && shareModal) {
        btnShare.addEventListener('click', () => {
            const shareUrlInput = document.getElementById('share-url-input');
            if (shareUrlInput) shareUrlInput.value = window.location.href;
            shareModal.classList.remove('hidden');
            setTimeout(() => { shareModal.classList.add('active'); }, 10);
        });
        window.closeShareModal = function () {
            shareModal.classList.remove('active');
            setTimeout(() => { shareModal.classList.add('hidden'); }, 300);
        }
        window.copyUrl = function () {
            const shareUrlInput = document.getElementById('share-url-input');
            shareUrlInput.select();
            navigator.clipboard.writeText(shareUrlInput.value).then(() => { alert("URL이 복사되었습니다!"); closeShareModal(); });
        }
        shareModal.addEventListener('click', (e) => { if (e.target === shareModal) closeShareModal(); });
    }
});