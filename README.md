# Web Programming Final Project - 3D Gather

組員：b07902016 林義閔, b07902114 陳柏衡

## Usage

### Backend

```bash
$ cd backend
```
在.env中放入mongo DB url

```bash
$ yarn install
$ yarn server
```

### Frontend

如果後端的位址不是 `localhost:4000`，請將 `frontend/src/index.js` 中所有 `localhost:4000` 的部分都改成新的後端位址（例如：`linux4.csie.ntu.edu.tw:8789`）

```bash
$ cd frontend
$ yarn install
$ yarn start
```

前端 server 預設會跑在 PORT 3000，後端 server 預設會跑在 PORT 8789，如果需要使用其他 PORT，可以透過指定環境變數來更改。

