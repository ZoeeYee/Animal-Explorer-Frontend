// 動物詳細資料
const animalDetails = {
    lion:
    {
        name: "Lion",
        image: "photo/lion.jpg",
        description: "獅子（Panthera leo）是大型貓科動物，被稱為「草原之王」。雄獅擁有標誌性的鬃毛，而雌獅則負責大部分狩獵工作。獅子是群居動物，生活在稱為「獅群」的社會群體中，通常由一頭雄獅、幾頭雌獅和幼獅組成。\n\n獅子主要棲息在非洲的開闊草原和稀樹草原，少數亞洲獅生活在印度的吉爾森林國家公園。它們是頂級掠食者，主要以大型草食動物為食，如斑馬、水牛和羚羊。獅子的吼聲可以傳播到8公里外，用於標記領地和與群體成員溝通。"
    },
    tiger:
    {
        name: "Tiger",
        image: "photo/tiger.jpg",
        description: "老虎（Panthera tigris）是現存體型最大的貓科動物，以其獨特的條紋圖案聞名。每隻老虎的條紋都是獨一無二的，就像人類的指紋一樣。老虎是獨居動物，擁有廣闊的領地，雄性老虎的領地通常比雌性大得多。\n\n老虎主要分布在亞洲，從西伯利亞的針葉林到熱帶雨林都有它們的蹤跡。它們是游泳健將，喜歡在水中降溫和狩獵。老虎的狩獵成功率約為10-20%，主要捕食鹿、野豬和野牛等大型哺乳動物。由於棲息地喪失和盜獵，老虎的數量急劇下降，目前被列為瀕危物種。"
    },
    puma:
    {
        name: "Puma",
        image: "photo/puma.jpg",
        description: "美洲獅（Puma concolor），也被稱為山獅或美洲豹，是美洲大陸上分布最廣的大型貓科動物。它們的適應性極強，可以生活在從加拿大北部到南美洲南端的各種環境中，包括森林、草原、沙漠和山區。\n\n美洲獅是獨居動物，夜行性較強，主要在黃昏和黎明時活動。它們是優秀的跳躍者，可以垂直跳躍5米高，水平跳躍12米遠。美洲獅的狩獵技巧高超，主要捕食鹿、麋鹿和野豬等大型哺乳動物。與其他大型貓科動物不同，美洲獅不會咆哮，而是發出類似家貓的叫聲。"
    },
    wolf:
    {
        name: "Wolf",
        image: "photo/wolf.jpg",
        description: "灰狼（Canis lupus）是犬科動物的代表，以其高度的社會性和合作狩獵行為聞名。狼群通常由一對繁殖的狼（alpha pair）領導，其他成員包括它們的後代和親戚。狼群的大小從2-30隻不等，取決於獵物的豐富程度。\n\n狼是頂級掠食者，在生態系統中扮演重要角色。它們主要捕食大型草食動物，如鹿、麋鹿和野牛，但也會吃小型哺乳動物、鳥類和魚類。狼的嚎叫聲用於群體溝通、標記領地和召集成員。狼群具有嚴格的社會等級制度，每個成員都有明確的角色和責任。"
    }
};

// 從 URL 獲取動物 ID
function getAnimalId()
{
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// 載入動物資料
function loadAnimalData()
{
    const animalId = getAnimalId();
    if (!animalId || !animalDetails[animalId])
    {
        document.getElementById('loading').textContent = '找不到該動物資料';
        return;
    }

    const animal = animalDetails[animalId];
    
    // 更新頁面標題
    document.getElementById('page-title').textContent = animal.name;
    document.title = `${animal.name} - 動物詳情`;
    
    // 更新動物資料
    document.getElementById('animal-image').src = animal.image;
    document.getElementById('animal-image').alt = animal.name;
    document.getElementById('animal-title').textContent = animal.name;
    document.getElementById('animal-description').textContent = animal.description;
    
    // 載入按讚資料
    loadLikeData(animalId);
    
    // 載入評論資料
    loadComments(animalId);
    
    // 顯示內容
    document.getElementById('loading').style.display = 'none';
    document.getElementById('animal-detail').style.display = 'block';
}

// 載入按讚資料
function loadLikeData(animalId)
{
    const likeKey = `animal_like_${animalId}`;
    const isLiked = localStorage.getItem(likeKey) === 'true';
    const likeCount = parseInt(localStorage.getItem(`${likeKey}_count`) || '0');
    
    updateLikeButton(isLiked, likeCount);
}

// 更新按讚按鈕
function updateLikeButton(isLiked, count)
{
    const likeBtn = document.getElementById('like-btn');
    const likeIcon = document.getElementById('like-icon');
    const likeText = document.getElementById('like-text');
    const likeCount = document.getElementById('like-count');
    
    if (isLiked)
    {
        likeBtn.classList.add('liked');
        likeIcon.textContent = '❤️';
        likeText.textContent = '已讚';
    }
    else
    {
        likeBtn.classList.remove('liked');
        likeIcon.textContent = '🤍';
        likeText.textContent = '按讚';
    }
    
    likeCount.textContent = `${count} 個讚`;
}

// 切換按讚狀態
function toggleLike()
{
    const animalId = getAnimalId();
    const likeKey = `animal_like_${animalId}`;
    const countKey = `${likeKey}_count`;
    
    const isLiked = localStorage.getItem(likeKey) === 'true';
    const currentCount = parseInt(localStorage.getItem(countKey) || '0');
    
    const newLiked = !isLiked;
    const newCount = newLiked ? currentCount + 1 : currentCount - 1;
    
    localStorage.setItem(likeKey, newLiked.toString());
    localStorage.setItem(countKey, newCount.toString());
    
    updateLikeButton(newLiked, newCount);
}

// 載入評論
function loadComments(animalId)
{
    const commentsKey = `animal_comments_${animalId}`;
    const comments = JSON.parse(localStorage.getItem(commentsKey) || '[]');
    
    const commentsList = document.getElementById('comments-list');
    commentsList.innerHTML = '';
    
    if (comments.length === 0)
    {
        commentsList.innerHTML = '<p style="color: #9ca3af; text-align: center; margin: 20px 0;">還沒有評論，來發表第一個評論吧！</p>';
        return;
    }
    
    comments.forEach(comment =>
    {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment-item';
        commentElement.innerHTML = 
        `
            <p class="comment-text">${comment.text}</p>
            <p class="comment-time">${comment.time}</p>
        `;
        commentsList.appendChild(commentElement);
    });
}

// 新增評論
function addComment()
{
    const animalId = getAnimalId();
    const commentInput = document.getElementById('comment-input');
    const commentText = commentInput.value.trim();
    
    if (!commentText)
    {
        alert('請輸入評論內容');
        return;
    }
    
    const commentsKey = `animal_comments_${animalId}`;
    const comments = JSON.parse(localStorage.getItem(commentsKey) || '[]');
    
    const newComment =
    {
        text: commentText,
        time: new Date().toLocaleString('zh-TW')
    };
    
    comments.push(newComment);
    localStorage.setItem(commentsKey, JSON.stringify(comments));
    
    commentInput.value = '';
    loadComments(animalId);
}

// 事件監聽器
document.addEventListener('DOMContentLoaded', function()
{
    loadAnimalData();
    
    // 按讚按鈕
    document.getElementById('like-btn').addEventListener('click', toggleLike);
    
    // 評論提交
    document.getElementById('comment-submit').addEventListener('click', addComment);
    
    // 按 Enter 鍵提交評論
    document.getElementById('comment-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter')
        {
            addComment();
        }
    });
});