from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn

app = FastAPI(
    title="Animal Explorer API",
    description="動物探索系統的 API 服務",
    version="1.0.0"
)

# 允許跨域請求
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 資料模型
class Animal(BaseModel):
    id: str
    name: str
    image: str
    summary: str
    description: str

class Comment(BaseModel):
    id: str
    text: str
    time: str

class LikeData(BaseModel):
    count: int
    is_liked: bool

# 模擬資料庫（實際專案會用真實資料庫）
animals_db = {
    "lion": {
        "id": "lion",
        "name": "Lion",
        "image": "photo/lion.jpg",
        "summary": "獅子是群居的大型貓科，棲息於開闊草原，象徵力量與領導。",
        "description": "獅子（Panthera leo）是大型貓科動物，被稱為「草原之王」。雄獅擁有標誌性的鬃毛，而雌獅則負責大部分狩獵工作。獅子是群居動物，生活在稱為「獅群」的社會群體中，通常由一頭雄獅、幾頭雌獅和幼獅組成。\n\n獅子主要棲息在非洲的開闊草原和稀樹草原，少數亞洲獅生活在印度的吉爾森林國家公園。它們是頂級掠食者，主要以大型草食動物為食，如斑馬、水牛和羚羊。獅子的吼聲可以傳播到8公里外，用於標記領地和與群體成員溝通。"
    },
    "tiger": {
        "id": "tiger",
        "name": "Tiger",
        "image": "photo/tiger.jpg",
        "summary": "老虎為獨居掠食者，條紋具偽裝作用，是亞洲體型最大的貓科。",
        "description": "老虎（Panthera tigris）是現存體型最大的貓科動物，以其獨特的條紋圖案聞名。每隻老虎的條紋都是獨一無二的，就像人類的指紋一樣。老虎是獨居動物，擁有廣闊的領地，雄性老虎的領地通常比雌性大得多。\n\n老虎主要分布在亞洲，從西伯利亞的針葉林到熱帶雨林都有它們的蹤跡。它們是游泳健將，喜歡在水中降溫和狩獵。老虎的狩獵成功率約為10-20%，主要捕食鹿、野豬和野牛等大型哺乳動物。由於棲息地喪失和盜獵，老虎的數量急劇下降，目前被列為瀕危物種。"
    },
    "puma": {
        "id": "puma",
        "name": "Puma",
        "image": "photo/puma.jpg",
        "summary": "美洲獅（Puma）行動敏捷，分布於美洲多種棲地，夜行性居多。",
        "description": "美洲獅（Puma concolor），也被稱為山獅或美洲豹，是美洲大陸上分布最廣的大型貓科動物。它們的適應性極強，可以生活在從加拿大北部到南美洲南端的各種環境中，包括森林、草原、沙漠和山區。\n\n美洲獅是獨居動物，夜行性較強，主要在黃昏和黎明時活動。它們是優秀的跳躍者，可以垂直跳躍5米高，水平跳躍12米遠。美洲獅的狩獵技巧高超，主要捕食鹿、麋鹿和野豬等大型哺乳動物。與其他大型貓科動物不同，美洲獅不會咆哮，而是發出類似家貓的叫聲。"
    },
    "wolf": {
        "id": "wolf",
        "name": "Wolf",
        "image": "photo/wolf.jpg",
        "summary": "灰狼是高度社會化的犬科動物，群體合作狩獵，領地性強。",
        "description": "灰狼（Canis lupus）是犬科動物的代表，以其高度的社會性和合作狩獵行為聞名。狼群通常由一對繁殖的狼（alpha pair）領導，其他成員包括它們的後代和親戚。狼群的大小從2-30隻不等，取決於獵物的豐富程度。\n\n狼是頂級掠食者，在生態系統中扮演重要角色。它們主要捕食大型草食動物，如鹿、麋鹿和野牛，但也會吃小型哺乳動物、鳥類和魚類。狼的嚎叫聲用於群體溝通、標記領地和召集成員。狼群具有嚴格的社會等級制度，每個成員都有明確的角色和責任。"
    }
}

# 模擬資料庫（按讚和評論）
likes_db = {}
comments_db = {}

# API 路由
@app.get("/")
async def root():
    return {"message": "Animal Explorer API", "version": "1.0.0"}

@app.get("/animals", response_model=List[Animal])
async def get_animals():
    """取得所有動物清單"""
    return list(animals_db.values())

@app.get("/animals/{animal_id}", response_model=Animal)
async def get_animal(animal_id: str):
    """取得特定動物詳細資料"""
    if animal_id not in animals_db:
        raise HTTPException(status_code=404, detail="動物不存在")
    return animals_db[animal_id]

@app.get("/animals/{animal_id}/likes", response_model=LikeData)
async def get_likes(animal_id: str):
    """取得動物的按讚資料"""
    if animal_id not in animals_db:
        raise HTTPException(status_code=404, detail="動物不存在")
    
    like_data = likes_db.get(animal_id, {"count": 0, "is_liked": False})
    return LikeData(**like_data)

@app.post("/animals/{animal_id}/likes", response_model=LikeData)
async def toggle_like(animal_id: str, like_data: LikeData):
    """切換動物的按讚狀態"""
    if animal_id not in animals_db:
        raise HTTPException(status_code=404, detail="動物不存在")
    
    current_data = likes_db.get(animal_id, {"count": 0, "is_liked": False})
    new_liked = like_data.is_liked
    new_count = like_data.count
    
    likes_db[animal_id] = {"count": new_count, "is_liked": new_liked}
    return LikeData(**likes_db[animal_id])

@app.get("/animals/{animal_id}/comments", response_model=List[Comment])
async def get_comments(animal_id: str):
    """取得動物的評論清單"""
    if animal_id not in animals_db:
        raise HTTPException(status_code=404, detail="動物不存在")
    
    return comments_db.get(animal_id, [])

@app.post("/animals/{animal_id}/comments", response_model=Comment)
async def add_comment(animal_id: str, comment: Comment):
    """新增動物評論"""
    if animal_id not in animals_db:
        raise HTTPException(status_code=404, detail="動物不存在")
    
    if animal_id not in comments_db:
        comments_db[animal_id] = []
    
    comments_db[animal_id].append(comment)
    return comment

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)