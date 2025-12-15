document.addEventListener("DOMContentLoaded", () => {
    // 1. Lottie 애니메이션 설정 (움직이는 로고)
    const animation = lottie.loadAnimation({
        container: document.getElementById('lottie-container'), // 보여질 박스
        renderer: 'svg',
        loop: false, // 한 번만 재생하고 멈춤 (계속 돌게 하려면 true)
        autoplay: true, // 자동 재생
        // [중요] 디자이너님이 만든 json 파일 경로를 넣거나, 테스트용 무료 json 주소를 넣으세요
        path: 'https://assets3.lottiefiles.com/packages/lf20_UJNc2t.json' 
    });

    // 2. 애니메이션이 끝나면 커튼 걷어내기 (GSAP)
    animation.addEventListener('complete', () => {
        gsap.to("#preloader", {
            opacity: 0,       // 투명해지면서
            duration: 0.8,    // 0.8초 동안
            ease: "power2.out",
            onComplete: () => {
                // 애니메이션 끝나면 아예 화면에서 없애버리기 (클릭 방해 안 되게)
                document.getElementById("preloader").style.display = "none";
                
                // [선택] 이때 메인 텍스트가 쓱 올라오게 하면 더 멋짐!
                gsap.from(".header-text", { y: 50, opacity: 0, duration: 1 });
            }
        });
    });
});

// ==================== [1. Config & Data] ====================
// GSAP 플러그인 등록
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

// ==================== [2. UI Rendering Helpers] ====================
function createCardHTML(item, isTinder = false) {
    const isMobile = window.innerWidth <= 768; // 모바일 체크

    // [Tinder 카드일 때]
    if (isTinder) {
        // 1. 카드 전체 스타일 (기존과 동일하지만 크기 대응)
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
                        <span class="inline-block py-1 px-3 rounded-full bg-orange-50 text-primary-orange text-sm font-bold mb-3 border border-orange-100">
                            ${item.category}
                        </span>
                        <h3 class="card-title text-2xl font-extrabold text-gray-900 leading-tight mb-3 line-clamp-2">
                            ${item.title}
                        </h3>
                        <p class="card-desc text-base text-gray-500 font-medium line-clamp-3 leading-relaxed">
                            ${item.desc}
                        </p>
                    </div>
                    <div class="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                        <span class="card-date text-sm text-gray-400 font-bold"><i class="fa-regular fa-clock mr-1"></i> ${item.date}</span>
                        <button class="text-sm font-bold text-gray-900 underline decoration-gray-300 underline-offset-4">자세히 보기</button>
                    </div>
                </div>
            </div>
        `;
    }

    // [일반 카드일 때 (My Page, Slide 등)] - 기존 유지
    else {
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

// ==================== [3. Modal Logic] ====================
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

// ==================== [4. Page Specific Logic] ====================
// --- Main Page Logic ---
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

        // GSAP Animation for Tinder Cards (등장 효과)
        gsap.from(".tinder-card", {
            y: 100,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "back.out(1.7)"
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

// --- My Page Logic ---
function renderMyPage() {
    const mypageList = document.getElementById('mypage-list');
    if (!mypageList) return;

    if (myLikedData.length === 0) {
        mypageList.innerHTML = `<div class="empty-state"><i class="fa-regular fa-folder-open"></i><p>아직 찜한 정책이 없어요.</p></div>`;
    } else {
        mypageList.innerHTML = myLikedData.map(item => createCardHTML(item, false)).join('');

        // GSAP for My Page Grid (순차 등장)
        gsap.from(".policy-grid .policy-card", {
            y: 50,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            scrollTrigger: {
                trigger: ".policy-grid",
                start: "top 80%"
            }
        });
    }

    // Chart.js Implementation
    const ctx = document.getElementById('myChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['금융/자산', '주거', '취업/창업', '복지', '교육', '참여'],
                datasets: [{
                    label: '나의 관심도',
                    data: [85, 90, 70, 60, 40, 50],
                    backgroundColor: 'rgba(244, 130, 69, 0.2)', // brand orange transparent
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
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }
}

// ==================== [5. Initialization & New Tech] ====================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Lenis Smooth Scroll Init
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 2. GSAP Global Animations
    // Header Text Animation (Main, MyPage, About 공통 적용)
    gsap.from(".header-text h1", { y: 50, opacity: 0, duration: 1, ease: "power3.out" });
    gsap.from(".header-text p", { y: 30, opacity: 0, duration: 1, delay: 0.3, ease: "power3.out" });
    gsap.from(".header-image", { x: 50, opacity: 0, duration: 1, delay: 0.5, ease: "power3.out" });

    // [추가할 코드] About 페이지 타이틀 애니메이션
    if (document.querySelector('.about-title')) {
        gsap.from(".about-title", {
            y: 50,           // 아래로 50px 내려가 있다가 올라옴
            opacity: 0,      // 투명 상태에서 시작
            duration: 1,     // 1초 동안 재생
            ease: "power3.out" // 부드러운 감속 효과
        });
    }

    // About Page Team Animation
    if (document.querySelector('.team-card')) {
        gsap.from(".team-card", {
            y: 100,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            scrollTrigger: {
                trigger: ".team-grid",
                start: "top 80%"
            }
        });
    }

    // 3. Existing Logic Init
    const tinderList = document.getElementById('tinder-list');
    if (tinderList) new CardSwiper(tinderList, tinderData);
    const guideEl = document.getElementById('swipe-guide');
    const handIcon = document.getElementById('hand-icon');

    if (guideEl && handIcon) {
        // 1. 애니메이션 정의 (왼쪽 -> 오른쪽 스와이프 모션)
        const tl = gsap.timeline({
            paused: true, // 스크롤 도달 전까지 멈춤
            onComplete: () => {
                // 3회 반복 후 자연스럽게 사라짐
                gsap.to(guideEl, { opacity: 0, duration: 0.5 });
            }
        });

        tl.fromTo(guideEl,
            { opacity: 0, x: -30, rotation: -10 }, // 시작: 약간 왼쪽, 투명, 살짝 회전
            { opacity: 1, x: 0, rotation: 0, duration: 0.5, ease: "power2.out" } // 등장
        )
            .to(handIcon, {
                x: 40,      // 오른쪽으로 밈
                rotation: 15, // 손목 회전 효과
                duration: 0.8,
                ease: "power1.inOut"
            })
            .to(guideEl, {
                opacity: 0, // 끝날 때 투명해짐
                x: 20,
                duration: 0.3
            }, "+=0.1"); // 약간 대기 후 사라짐

        // 2. 스크롤 트리거: 틴더 섹션이 화면에 보이면 재생
        ScrollTrigger.create({
            trigger: ".tinder-section",
            start: "top 60%", // 섹션이 화면 중간쯤 왔을 때
            onEnter: () => {
                // 사용자가 아직 액션을 안 했다면 재생
                if (guideEl.style.display !== 'none') {
                    tl.play();
                }
            },
            once: true // 한 번만 실행 (스크롤 왔다갔다 해도 다시 안 뜸)
        });

        // 3. 사용자 액션 감지: 클릭/터치 시 즉시 숨김
        const hideGuide = () => {
            tl.kill(); // 애니메이션 중단
            gsap.to(guideEl, {
                opacity: 0, duration: 0.3, onComplete: () => {
                    guideEl.style.display = 'none'; // 완전히 제거
                }
            });
        };

        // 카드를 누르거나 스와이프 시도하면 가이드 삭제
        if (tinderList) {
            tinderList.addEventListener('mousedown', hideGuide);
            tinderList.addEventListener('touchstart', hideGuide);
        }
    }

    renderSlide(allSlideData);

    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');
    if (searchBtn && searchInput) {
        const handleSearch = () => {
            const keyword = searchInput.value.trim().toLowerCase();
            if (keyword === "") { renderSlide(allSlideData); return; }
            const filteredData = allSlideData.filter(item =>
                item.title.toLowerCase().includes(keyword) ||
                item.category.toLowerCase().includes(keyword)
            );
            renderSlide(filteredData);
            const resultMessage = document.getElementById('result-message');
            if (resultMessage) resultMessage.innerText = `'${keyword}' 검색 결과 (${filteredData.length}건)`;
        };
        searchBtn.addEventListener('click', handleSearch);
        searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSearch(); });
    }



    renderMyPage();

    // Modals (Signup/Share)
    const btnSignup = document.getElementById('btn-signup');
    const signupModal = document.getElementById('signup-modal');
    if (btnSignup && signupModal) {
        btnSignup.addEventListener('click', () => {
            signupModal.classList.remove('hidden');
            setTimeout(() => { signupModal.classList.add('active'); }, 10);
        });
        window.closeSignupModal = function () {
            signupModal.classList.remove('active');
            setTimeout(() => { signupModal.classList.add('hidden'); }, 300);
        }
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
            navigator.clipboard.writeText(shareUrlInput.value).then(() => {
                alert("URL이 복사되었습니다!");
                closeShareModal();
            });
        }
        shareModal.addEventListener('click', (e) => { if (e.target === shareModal) closeShareModal(); });
    }
});
// ==================== [6. New Logic: Region Filter & Transition] ====================
// landing.html에서 넘어온 ?region=seoul 파라미터를 처리합니다.
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. URL에서 region 파라미터 추출
    const urlParams = new URLSearchParams(window.location.search);
    const regionId = urlParams.get('region'); // 예: 'seoul'

    // 2. 화면 진입 애니메이션 (Landing 페이지의 줌인 효과와 이어지도록)
    // body 전체가 하얀색(투명도 0)에서 서서히 나타나게 함
    gsap.fromTo("body", 
        { opacity: 0 }, 
        { opacity: 1, duration: 1.2, ease: "power2.out" }
    );

    // 3. 지역 ID 한글 매핑 데이터
    const REGION_NAMES = {
        'seoul': '서울특별시', 'gangwon': '강원도', 
        'chungbug': '충청북도', 'chungnam': '충청남도',
        'jeonbug': '전라북도', 'jeonnam': '전라남도',
        'gyeongbug': '경상북도', 'gyeongnam': '경상남도',
        'jeju': '제주특별자치도'
    };

    // 4. 지역 정보가 있을 경우 UI 업데이트 실행
    if (regionId && REGION_NAMES[regionId]) {
        const regionName = REGION_NAMES[regionId];
        console.log(`Connected Region: ${regionName}`);

        // [Header Text 수정]
        const headerTitle = document.querySelector('.header-text h1');
        const headerDesc = document.querySelector('.header-text p');
        
        if(headerTitle) {
            // 기존 텍스트가 살짝 사라졌다가, 새로운 지역명으로 바뀌며 등장
            gsap.to(headerTitle, {
                opacity: 0,
                y: -10,
                duration: 0.3,
                onComplete: () => {
                    headerTitle.innerHTML = `<span class="text-primary-teal">${regionName}</span>의<br>청년 정책 소식 📰`;
                    gsap.to(headerTitle, { opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.7)" });
                }
            });
        }
        
        if(headerDesc) {
            gsap.to(headerDesc, {
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    headerDesc.innerHTML = `${regionName}에 거주하는 청년들을 위한 맞춤 정책입니다.<br>놓치지 말고 확인해보세요!`;
                    gsap.to(headerDesc, { opacity: 1, duration: 0.5, delay: 0.1 });
                }
            });
        }

        // [Search Input 자동 입력]
        // 사용자가 검색창을 봤을 때 해당 지역이 이미 태그되어 있는 느낌 제공
        const searchInput = document.getElementById('search-input');
        if(searchInput) {
            searchInput.value = `#${regionName} #취업지원`;
        }
    }
});

// =========================================================================
        // [수정된 버전] 맵 이벤트 초기화 함수 (디버깅 강화 및 path 지원)
        // =========================================================================
        function initMapEvents() {
            const svgElement = document.querySelector('#svg-container svg');
            if (!svgElement) {
                console.error("❌ SVG 요소를 찾을 수 없습니다.");
                return;
            }

            const tooltip = document.querySelector('#info-tooltip');
            const tooltipLine = tooltip.querySelector('.tooltip-line');
            const tooltipContent = tooltip.querySelector('.tooltip-content');
            const tTitle = tooltip.querySelector('.tooltip-title');
            const tCountSpan = tooltip.querySelector('.tooltip-count span');
            const overlay = document.getElementById('transition-overlay');

            // [핵심 수정 1] g 태그뿐만 아니라 path 태그도 검사 대상에 포함
            // 어떤 툴은 그룹에 ID를 주고, 어떤 툴은 패스에 ID를 줍니다. 둘 다 찾습니다.
            const allElements = svgElement.querySelectorAll('g, path');
            
            // 현재 활성화해야 할 ID 목록 (데이터베이스 키값들)
            const activeIds = Object.keys(currentConfig.db);
            
            console.log(`[InitMap] 현재 모드: ${currentRegionKey}`);
            console.log(`[InitMap] 활성 타겟 ID 목록:`, activeIds);

            let matchCount = 0;

            allElements.forEach(element => {
                const rawId = element.id || '';
                if (!rawId) return; // ID가 없는 요소는 무시

                const regionId = rawId.trim(); // 공백 제거

                // 1. 랜드마크 처리
                if (regionId.toLowerCase().includes('lm')) {
                    element.classList.add('landmark-piece');
                    // 랜드마크는 별도 이벤트 로직 (필요시 추가)
                    return; 
                }

                // 2. 활성 영역 매칭 확인
                if (activeIds.includes(regionId)) {
                    matchCount++;
                    console.log(`✅ 매칭 성공: ${regionId} (태그: ${element.tagName})`);

                    element.classList.add('puzzle-piece');

                    // [Hover Event]
                    element.addEventListener('mouseenter', function() {
                        // z-index 상위로 올리기 (path는 appendChild로 순서 변경 시 깨질 수 있으니 주의)
                        // 그룹(g)일 경우에만 순서 변경 시도
                        if(this.tagName.toLowerCase() === 'g') {
                            this.parentNode.appendChild(this);
                        }
                        
                        const data = currentConfig.db[regionId] || { name: 'Unknown', count: 0 };
                        tTitle.innerText = data.name;
                        tCountSpan.innerText = data.count.toLocaleString();

                        const rect = element.getBoundingClientRect();
                        tooltip.style.display = 'flex';
                        
                        // 툴팁 위치 계산 로직
                        let isLeft = false;
                        if(currentRegionKey === 'national') {
                            isLeft = (currentConfig.leftSideIds || []).includes(regionId);
                        } else {
                            isLeft = (rect.left + rect.width/2) < (window.innerWidth / 2);
                        }
                        
                        if (isLeft) {
                            tooltip.style.flexDirection = 'row-reverse';
                            tooltipLine.style.marginRight = '0px'; tooltipLine.style.marginLeft = '10px'; tooltipLine.style.transformOrigin = 'right center';
                            tooltipContent.style.alignItems = 'flex-end';
                            const startX = rect.left + (rect.width * 0.2); const startY = rect.top + (rect.height * 0.3);
                            tooltip.style.left = 'auto'; tooltip.style.right = `${window.innerWidth - startX}px`; tooltip.style.top = `${startY}px`;
                        } else {
                            tooltip.style.flexDirection = 'row';
                            tooltipLine.style.marginRight = '10px'; tooltipLine.style.marginLeft = '0px'; tooltipLine.style.transformOrigin = 'left center';
                            tooltipContent.style.alignItems = 'flex-start';
                            const startX = rect.right - (rect.width * 0.2); const startY = rect.top + (rect.height * 0.3);
                            tooltip.style.right = 'auto'; tooltip.style.left = `${startX}px`; tooltip.style.top = `${startY}px`;
                        }

                        if (tooltipTimeline) tooltipTimeline.kill();
                        tooltipTimeline = gsap.timeline();
                        tooltipTimeline.set(tooltipLine, { width: 0 }).set(tooltipContent, { opacity: 0, y: 10 })
                            .to(tooltipLine, { width: 80, duration: 0.4, ease: "power2.out" })
                            .to(tooltipContent, { opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" }, "-=0.2");
                    });

                    // [Leave Event]
                    element.addEventListener('mouseleave', function() {
                        if (tooltipTimeline) tooltipTimeline.kill();
                        tooltip.style.display = 'none';
                    });

                    // [Click Event]
                    element.addEventListener('click', (e) => {
                        e.stopPropagation();
                        tooltip.style.display = 'none';

                        if (!isDetailMode) {
                            // 전국 -> 상세 이동
                             gsap.timeline()
                                .to(element, { scale: 1.2, duration: 0.2, ease: "back.in(2)", zIndex: 100 }) 
                                .to("#svg-container", { scale: 5, opacity: 0, duration: 0.8, ease: "power4.in" })
                                .to(overlay, { opacity: 1, duration: 0.5 }, "<0.3")
                                .to({}, { onComplete: () => { 
                                    window.location.search = `?region=${regionId}`; 
                                } });
                        } else {
                            // 상세 -> 뉴스 등 이동
                            alert(`${currentConfig.db[regionId].name} 상세 페이지로 이동합니다. (구현 예정)`);
                        }
                    });
                } else {
                    // 매칭되지 않는 요소 (배경 등)
                    // 단, ID가 있는 경우에만 disabled 처리를 하여 불필요한 요소 간섭 최소화
                    if (rawId) {
                         element.classList.add('region-disabled');
                    }
                }
            });

            if (matchCount === 0) {
                console.warn("⚠️ 경고: 데이터와 매칭된 SVG 요소가 하나도 없습니다. SVG 파일의 ID를 확인하세요.");
                console.log("힌트: 일러스트레이터 레이어 이름이 'detail_busan' 등으로 정확히 설정되었는지 확인하세요.");
            }
        }
        