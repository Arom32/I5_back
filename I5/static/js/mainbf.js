document.addEventListener('DOMContentLoaded', function() {

    const headerSearchInput = document.querySelector('.search-box input');
    const headerSearchBtn = document.querySelector('.search-btn');
    
    function performHeaderSearch() {
        if (!headerSearchInput) {
            return;
        }

        const query = headerSearchInput.value.trim();
        if(query === '') {
            alert('검색어를 입력해주세요.');
            return;
        }
        console.log('검색:', query);
    }
    
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
    
    
    const primaryBtn = document.querySelector('.btn-primary');
    const secondaryBtn = document.querySelector('.btn-secondary');
    
    if(primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            console.log('단어 찾기 페이지로 이동');
        });
    }
    
    if(secondaryBtn) {
        secondaryBtn.addEventListener('click', function() {
            console.log('시작하기 클릭');
        });
    }
    
    
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach((card, index) => {
        card.addEventListener('click', function() {
            const titleElement = this.querySelector('h3') ? this.querySelector('h3') : this;
            const title = titleElement.textContent;
            console.log(`${title} 카드 클릭됨`);
            
            switch(index) {
                case 0:
                    // window.location.href = 'search.html';
                    break;
                case 1:
                    // window.location.href = 'wordbook.html';
                    break;
                case 2:
                    // window.location.href = 'game.html';
                    break;
            }
        });
    });
    
    const navLinks = document.querySelectorAll('.nav ul li a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            //e.preventDefault();
            const linkText = this.textContent;
            console.log(`${linkText} 클릭됨`);
            
            if(linkText === '로그인') {
                window.location.href = this.href;
            } 
            else if (linkText === '회원가입') {
                window.location.href = this.href;
            }
        });
    });
    
    
    const footerLinks = document.querySelectorAll('.footer-Links a');
    
    footerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const linkText = this.textContent;
            console.log(`푸터 ${linkText} 클릭됨`);
        });
    });
});

