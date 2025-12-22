// GSAP ScrollTrigger 등록 (안전장치)
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    
    // ============================================================
    // [1] 공통: 헤더 애니메이션 & Lottie 프리로더
    // ============================================================
    window.initHeaderAnimation = () => {
        const headerTitle = document.querySelector('.header-text h1');
        const headerDesc = document.querySelector('.header-text p');
        const headerVideo = document.querySelector('.header-image');

        if (headerTitle && headerDesc) {
            gsap.set([headerTitle, headerDesc], { autoAlpha: 0, y: 50 });
            if (headerVideo) gsap.set(headerVideo, { autoAlpha: 0, x: 50 });
        }
    };
    
    window.playHeaderAnimation = () => {
        const headerTitle = document.querySelector('.header-text h1');
        const headerDesc = document.querySelector('.header-text p');
        const headerVideo = document.querySelector('.header-image');
        
        if (headerTitle && headerDesc) {
            const tl = gsap.timeline();
            tl.to([headerTitle, headerDesc], { autoAlpha: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.2 });
            if (headerVideo) {
                tl.to(headerVideo, { autoAlpha: 1, x: 0, duration: 1, ease: "power3.out" }, "<0.2");
            }
        }
    };

    window.initHeaderAnimation();

    const lottieContainer = document.getElementById('lottie-container');
    const preloader = document.getElementById("preloader");

    function finishLoading() {
        if (!preloader || preloader.style.display === 'none') return;
        gsap.to(preloader, {
            opacity: 0, duration: 0.5, ease: "power2.inOut",
            onComplete: () => {
                preloader.style.display = "none";
                if (window.playHeaderAnimation) window.playHeaderAnimation();
            }
        });
    }

    const urlParams = new URLSearchParams(window.location.search);
    const showAnim = urlParams.get('anim');

    if (showAnim === '1' && lottieContainer) {
        try {
            const animation = lottie.loadAnimation({
                container: lottieContainer, renderer: 'svg', loop: false, autoplay: true,
                path: '/static/images/intro_animation.json'
            });
            animation.addEventListener('complete', finishLoading);
            animation.addEventListener('data_failed', finishLoading);
            animation.addEventListener('error', finishLoading);
        } catch (e) { finishLoading(); }
    }

    // ============================================================
    // [2] Main: Apple Banner Animation
    // ============================================================
    const icons = document.querySelectorAll('.cycling-icon');
    const keywordSpan = document.getElementById('banner-keyword');

    if(icons.length > 0 && keywordSpan) {
        let iconTl = gsap.timeline({ repeat: -1 });
        icons.forEach((icon, index) => {
            const newText = icon.getAttribute('data-text');
            iconTl.to(icon, { opacity: 1, scale: 1.2, duration: 0.5, ease: "back.out(1.7)" }, "start" + index)
                  .to(keywordSpan, { opacity: 0, y: 10, duration: 0.2, onComplete: () => { keywordSpan.innerText = newText; } }, "start" + index)
                  .to(keywordSpan, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }, ">")
                  .to(icon, { opacity: 0, scale: 0.8, duration: 0.3, delay: 1.5, ease: "power2.in" }, "end" + index);
        });
    }

    // ============================================================
    // [3] Main: Swipe Guide Animation
    // ============================================================
    const guideEl = document.getElementById('swipe-guide');
    const handIcon = document.getElementById('hand-icon');
    
    if (guideEl && handIcon) {
        gsap.to(handIcon, {
            x: -15, y: 10, rotation: -10, duration: 0.8, yoyo: true, repeat: -1, ease: "power1.inOut"
        });
        
        ScrollTrigger.create({
            trigger: ".tinder-section", start: "top 60%", once: true,
            onEnter: () => { if(guideEl.style.display !== 'none') gsap.to(guideEl, { autoAlpha: 1, duration: 0.5 }); }
        });

        const tinderList = document.getElementById('tinder-list');
        const hideGuide = () => { gsap.to(guideEl, { autoAlpha: 0, duration: 0.3, onComplete: () => { guideEl.style.display = 'none'; } }); };
        
        if (tinderList) {
            tinderList.addEventListener('mousedown', hideGuide, { once: true });
            tinderList.addEventListener('touchstart', hideGuide, { once: true });
        }
    }

    // ============================================================
    // [4] About Page: Animation (★ 복구됨 ★)
    // ============================================================
    if (document.querySelector('.about-title')) {
        gsap.from(".about-title", {
            y: 50, opacity: 0, duration: 1, ease: "power3.out", delay: 0.2
        });
    }

    if (document.querySelector('.team-card')) {
        gsap.from(".team-card", {
            y: 100, opacity: 0, duration: 0.8, stagger: 0.2,
            scrollTrigger: { trigger: ".team-grid", start: "top 80%" }
        });
    }

    // ============================================================
    // [5] Auth Modal Controller
    // ============================================================
    const authController = {
        el: document.getElementById('auth-modal'),
        content: document.getElementById('auth-modal-content'),
        viewPromo: document.getElementById('auth-view-promo'),
        viewSignup: document.getElementById('auth-view-signup'),
        viewLogin: document.getElementById('auth-view-login'),
        btnPromoSignup: document.getElementById('btn-promo-signup'),
        btnPromoLogin: document.getElementById('btn-promo-login'),
        btnSignupSubmit: document.getElementById('btn-signup-submit'),
        btnLoginSubmit: document.getElementById('btn-login-submit'),
        btnBrowse: document.getElementById('btn-modal-browse'),
        btnCloseIcon: document.getElementById('btn-modal-close-icon'),

        init: function() {
            if (!this.el) return;
            this.bindEvents();
        },

        show: function(mode = 'promo') {
            this.el.classList.remove('hidden');
            gsap.to(this.el, { opacity: 1, duration: 0.3 });
            gsap.to(this.content, { scale: 1, duration: 0.3, ease: 'back.out(1.2)' });
            this.switchView(mode);
        },

        switchView: function(mode) {
            if(this.viewPromo) { this.viewPromo.classList.add('hidden'); this.viewPromo.classList.remove('flex'); }
            if(this.viewSignup) { this.viewSignup.classList.add('hidden'); this.viewSignup.classList.remove('flex'); }
            if(this.viewLogin) { this.viewLogin.classList.add('hidden'); this.viewLogin.classList.remove('flex'); }

            if (mode === 'login' && this.viewLogin) {
                this.viewLogin.classList.remove('hidden'); this.viewLogin.classList.add('flex');
            } else if (mode === 'signup' && this.viewSignup) {
                this.viewSignup.classList.remove('hidden'); this.viewSignup.classList.add('flex');
            } else if (this.viewPromo) {
                this.viewPromo.classList.remove('hidden'); this.viewPromo.classList.add('flex');
            }
        },

        bindEvents: function() {
            if(this.btnPromoSignup) this.btnPromoSignup.onclick = () => this.switchView('signup');
            if(this.btnPromoLogin) this.btnPromoLogin.onclick = () => this.switchView('login');
            if(this.btnBrowse) this.btnBrowse.onclick = () => this.hide();
            if(this.btnCloseIcon) this.btnCloseIcon.onclick = () => this.hide();
            
            if(this.btnSignupSubmit) this.btnSignupSubmit.onclick = () => { alert("가입되었습니다!"); this.hide(); };
            if(this.btnLoginSubmit) this.btnLoginSubmit.onclick = () => { alert("로그인되었습니다!"); this.hide(); };
        },

        hide: function() {
            gsap.to(this.el, { opacity: 0, duration: 0.2 });
            gsap.to(this.content, { scale: 0.95, duration: 0.2, onComplete: () => {
                this.el.classList.add('hidden');
            }});
        }
    };
    authController.init();

    const mainSignupBtn = document.getElementById('btn-signup');
    if (mainSignupBtn) {
        mainSignupBtn.addEventListener('click', () => authController.show('promo'));
    }

    window.socialLogin = function(provider) {
        alert(`${provider === 'naver' ? '네이버' : '구글'} 계정으로 로그인합니다.`);
    };

    // ============================================================
    // [6] Share Modal Controller
    // ============================================================
    const shareController = {
        el: document.getElementById('share-modal'),
        input: document.getElementById('share-url-input'),
        btnClose: document.getElementById('btn-share-close'),
        btnCopy: document.getElementById('btn-copy-url'),

        init: function() {
            if (!this.el) return;
            this.bindEvents();
        },

        show: function() {
            this.el.classList.remove('hidden');
            if(this.input) this.input.value = window.location.href;
            gsap.to(this.el, { opacity: 1, duration: 0.3 });
            const content = this.el.querySelector('div'); 
            if(content) gsap.to(content, { scale: 1, duration: 0.3, ease: 'back.out(1.2)' });
        },

        hide: function() {
            const content = this.el.querySelector('div');
            gsap.to(this.el, { opacity: 0, duration: 0.2 });
            if(content) {
                gsap.to(content, { scale: 0.95, duration: 0.2, onComplete: () => {
                    this.el.classList.add('hidden');
                }});
            } else {
                setTimeout(() => this.el.classList.add('hidden'), 200);
            }
        },

        copy: function() {
            if(this.input) {
                this.input.select();
                navigator.clipboard.writeText(this.input.value).then(() => {
                    alert("URL이 복사되었습니다! 🎉");
                    this.hide();
                }).catch(() => {
                    alert("복사 실패.");
                });
            }
        },

        bindEvents: function() {
            if(this.btnClose) this.btnClose.onclick = () => this.hide();
            if(this.btnCopy) this.btnCopy.onclick = () => this.copy();
            this.el.addEventListener('click', (e) => {
                if(e.target === this.el) this.hide();
            });
        }
    };
    shareController.init();

    const btnShare = document.getElementById('btn-share');
    if(btnShare) {
        btnShare.addEventListener('click', () => shareController.show());
    }
});

// ============================================================
// ============================================================
// [7] Data Generation & Rendering Logic (Modified)
// ============================================================

// 1. 카테고리 명칭 정의 (새로운 카테고리 체계 반영)
const categories = [
    "취업/직무",    // job
    "창업/사업",    // startup
    "주거/자립",    // housing
    "금융/생활비",  // finance
    "교육/자격증",  // growth
    "복지/문화"     // welfare
];

// 2. 데이터 생성 함수 (로컬 이미지 자동 매핑 - 카운터 방식 적용)
function generatePolicyData(count) {
    // 2-1. 한글 카테고리 -> 영어 파일명 접두사 매핑
    const categoryMap = {
        "취업/직무": "job",
        "창업/사업": "startup",
        "주거/자립": "housing",
        "금융/생활비": "finance",
        "교육/자격증": "growth",
        "복지/문화": "welfare"
    };

    // 2-2. [핵심] 카테고리별 이미지 번호 카운터
    // 함수 호출 시마다 초기화되면 안 되므로, 이 로직은 함수 밖으로 빼거나
    // 이 함수가 '한 번에 전체 데이터'를 만들 때만 유효합니다.
    // 현재 구조에서는 한 번 호출로 리스트를 만드므로 함수 내부에 있어도 작동은 하지만,
    // *여러 번 호출(tinderData, allSlideData)* 시 이미지가 1번부터 다시 시작됩니다.
    // 더 자연스러운 랜덤성을 위해 카운터 객체는 매 호출마다 초기화되는 현재 상태가 적절해 보입니다.
    const categoryCounters = {}; 

    const data = [];
    for (let i = 1; i <= count; i++) {
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];

        // --- 이미지 경로 생성 로직 ---
        
        // A. 카운터 초기화 (해당 카테고리가 처음이면 0)
        if (categoryCounters[randomCategory] === undefined) {
            categoryCounters[randomCategory] = 0;
        }

        // B. 현재 카운터 숫자를 가져와서 이미지 번호 결정 (1~5 순환)
        // (0 % 5) + 1 = 1, (1 % 5) + 1 = 2 ...
        const imgNum = categoryCounters[randomCategory];
        const imgIndex = (imgNum % 5) + 1;

        // C. 카운터 증가 (다음 같은 카테고리 아이템을 위해)
        categoryCounters[randomCategory]++;

        // D. 파일명 접두사 찾기 (Default: welfare)
        const prefix = categoryMap[randomCategory] || "welfare";

        // E. 최종 경로 완성
        const localImage = `/static/images/card_images/${prefix}_${imgIndex}.webp`;

        // ---------------------------

        data.push({
            id: i,
            category: randomCategory,
            title: `[${randomCategory}] 청년 정책 제목 ${i}`,
            desc: "이 정책은 서울시 청년들을 위한 맞춤형 지원 사업입니다. 혜택을 놓치지 마세요.",
            date: `2025.12.${String(Math.floor(Math.random() * 30) + 1).padStart(2, '0')} 마감`,
            image: localImage // 생성된 로컬 주소 할당
        });
    }
    return data;
}

// 3. 데이터 생성 실행
const tinderData = generatePolicyData(10);
const allSlideData = generatePolicyData(30);
const myLikedData = generatePolicyData(5);

// [수정됨] createCardHTML : 스와이프 피드백 아이콘 디자인 업그레이드
// (참고: 아래 함수는 기존 코드에 있었으나, 이 섹션에 포함되어 있으므로 함께 유지해야 합니다.)
function createCardHTML(item, isTinder = false) {
    const itemData = encodeURIComponent(JSON.stringify(item));
    
    if (isTinder) {
        // [Tinder Card]
        const swipeIcons = `
            <div class="swipe-feedback pass absolute top-10 right-10 z-30 opacity-0 transition-none pointer-events-none transform rotate-[15deg]">
                <div class="border-4 border-gray-500 rounded-xl px-4 py-2 bg-white/90 backdrop-blur-sm shadow-xl">
                    <span class="text-4xl font-extrabold text-gray-500 tracking-widest">NOPE</span>
                </div>
            </div>

            <div class="swipe-feedback like absolute top-10 left-10 z-30 opacity-0 transition-none pointer-events-none transform -rotate-[15deg]">
                <div class="border-4 border-primary-orange rounded-xl px-4 py-2 bg-white/90 backdrop-blur-sm shadow-xl">
                    <span class="text-4xl font-extrabold text-primary-orange tracking-widest">LIKE</span>
                </div>
            </div>
            
            <div class="swipe-overlay-icon pass absolute inset-0 z-20 flex items-center justify-center opacity-0 bg-gray-900/40 pointer-events-none transition-none">
                <div class="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl">
                    <i class="fa-solid fa-xmark text-5xl text-gray-500"></i>
                </div>
            </div>
            <div class="swipe-overlay-icon like absolute inset-0 z-20 flex items-center justify-center opacity-0 bg-primary-orange/40 pointer-events-none transition-none">
                <div class="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl">
                    <i class="fa-solid fa-heart text-5xl text-primary-orange"></i>
                </div>
            </div>
        `;

        return `
            <div class="policy-card tinder-card absolute top-0 left-0 w-full h-full flex flex-col bg-white overflow-hidden shadow-xl rounded-[30px] cursor-grab" data-id="${item.id}">
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
                        <button class="relative z-50 text-sm font-bold text-gray-900 underline decoration-gray-300 underline-offset-4 p-2 hover:text-primary-orange transition-colors" 
                                onclick="openModal('${itemData}'); event.stopPropagation();">
                            자세히 보기
                        </button>
                    </div>
                </div>
            </div>`;
    } else {
        // [Slide Card]
        return `
            <div class="policy-card relative flex flex-col overflow-hidden rounded-[20px] bg-[#F6F6F7] shadow-sm cursor-pointer hover:shadow-xl transition-all group hover:-translate-y-2 hover:bg-white" onclick="openModal('${itemData}')">
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
            </div>`;
    }
}

// ============================================================
// [8] Policy Detail Modal
// ============================================================
const policyModalEl = document.getElementById('policy-modal');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalImg = document.getElementById('modal-img');
const modalCategory = document.getElementById('modal-category');
const modalDate = document.getElementById('modal-date');
const modalCloseBtn = document.getElementById('modal-close-btn');
const modalHeartBtn = document.getElementById('modal-heart-btn');

window.openModal = function (itemDataEncoded) {
    try {
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

        if (policyModalEl) {
            policyModalEl.classList.remove('hidden');
            setTimeout(() => { policyModalEl.classList.add('active'); }, 10);
        }
    } catch(e) { console.error("Data Error:", e); }
};

function closePolicyModal() {
    if (policyModalEl) {
        policyModalEl.classList.remove('active');
        setTimeout(() => { policyModalEl.classList.add('hidden'); }, 300);
    }
}
if (modalCloseBtn) modalCloseBtn.addEventListener('click', closePolicyModal);
if (policyModalEl) policyModalEl.addEventListener('click', (e) => { if (e.target === policyModalEl) closePolicyModal(); });

// ============================================================
// [9] CardSwiper Class
// ============================================================
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
            this.container.insertAdjacentHTML('beforeend', createCardHTML(item, true));
        });
        this.cards = document.querySelectorAll('.tinder-card');
        this.setupEvents();
        
        // 초기 등장 애니메이션
        gsap.from(".tinder-card", { 
            y: 100, opacity: 0, duration: 0.8, stagger: 0.1, ease: "back.out(1.7)" 
        });
    }
    
    setupEvents() { 
        this.cards.forEach((card) => { this.addListeners(card); }); 
    }
    
    addListeners(card) {
        let isDragging = false; 
        let startX = 0; 
        let currentX = 0;
        
        // 피드백 엘리먼트 선택
        const likeBadge = card.querySelector('.swipe-feedback.like');
        const passBadge = card.querySelector('.swipe-feedback.pass');
        const likeOverlay = card.querySelector('.swipe-overlay-icon.like');
        const passOverlay = card.querySelector('.swipe-overlay-icon.pass');

        const startDrag = (e) => {
            isDragging = true;
            startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            card.style.transition = 'none'; // 드래그 중엔 트랜지션 끔
        };
        
        const moveDrag = (e) => {
            if (!isDragging) return;
            const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            currentX = clientX - startX;
            
            // 회전 및 이동
            const rotate = currentX * 0.05;
            card.style.transform = `translateX(${currentX}px) rotate(${rotate}deg)`;
            
            // 투명도 계산 (0 ~ 1 사이)
            const opacity = Math.min(Math.abs(currentX) / 100, 1);
            
            // 방향에 따른 아이콘 표시
            if (currentX > 0) { 
                // 오른쪽 (찜/Like)
                if(likeBadge) likeBadge.style.opacity = opacity;
                if(likeOverlay) likeOverlay.style.opacity = opacity;
                
                if(passBadge) passBadge.style.opacity = 0;
                if(passOverlay) passOverlay.style.opacity = 0;
            } else { 
                // 왼쪽 (패스/Nope)
                if(passBadge) passBadge.style.opacity = opacity;
                if(passOverlay) passOverlay.style.opacity = opacity;
                
                if(likeBadge) likeBadge.style.opacity = 0;
                if(likeOverlay) likeOverlay.style.opacity = 0;
            }
        };
        
        const endDrag = () => {
            if (!isDragging) return;
            isDragging = false;
            card.style.transition = 'transform 0.3s ease'; // 복귀 시 부드럽게
            
            // 아이콘 초기화
            if(likeBadge) likeBadge.style.opacity = 0;
            if(passBadge) passBadge.style.opacity = 0;
            if(likeOverlay) likeOverlay.style.opacity = 0;
            if(passOverlay) passOverlay.style.opacity = 0;

            const threshold = 150; // 스와이프 판정 기준 거리
            
            if (currentX > threshold) { 
                this.swipeCard(card, 'right'); 
            } else if (currentX < -threshold) { 
                this.swipeCard(card, 'left'); 
            } else { 
                card.style.transform = 'translateX(0) rotate(0)'; 
            }
            
            currentX = 0;
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
        
        card.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
        card.style.transform = `translateX(${moveX}px) rotate(${rotate}deg)`;
        card.style.opacity = '0';
        
        setTimeout(() => { card.remove(); }, 500);
    }
}

// ============================================================
// [10] MyPage Render Function (★ 복구됨 ★)
// ============================================================
function renderMyPage() {
    const mypageList = document.getElementById('mypage-list');
    
    // 1. 찜한 목록 렌더링
    if (mypageList) {
        if (myLikedData.length === 0) {
            mypageList.innerHTML = `<div class="empty-state"><i class="fa-regular fa-folder-open"></i><p>아직 찜한 정책이 없어요.</p></div>`;
        } else {
            mypageList.innerHTML = myLikedData.map(item => createCardHTML(item, false)).join('');
            gsap.from("#mypage-list .policy-card", {
                y: 50, opacity: 0, duration: 0.6, stagger: 0.1,
                scrollTrigger: { trigger: "#mypage-list", start: "top 80%" }
            });
        }
    }

    // 2. Chart.js 렌더링
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
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: { color: '#eee' },
                        grid: { color: '#eee' },
                        pointLabels: {
                            font: { size: 12, family: 'Pretendard' },
                            color: '#666'
                        },
                        ticks: { display: false, maxTicksLimit: 5 }
                    }
                },
                plugins: { legend: { display: false } }
            }
        });
    }
}

// ============================================================
// [11] Initialization (실행)
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    // Lenis Smooth Scroll
    const lenis = new Lenis({ smooth: true });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    // 슬라이드 렌더링 (메인 페이지)
    const slideRow1 = document.getElementById('slide-row-1');
    if (slideRow1) {
        const infiniteData = [...allSlideData, ...allSlideData];
        slideRow1.innerHTML = infiniteData.map(item => createCardHTML(item, false)).join('');
        const slideRow2 = document.getElementById('slide-row-2');
        if(slideRow2) slideRow2.innerHTML = infiniteData.map(item => createCardHTML(item, false)).join('');
    }

    // 틴더 카드 렌더링 (메인 페이지)
    const tinderList = document.getElementById('tinder-list');
    if (tinderList) {
        new CardSwiper(tinderList, tinderData);
    }

    // 마이페이지 렌더링 실행
    renderMyPage();
});

document.addEventListener('DOMContentLoaded', function() {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const closeBtn = document.getElementById('close-btn');
    const menuOverlay = document.getElementById('mobile-menu-overlay');
    const menuPanel = document.getElementById('mobile-menu-panel');

    // 메뉴 열기 함수
    function openMenu() {
        menuOverlay.classList.remove('hidden'); // display: none 제거
        // 약간의 지연을 주어 transition 효과가 먹히도록 함 (브라우저 렌더링 타이밍 이슈)
        setTimeout(() => {
            menuOverlay.classList.remove('opacity-0');
            menuPanel.classList.remove('translate-x-full');
        }, 10);
        document.body.classList.add('menu-open'); // 스크롤 잠금
    }

    // 메뉴 닫기 함수
    function closeMenu() {
        menuOverlay.classList.add('opacity-0');
        menuPanel.classList.add('translate-x-full');
        document.body.classList.remove('menu-open'); // 스크롤 잠금 해제

        // 애니메이션(300ms)이 끝난 뒤에 hidden 처리
        setTimeout(() => {
            menuOverlay.classList.add('hidden');
        }, 300);
    }

    // 이벤트 리스너 등록
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', openMenu);
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeMenu);
    }

    // 배경 클릭 시 닫기
    if (menuOverlay) {
        menuOverlay.addEventListener('click', function(e) {
            if (e.target === menuOverlay) {
                closeMenu();
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    
    // --- [기존 모바일 메뉴 로직 (유지)] ---
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const closeBtn = document.getElementById('close-btn');
    const menuOverlay = document.getElementById('mobile-menu-overlay');
    const menuPanel = document.getElementById('mobile-menu-panel');

    function closeMobileMenu() {
        if (!menuOverlay) return;
        menuOverlay.classList.add('opacity-0');
        menuPanel.classList.add('translate-x-full');
        document.body.classList.remove('menu-open');
        setTimeout(() => {
            menuOverlay.classList.add('hidden');
        }, 300);
    }
    // ... (기존 햄버거 버튼 이벤트 리스너들은 그대로 유지) ...


    // --- [NEW: 로그인 모달 로직] ---
    const loginModal = document.getElementById('login-modal');
    const loginBackdrop = document.getElementById('login-modal-backdrop');
    const loginPanel = document.getElementById('login-modal-panel');
    const modalCloseBtn = document.getElementById('btn-modal-close-icon');
    
    // PC & Mobile 로그인 버튼들
    const loginBtnPC = document.getElementById('login-btn-pc');
    const loginBtnMobile = document.getElementById('login-btn-mobile');

    // 모달 열기 함수
    function openLoginModal() {
        // 만약 모바일 메뉴가 열려있다면 닫기
        closeMobileMenu();

        if (loginModal) {
            loginModal.classList.remove('hidden');
            // 애니메이션을 위해 약간의 딜레이
            setTimeout(() => {
                loginBackdrop.classList.remove('opacity-0');
                loginPanel.classList.remove('opacity-0', 'translate-y-4', 'scale-95');
                loginPanel.classList.add('opacity-100', 'translate-y-0', 'scale-100');
            }, 10);
            document.body.style.overflow = 'hidden'; // 배경 스크롤 막기
        }
    }

    // 모달 닫기 함수
    function closeLoginModal() {
        if (loginModal) {
            loginBackdrop.classList.add('opacity-0');
            loginPanel.classList.remove('opacity-100', 'translate-y-0', 'scale-100');
            loginPanel.classList.add('opacity-0', 'translate-y-4', 'scale-95');
            
            // 애니메이션(300ms) 후 hidden 처리
            setTimeout(() => {
                loginModal.classList.add('hidden');
                document.body.style.overflow = ''; // 스크롤 잠금 해제
            }, 300);
        }
    }

    // 이벤트 리스너 연결
    if (loginBtnPC) loginBtnPC.addEventListener('click', openLoginModal);
    if (loginBtnMobile) loginBtnMobile.addEventListener('click', openLoginModal);
    
    // 닫기 버튼 & 배경 클릭 시 닫기
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeLoginModal);
    if (loginBackdrop) loginBackdrop.addEventListener('click', closeLoginModal);
    
    // ESC 키 누르면 닫기
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && loginModal && !loginModal.classList.contains('hidden')) {
            closeLoginModal();
        }
    });
});
