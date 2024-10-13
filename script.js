const cardContainer = document.getElementById('cardContainer');
const startButton = document.getElementById('startGame');
const timerDisplay = document.getElementById('timerDisplay');
const countdownSelect = document.getElementById('countdownSelect');
const flipAllFrontButton = document.getElementById('flipAllFront');
const flipAllBackButton = document.getElementById('flipAllBack');
const themeSelect = document.getElementById('themeSelect'); // 新增主題選擇器
const gridSizeSelect = document.getElementById('gridSizeSelect'); // 新增格子大小選擇器

const purpleThemeBackImages = [
    'photo/a1.png', 'photo/a2.png', 'photo/a3.png', 
    'photo/a4.png', 'photo/a5.png', 'photo/a6.png', 
    'photo/a7.png', 'photo/a8.png', 'photo/a9.png', 
    'photo/a10.png', 'photo/a11.png', 'photo/a12.png', 
    'photo/a13.png', 'photo/a14.png', 'photo/a15.png', 
    'photo/a16.png', 'photo/a17.png', 'photo/a18.png', 
    'photo/a19.png', 'photo/a20.png', 'photo/a21.png', 
    'photo/a22.png', 'photo/a23.png', 'photo/a24.png', 
    'photo/a25.png', 'photo/a26.png', 'photo/a27.png', 
    'photo/a28.png', 'photo/a29.png', 'photo/a30.png', 
    'photo/a31.png', 'photo/a32.png', 'photo/a33.png', 
    'photo/a34.png', 'photo/a35.png', 'photo/a36.png',
];

const blueThemeBackImages = [
    'photo/c1.png', 'photo/c2.png', 'photo/c3.png', 
    'photo/c4.png', 'photo/c5.png', 'photo/c6.png', 
    'photo/c7.png', 'photo/c8.png', 'photo/c9.png', 
    'photo/c10.png', 'photo/c11.png', 'photo/c12.png', 
    'photo/c13.png', 'photo/c14.png', 'photo/c15.png', 
    'photo/c16.png', 'photo/c17.png', 'photo/c18.png', 
    'photo/c19.png', 'photo/c20.png', 'photo/c21.png', 
    'photo/c22.png', 'photo/c23.png', 'photo/c24.png', 
    'photo/c25.png', 'photo/c26.png', 'photo/c27.png', 
    'photo/c28.png', 'photo/c29.png', 'photo/c30.png', 
    'photo/c31.png', 'photo/c32.png', 'photo/c33.png', 
    'photo/c34.png', 'photo/c35.png', 'photo/c36.png',
];

let cards = [];
let countdownInterval;
let cardsLocked = false;
let remainingTime = 10; // 預設為 10 秒
let flipBackCountdown = parseInt(countdownSelect.value); // 根據選單值來設定翻回背面的時間

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// 更新翻回背面的倒數時間與顯示的倒數計時
countdownSelect.addEventListener('change', () => {
    flipBackCountdown = parseInt(countdownSelect.value); // 取得選單中的秒數
    remainingTime = flipBackCountdown; // 讓翻回背面倒數與剩餘時間一致
    updateTimerDisplay(remainingTime);
});

// 更新計時顯示
function updateTimerDisplay(seconds) {
    timerDisplay.textContent = `剩餘時間: ${seconds}秒`;
}

// 開始遊戲按鈕邏輯
startButton.onclick = () => {
    cardsLocked = true;
    clearInterval(countdownInterval); // 防止多重倒數計時
    remainingTime = flipBackCountdown; // 將剩餘時間設定為選單選擇的秒數
    updateTimerDisplay(remainingTime);
    
    // 讓卡片翻轉至背面
    document.querySelectorAll('.card').forEach(card => {
        card.classList.add('flipped');
    });

    // 倒數計時邏輯
    countdownInterval = setInterval(() => {
        remainingTime--;
        updateTimerDisplay(remainingTime);

        if (remainingTime <= 0) {
            clearInterval(countdownInterval);
            document.querySelectorAll('.card').forEach(card => {
                card.classList.remove('flipped'); // 時間到後翻回正面
            });
            cardsLocked = false; // 解除卡片鎖定
        }
    }, 1000);
};

// 初始化卡片的時候，也讓倒數計時同步
window.onload = () => {
    createCards(); // 創建卡片
    flipBackCountdown = parseInt(countdownSelect.value); // 初始化翻回背面倒數時間
    updateTimerDisplay(flipBackCountdown); // 更新顯示
};

// 根據主題獲取背面圖片
function getBackImages() {
    const theme = themeSelect.value;
    return theme === 'blue' ? blueThemeBackImages : purpleThemeBackImages;
}

// 創建卡片
function createCards() {
    const backImages = getBackImages();
    cards = [];

    const selectedGridSize = gridSizeSelect.value; 
    let totalPairs;

    switch (selectedGridSize) {
        case '2x2':
            totalPairs = 2;
            cardContainer.style.gridTemplateColumns = 'repeat(2, 1fr)'; 
            cardContainer.style.gridTemplateRows = 'repeat(2, 1fr)';  
            break;
        case '4x4':
            totalPairs = 8;
            cardContainer.style.gridTemplateColumns = 'repeat(4, 1fr)'; 
            cardContainer.style.gridTemplateRows = 'repeat(4, 1fr)';  
            break;
        case '6x6':
            totalPairs = 18;
            cardContainer.style.gridTemplateColumns = 'repeat(6, 1fr)'; 
            cardContainer.style.gridTemplateRows = 'repeat(6, 1fr)';  
            break;
        default:
            totalPairs = 8;
            cardContainer.style.gridTemplateColumns = 'repeat(4, 1fr)'; 
            cardContainer.style.gridTemplateRows = 'repeat(4, 1fr)';  
            break;
    }

    const selectedImages = backImages.slice(0, totalPairs);
    selectedImages.forEach((backImage) => {
        cards.push({ front: '紫色', back: backImage });
        cards.push({ front: '紫色', back: backImage });
    });

    shuffle(cards); 
    cardContainer.innerHTML = ''; 
    cards.forEach((cardData) => {
        const card = document.createElement('div');
        card.classList.add('card');

        card.onclick = () => {
            flipCard(card, cardData);
        };

        const cardFront = document.createElement('div');
        cardFront.classList.add('card-front');
        cardFront.style.backgroundColor = getThemeColor();

        const cardBack = document.createElement('div');
        cardBack.classList.add('card-back');
        const backImg = document.createElement('img');
        backImg.src = cardData.back;
        backImg.alt = '卡片背面';
        backImg.onload = () => {
            cardBack.appendChild(backImg); // 確保圖片加載後再添加
        };
        backImg.onerror = () => {
            console.error(`無法加載圖片: ${cardData.back}`); // 錯誤處理
        };

        card.appendChild(cardFront);
        card.appendChild(cardBack);
        cardContainer.appendChild(card);
    });
}

// 根據主題獲取顏色
function getThemeColor() {
    const theme = themeSelect.value;
    return theme === 'blue' ? 'blue' : 'purple';
}

// 禁用按鈕
function disableButtons() {
    flipAllFrontButton.disabled = true;
    flipAllBackButton.disabled = true;
}

// 監聽主題和網格大小的變更
themeSelect.addEventListener('change', () => {
    createCards();
});
gridSizeSelect.addEventListener('change', () => {
    createCards();
});

// 翻轉所有卡牌到正面
flipAllFrontButton.onclick = () => {
    document.querySelectorAll('.card').forEach(card => {
        card.classList.remove('flipped'); 
    });
};

// 翻轉所有卡牌到背面
flipAllBackButton.onclick = () => {
    document.querySelectorAll('.card').forEach(card => {
        card.classList.add('flipped'); 
    });
};

function flipCard(cardElement, cardData) {
    cardElement.classList.toggle('flipped'); 
    const flippedCards = document.querySelectorAll('.card.flipped');

    if (flippedCards.length === 2) {
        cardsLocked = true; 

        const firstCardBack = flippedCards[0].querySelector('.card-back img').src;
        const secondCardBack = flippedCards[1].querySelector('.card-back img').src;

        if (firstCardBack === secondCardBack) {
            flippedCards.forEach(card => {
                card.classList.add('matched'); 
                card.removeEventListener('click', () => {}); 
            });

            // 等待動畫結束後再從 DOM 中刪除卡牌
            flippedCards.forEach(card => {
                card.addEventListener('animationend', () => {
                    card.style.display = 'none'; // 隱藏卡牌
                });
            });
        } else {
            setTimeout(() => {
                flippedCards.forEach(card => {
                    card.classList.remove('flipped'); 
                });
                cardsLocked = false; 
            }, 1000); 
        }
    }
}
