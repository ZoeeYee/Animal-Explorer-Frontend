const animals = 
[
    {
        id: "lion",
        name: "Lion",
        image: "photo/lion.jpg",
        summary: "獅子是群居的大型貓科，棲息於開闊草原，象徵力量與領導。",
    },
    {
        id: "tiger",
        name: "Tiger",
        image: "photo/tiger.jpg",
        summary: "老虎為獨居掠食者，條紋具偽裝作用，是亞洲體型最大的貓科。",
    },
    {
        id: "puma",
        name: "Puma",
        image: "photo/puma.jpg",
        summary: "美洲獅（Puma）行動敏捷，分布於美洲多種棲地，夜行性居多。",
    },
    {
        id: "wolf",
        name: "Wolf",
        image: "photo/wolf.jpg",
        summary: "灰狼是高度社會化的犬科動物，群體合作狩獵，領地性強。",
    },
];

function createCard(animal)
{
    const card = document.createElement("article");
    card.className = "card";

    const img = document.createElement("img");
    img.src = animal.image;
    img.alt = animal.name;

    const content = document.createElement("div");
    content.className = "content";

    const title = document.createElement("h3");
    title.textContent = animal.name;

    const desc = document.createElement("p");
    desc.textContent = animal.summary;

    const actions = document.createElement("div");
    actions.className = "actions";

    const viewBtn = document.createElement("button");
    viewBtn.className = "btn";
    viewBtn.textContent = "查看";
    viewBtn.addEventListener("click", ()=>
        {//前往詳細頁，使用query string 傳遞 id
            location.href = `post.html?id=${encodeURIComponent(animal.id)}`;
        });
    
        actions.appendChild(viewBtn);
        content.appendChild(title);
        content.appendChild(desc);
        content.appendChild(actions);

        card.appendChild(img);
        card.appendChild(content);

        return card;
}

function renderGrid()
{
    const grid = document.getElementById("grid");
    grid.innerHTML = "";
    animals.forEach((a) => 
    {
        grid.appendChild(createCard(a));
    });
}

document.addEventListener("DOMContentLoaded", renderGrid);