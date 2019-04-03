# HYU-OMS Web App

한양대학교 주문관리시스템은 2014년도에 처음 만들어진 후 매년 학교 축제 주점에서 사용되고 있습니다.  
본 Repository 는 Web Frontend App 코드입니다.

### 개발 역사
  - 2014년
    - 최초 개발, PHP5 기반
    - Facebook, Kakao 로그인 사용
  - 2015년
    - 특별한 업데이트 없음
  - 2016년
    - Front-End 와 Back-End 를 분리
    - Front-End 를 Static Server 를 이용하여 제공하기 시작
    - Front-End 를 AngularJS 를 이용하여 제작. (AngularJS is not an Angular!)
    - Back-End 를 PHP 에서 Node.JS (with [ExpressJS](https://expressjs.com)) 로 변경
    - Social Login 제거
  - 2017년
    - Front-End UI 변경 ([Semantic UI](https://semantic-ui.com) 사용)
    - Front-End 를 [React](https://reactjs.org/) 를 이용하여 제작.
    - Back-End 언어를 Node.JS -> Python3 (with [Flask](http://flask.pocoo.org)) 로 변경
    - Social Login 복원 (Facebook, Kakao)
    - 이 때부터 발생되는 모든 기록을 그대로 유지 중
  - 2018년
    - Back-End 언어는 그대로 유지
    - Front-End UI 변경 ([Material UI](https://material-ui.com) 사용)
  - 2019년
    - Back-End 언어를 Python3 -> Node.JS (with [ExpressJS](https://expressjs.com)) 로 변경
    - Front-End UI 일부 변경 ([Material UI](https://material-ui.com) 는 그대로 유지)
    - 실시간 업데이트를 위해 Socket.IO 도입 시도했으나 Rollback.

### HYU-OMS Web App 사용을 위해 필요한 것들
  - Node.JS 10.x or higher (to build this project)
  - Web Server
    - Nginx
    - Apache
    - AWS S3 Static Hosting
    - etc... (암튼 Static File Serve 가 가능하면 됩니다.)

### 테스트용 로컬 서버 시작 또는 production build 전에 미리 세팅해야 하는 것
`/src/reducer` 디렉터리에는 `auth.js` 라는 파일이 존재합니다.    
여기에는 API 서버의 URL 을 지정하는 부분이 존재합니다.  
기본적으로 `development` 환경의 경우 `http://127.0.0.1:8080`, 아닐 경우 `https://api.hyu-oms.com` 으로 지정되어 있습니다.  
이 URL 을 변경하고 싶을 경우 Environment Variable `REACT_APP_API_URL` 에 값을 아래 예시와 같이 직접 지정해 주시면 됩니다.
```sh
$ REACT_APP_API_URL=http://localhost:8080 npm start
```
```sh
$ REACT_APP_API_URL=http://localhost:8080 npm run build
```

### 테스트용 로컬 서버 시작하기 (Development)
```sh
$ npm install
$ REACT_APP_API_URL=[YOUR_CUSTOM_API_URL] npm start
```

### 빌드하기 (Production)
```sh
$ npm install
$ REACT_APP_API_URL=[YOUR_CUSTOM_API_URL] npm run build
```
`npm run build` 명령의 결과로 `build` directory 가 생성되게 됩니다.  
이 디렉터리를 web root directory 로 사용하시면 됩니다.

### 기타 안내
 - 자동 업데이트 코드가 현재는 제거되어 있는 상태이며 주문 상태 등 여러 가지 정보가 자동으로 업데이트가 되지 않는 상태입니다. 이 문제는 곧 수정 예정입니다.

### Todos
 - 실시간 (에 가까운?) 업데이트 기능 추가
   - 이전에는 일정 시간마다 데이터를 새로 받아오게끔 Front-End 쪽 코드에 구현을 해놨는데 이번에는 어떻게 바꿔볼 지 고민 중입니다. Socket.IO 도입을 고려했고 실제로 테스트까지 진행을 해봤으나 네트워크가 불안정한 경우 제 기능을 못하는 듯 하여 일단은 다시 제거했습니다.
 - Push Notification
   - iOS Safari 에서 아직 Web Push 를 지원하지 않아서 보류 중입니다.

### License
여기에 사용된 각종 라이브러리들은 (뭐 당연하지만) 원 프로젝트의 License 를 따라가게 됩니다.  
본 프로젝트에서 생성된 고유 코드는 상업적으로 사용하실 수 없습니다.