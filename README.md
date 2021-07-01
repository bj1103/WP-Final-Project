# Web Programming Final Project - 3D Gather

組員：b07902016 林義閔, b07902114 陳柏衡

## About 3D Gather
我們的題目主要靈感來自「Gather town」，我們想要開發一個 3D 版本的 Gather town，在各自的房間中可以即時看到朋友走來走去，並且可以像 minecraft/gather town 一樣用物件打造自己的空間。

![](https://i.imgur.com/mpYcRXp.jpg)

### 功能測試與解說
1. 進入登入頁面，輸入任ㄧ room token，使用相同 room token 的user 之後會進入同個 room
2. 輸入自己的名字後按 join，可選擇之後在 room 中的個人角色以及房間背景，選完按 Ok 進入 room（如果 room 中有其他人選擇該角色，該角色將會無法被選擇）
3. 在 room 中透過上下左右自由移動
4. 若在 room 中有多位 user，能互相看見彼此的角色與姓名
5. 在 room 中，按下空白鍵可選擇想要在目前角色位置放置什麼物件（物品/家具），創建後所有玩家都可以即時看到新的物件
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
## 專案架構

### Backend

* 整體架構：node.js
* 使用 GraphQL 作為與前端的 API 接口
    * 提供前端user登入API
    * 提供前端query整個room的user與物件API
    * 提供前端移動角色位置API
    * 提供前端放置物件API
* 資料庫：
    * 存取各room內物件：mongo DB
    * 存取各玩家位置：server local memory
        * 為了確保玩家移動在各個前端畫面能夠快速同步，玩家的位置資訊不會存入mongo DB，而是只存在memory，玩家移動時，便能快速修改且publish給其他玩家

```
backend
├── src
│   ├── db.js
│   ├── index.js
│   ├── mongo.js
│   ├── resolvers
│   │   ├── Mutation.js
│   │   ├── Query.js
│   │   ├── Room.js
│   │   └── Subscription.js
│   └── schema.graphql
└── yarn.lock
```

### Frontend

* 整體架構：React.js
* 3D render:
    * `@react-three/fiber`: three.js renderer for React.js
    * `@react-three/cannon`: react three fiber 可用的物理引擎
* 後端溝通：GraphQL
    * Query: 獲取房間資訊（角色使用情況、物件等）
    * Mutation: 玩家移動、物件創立、房間創立
    * Subscription: 即時獲得玩家位置、物件資訊、即時訊息

```
frontend
├── public
│   ├── ...
│   └── Static files and 3D models
├── src
│   ├── App.css
│   ├── App.js
│   ├── App.test.js
│   ├── components
│   │   ├── MessageModal.js
│   │   ├── ModelModal.js
│   │   ├── Room.js
│   │   ├── SelectModal.js
│   │   └── SignIn.js
│   ├── data
│   │   ├── characters.json
│   │   └── models.json
│   ├── graphql
│   │   ├── index.js
│   │   ├── mutations.js
│   │   ├── queries.js
│   │   └── subscriptions.js
│   ├── index.css
│   ├── index.js
│   ├── objects
│   │   ├── Friend.js
│   │   ├── Objects.js
│   │   ├── Plane.js
│   │   ├── Player.js
│   │   └── Text.js
│   ├── reportWebVitals.js
│   └── setupTests.js
└── yarn.lock
```

## 分工情況

| 組員 | 負責項目 |
| -------- | --------  |
| 陳柏衡     |  後端所有部分、前端 GraphQL 接口    |
| 林義閔     |  前端 React 架構、介面 component、3D component   |

## 過程中遇到的困難
1. 第一次接觸 three.js
2. `@react-three/fiber` 的相關文件不多，很多問題都花非常久的時間才解決
3. 整個前端 APP 過於龐大（5000 多個 packages），導致部署上遇到非常多的問題，最後只能跑在工作站上

## 未來可以繼續完成的功能
1. 更人性化的操作，像是可以面向鼠標的方向等
2. 玩家間的通訊功能（語音、視訊等等）
3. 更豐富的互動模式，可以透過物理引擎達到一些小遊戲的效果，例如把別人撞飛等等

