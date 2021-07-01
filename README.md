# Web Programming Final Project - 3D Gather

組員：b07902016 林義閔, b07902114 陳柏衡

## About 3D Gather
我們的題目主要靈感來自「Gather town」，我們想要開發一個 3D 版本的 Gather town，在各自的房間中可以即時看到朋友走來走去，並且可以像 minecraft/gather town 一樣用物件打造自己的空間。

![](https://i.imgur.com/mpYcRXp.jpg)

### 功能測試與解說
1. 進入登入頁面，輸入任ㄧ room token，使用相同 room token 的user 之後會進入同個 room
2. 輸入自己的名字後按 join，可選擇之後在 room 中的個人角色以及房間背景，選完按 Ok 進入 room
3. 在 room 中透過上下左右自由移動
4. 若在 room 中有多位 user，能互相看見彼此的角色與姓名
5. 在 room 中，按下空白鍵可選擇想要在目前角色位置放置什麼物件(物品/家具)
6. Room 中的物件會存入 DB，因此玩家重新進入該 room，或是 server 重新啟動，room 中個 object 皆不會受影響
7. 按下 m 後可輸入訊息，並 publish 給其他玩家

## Usage

前端 server 預設會跑在 PORT 3000，後端 server 預設會跑在 PORT 8789，如果需要使用其他 PORT，可以透過指定環境變數來更改。

### Backend

```bash
$ cd backend
```
在 `.env` 中放入 mongo DB url (`MONGO_URL=<your url>`)

```bash
$ yarn install
$ yarn server
```

### Frontend

如果後端的位址不是 `localhost:8789`，請將 `frontend/src/index.js` 中所有 `localhost:8789` 的部分都改成新的後端位址（例如：`linux4.csie.ntu.edu.tw:8789`）

```bash
$ cd frontend
$ yarn install
$ yarn start
```


