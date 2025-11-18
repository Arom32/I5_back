// DOM 로드 완료 후 실행
document.addEventListener('DOMContentLoaded', function() {
    
    // 헤더 검색 기능
    const headerSearchInput = document.querySelector('.search-box input');
    const headerSearchBtn = document.querySelector('.search-btn');
    
    if(headerSearchBtn) {
        headerSearchBtn.addEventListener('click', function() {
            performHeaderSearch();
        });
    }
    
    if(headerSearchInput) {
        headerSearchInput.addEventListener('keypress', function(e) {
            if(e.key === 'Enter') {
                performHeaderSearch();
            }
        });
    }
    
    // function performHeaderSearch() {
    //     const query = headerSearchInput.value.trim();
    //     if(query === '') {
    //         alert('검색어를 입력해주세요.');
    //         return;
    //     }
    //     console.log('검색:', query);
    //     // 실제로는 검색 페이지로 이동
        
    // }
    
    // 히어로 섹션 버튼
    const primaryBtn = document.querySelector('.btn-primary');
    const secondaryBtn = document.querySelector('.btn-secondary');
    
    if(primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            console.log('단어 찾기 페이지로 이동');
            // window.location.href = 'search.html';
        });
    }
    
    if(secondaryBtn) {
        secondaryBtn.addEventListener('click', function() {
            console.log('시작하기 클릭');
            // window.location.href = 'signup.html';
        });
    }
    
    // 기능 카드 클릭 이벤트
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach((card, index) => {
        card.addEventListener('click', function() {
            const title = this.querySelector('h3').textContent;
            console.log(`${title} 카드 클릭됨`);
        });
        
        // 호버 효과 강화
        card.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = 'none';
        });
    });
    
    // 네비게이션 링크 클릭 이벤트
    const navLinks = document.querySelectorAll('.nav ul li a');
    
    // navLinks.forEach(link => {
    //     link.addEventListener('click', function(e) {
    //         e.preventDefault();
    //         const linkText = this.textContent;
    //         console.log(`${linkText} 클릭됨`);
            
    //         if(linkText === '로그인') {
    //             window.location.href = 'login.html';
    //         } else if(linkText === '회원가입') {
    //              window.location.href = 'signup.html';
    //         } else if(linkText === '프로필') {
    //              window.location.href = 'profile.html';
    //         }
    //     });
    // });
    
    // 푸터 링크 클릭 이벤트
    const footerLinks = document.querySelectorAll('.footer-Links a');
    
    footerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const linkText = this.textContent;
            console.log(`푸터 ${linkText} 클릭됨`);
        });
    });
    
    // 스크롤 애니메이션 (기능 카드)
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'all 0.6s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    featureCards.forEach(card => {
        observer.observe(card);
    });
});

// 페이지 로드 시 애니메이션
window.addEventListener('load', function() {
    const heroText = document.querySelector('.hero-text');
    if(heroText) {
        heroText.style.opacity = '0';
        heroText.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            heroText.style.transition = 'all 0.8s ease';
            heroText.style.opacity = '1';
            heroText.style.transform = 'translateY(0)';
        }, 100);
    }
});