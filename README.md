<div align=center>
  <img width="636" alt="image" src="https://github.com/user-attachments/assets/0af48bc6-0594-492f-b030-e44ee2654a0f">
</div>

<h1 align=center style="text-align: center; font-size: 1.5em">친해지길: Road to Friendly</h3>

<div align=center>

<p>서먹서먹한 팀의 분위기를 타파하기 위해 공감 포인트를 수집하고,<br>이야기를 나누며 자연스레 아이스 브레이킹을 진행해봅시다!</p>

https://road-to-friendly.kro.kr/

<br>

<p align=center>
  <a href="https://lime-mall-d34.notion.site/Road-to-friendly-2d8db233c6da4aaf8c3696a80ec83555?pvs=4">팀 노션</a>
  &nbsp; | &nbsp; 
  <a href="https://github.com/orgs/boostcampwm-2024/projects/13/views/6">백로그</a>
  &nbsp; | &nbsp;
  <a href="https://www.figma.com/design/wEa4zPVSbR94NPZ4rpgXpX/%EC%B9%9C%ED%95%B4%EC%A7%80%EA%B8%B8-%EB%94%94%EC%9E%90%EC%9D%B8?node-id=0-1&t=DG0578d4l8h9ZfxJ-1">피그마</a>
  &nbsp; | &nbsp; 
  <a href="https://github.com/boostcampwm-2024/web11-road_to_friendly/wiki">위키</a>
</p>

<div align=center>
  <a href="https://hits.seeyoufarm.com"><img src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2Fboostcampwm-2024%2Fweb11-road_to_friendly&count_bg=%23B681FF&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=hits&edge_flat=false"/></a>
</div>
</div>
<br>

## ✨ 프로젝트 소개

<p>
  친해지길은 서로가 처음인 사람들로 구성된 팀이 친해지기를 바라는 마음에서 기획한 온라인 아이스브레이킹 플랫폼입니다.
  <br>
  팀원들끼리 여러 질문들에 대해 실시간으로 답변 키워드를 입력하며 비슷한 취향이나 관심사를 파악하고, 관련된 다양한 컨텐츠를 공유하며 빠르게 친밀감을 형성할 수 있습니다.
</p>

<br>
 
## 🚀 주요 기능

### 🙋‍♀️ 가벼운 아이스브레이킹 질문들에 실시간으로 답변하며 서로의 관심사를 파악해 보세요

> 여러 명이 입력했거나, 많은 공감을 받은 답변들을 한눈에 파악할 수 있는 워드 클라우드 UI를 제공해요

![키워드표시](https://github.com/user-attachments/assets/cfce2002-a8c4-4392-9260-00c2da37402f)

### 💫 우리 팀에서 이야기 나누면 좋을만한 공통 관심사를 확인할 수 있어요

> 모든 아이스브레이킹 질문이 끝나면, 개개인의 답변들 중 공감을 많이 받은 항목들을 표시하고, 팀에서 함께 나누면 좋을만한 공통 관심사를 분석해서 제안해 드려요

![통계](https://github.com/user-attachments/assets/ef008e74-3a98-4e39-93c7-3f71136d9932)


### 🔃 서로의 관심사를 파악했다면 다함께 다양한 컨텐츠들을 실시간으로 공유하며 친해져봐요!

> 우리 팀이 다같이 즐길 수 있는 것도, 내가 추천하고 싶은 것도 좋아요. 이미지 또는 유튜브 컨텐츠를 공유할 수 있어요.

![컨텐츠 공유](https://github.com/user-attachments/assets/b3c6fc64-a950-49e6-aef7-9b691e2ce3b1)
![컨텐츠 공유 2](https://github.com/user-attachments/assets/6dc6a82d-7c0a-4fea-bf17-8f2060605113)

<br>

## 🗺️ 프로젝트 플로우

![image](https://github.com/user-attachments/assets/958b87aa-5f37-4d6e-8032-79b3e5811172)

<br>

## 🌈 기술적 도전 및 문제 해결 과정
### [FE] 워드 클라우드 UI 구현

> 참가자들의 실시간 답변과 공감 빈도를 동적인 UI로 표현하고 싶었습니다 <br>
키워드들이 서로 겹치지 않으면서 빈도수가 높을수록 중앙에 위치하도록 만들 수 있을까요? <br>
관련 오픈소스를 분석하고 별도의 라이브러리 없이 구현한 과정을 정리해 보았습니다 <br><br>
[👉 워드 클라우드 UI 구현을 위한 방향성 고민](https://www.notion.so/UI-f85d187089b34a2fa69756b9584e8621?pvs=21) <br>
[👉 jQCloud 라이브러리의 워드클라우드 UI 구현 로직 분석](https://www.notion.so/jQCloud-1-0-4-UI-1fe9ace4c951414a8fd9a519f0db051a?pvs=21) <br>
[👉 오픈소스를 참고하여 React에서 워드 클라우드 UI 구현하기](https://www.notion.so/React-UI-d37bce31d70448e1bbda70d882a7df53?pvs=21)

### [FE] 참여자들이 방을 입장할때 UI배치는 어떻게 이루어질까요?

> 실시간으로 입장하는 참여자들을 타원형으로 배치하고 싶어요! <br><br>
[👉사용자 배치 로직 구현하기](https://www.notion.so/4f6c1ed8d1d04938808add6f0009a2de?pvs=21)

### [FE] 통계 결과 소켓 알림 타이밍 제어 및 웹워커를 사용한 타이머 동기화

> 실시간 통계결과를 처리할 때, 소켓알림 이벤트 등록과 해제는 어디서 이루어질까요? <br>
브라우저 탭 비활성화 시 타이머의 정확도가 떨어지는 문제는 어떻게 해결할까요? <br>
웹워커의 도입 이유와 타이머 동기화문제, 그리고 소켓이벤트 리스너 등록 타이밍 문제를 해결하는 방법입니다 <br><br>
[👉소켓이벤트 알림 타이밍 제어](https://www.notion.so/c987e9af0b414550a2bccf6820fbc450?pvs=21) 

### [FE] 유튜브 영상을 어떻게 동기화할 수 있을까요?

> 유튜브 영상을 각 사용자 화면에서 동기화하려면, 영상 흐름 조작 권한을 특정 인원에게만 줘야 해요. <br>
그런데, 유튜브 영상은 iframe으로 가져와야 해요. iframe 내부 영상의 컨트롤러를 영상 흐름 조작만 막도록 커스텀할 수 있을까요? <br>
영상의 흐름과 프로그래스바는 setTimeout으로 동기화하는 게 좋을까요? <br>
유튜브 영상 흐름을 동기화할 때 차이는 어떻게 줄일 수 있을까요? <br><br>
[👉 유튜브 영상을 어떻게 가져올 수 있을까](https://www.notion.so/adc3df31fe8c461a8ce484933428866c?pvs=21) <br>
[👉 유튜브 클라이언트끼리 동기화 개발하기 일지](https://www.notion.so/5aa21774a2df485e8d61f6469dcdd884?pvs=21) <br>
[👉 커스텀 비디오 컨트롤러 개발하기](https://www.notion.so/80ea82a941834fe6a8452f612600f89d?pvs=21)

### [FE] 사용자가 한 번에 하나의 방에만 입장하게 하고 싶어요!

> 사용자가 중복 입장할 수 있다면 어떤 문제가 발생할까요? <br>
탭마다 독립적인 브라우징 컨텍스트를 가지는데, 어떻게 한 번에 하나의 방에 입장하도록 만들 수 있을까요? <br>
Shared Worker라는 개념이 있다는데… Shared Worker를 이용하면 사용자의 방 입장 여부를 저장해서 해결할 수 있지 않을까요? <br>
Shared Worker에서 방 입장 여부는 어떻게 관리할 수 있을까요? <br><br>
[👉 방 중복 입장 막기 우당탕탕 개발 과정](https://www.notion.so/dcb514d3a83c4266bd28e6ad641c712d?pvs=21)

### [BE] Socket.IO의 ‘Room’과 프로젝트의 ‘Room’ 개념을 어떻게 일치시킬 수 있었을까?

> Socket.IO의 ‘Room’은 간단한 string 타입입니다. <br>
그러나 프로젝트의 ‘Room’에는 필요한 메타데이터가 굉장히 많았습니다. <br>
이러한 차이를 어떻게 해결했을까요? <br><br>
[👉 Socket.IO의 Room과 프로젝트 방 개념의 통합](https://www.notion.so/Socket-IO-Room-1504a6a7b6f880da9028d6fed40ff094?pvs=21)


### [BE] 공유를 위한 상태 관리는 어떻게 관리할 것인가?

> 모든 키워드 입력이 끝나고 나면, 사용자들은 이미지나 유튜브 영상을 공유할 수 있습니다. <br>
해당 공유 상태를 어떻게 관리해야 할까요? <br>
또한 공유자가 방을 나간다면, 이를 어떻게 처리하는 게 가장 안전할까요? <br><br>
[👉 공유 상태 관리와 동시성 문제 해결](https://www.notion.so/1504a6a7b6f880e4afb2c4ff34d26bff?pvs=21)

<br>

## 🧩 시스템 아키텍처

<div align=center>
  <img width="670" alt="image" src="https://github.com/user-attachments/assets/e15ec6fa-efaa-4a04-92e3-c2d840f6dc82">
</div>

<br>

## ⚙️ 기술 스택

<table align=center>
    <thead>
        <tr>
            <th>분류</th>
            <th>기술 스택</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <p align=center>Common</p>
            </td>
            <td>
                <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=ffffff">
                <img src="https://img.shields.io/badge/Socket.io-010101?logo=socketdotio">
                <img src="https://img.shields.io/badge/.ENV-ECD53F?logo=.ENV&logoColor=ffffff">
            </td>
        </tr>
        <tr>
            <td>
                  <p align=center>Frontend</p>
            </td>
            <td>
                <img src="https://img.shields.io/badge/Vite-646CFF?logo=Vite&logoColor=ffffff">
                <img src="https://img.shields.io/badge/ESLint-4B32C3?logo=eslint&logoColor=ffffff">
                <img src="https://img.shields.io/badge/React-61DAFB?logo=React&logoColor=ffffff">
                <img src="https://img.shields.io/badge/Emotion-D36AC2?logo=react&logoColor=ffffff">
                <img src="https://img.shields.io/badge/Zustand-443E38?logo=react&logoColor=ffffff">
            </td>
        </tr>
        <tr>
            <td>
                <p align=center>Backend</p>
            </td>
            <td>
                <img src="https://img.shields.io/badge/Node.js-114411?logo=node.js">
                <img src="https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=ffffff">
            </td>
        </tr>
        <tr>
            <td>
                <p align=center>Deployment</p>
            </td>
            <td>
                <img src="https://img.shields.io/badge/nginx-014532?logo=Nginx&logoColor=009639&">
                <img src="https://img.shields.io/badge/Naver Cloud Platform-03C75A?logo=naver&logoColor=ffffff">  
            </td>
        </tr>
        <tr>
            <td>
                <p align=center>Collaboration</p>
            </td>
            <td>
                <img src="https://img.shields.io/badge/Notion-000000?logo=Notion">
                <img src="https://img.shields.io/badge/Figma-F24E1E?logo=Figma&logoColor=ffffff">
                <img src="https://img.shields.io/badge/Slack-4A154B?logo=Slack&logoColor=ffffff">
                <img src="https://img.shields.io/badge/Gather-4358D8?logo&logoColor=ffffff">
            </td>
        </tr>
    </tbody>
</table>

<br>

## 🫶🏻 팀 소개

<table align="center">
  <tr>
    <th><a href="https://github.com/eora21">김주호</a></th>
    <th><a href="https://github.com/ejm111333">이종민</a></th>
    <th><a href="https://github.com/23YUJIN">신유진</a></th>
    <th><a href="https://github.com/awaaaake">조윤희</a></th>
    <th><a href="https://github.com/minsuhan1">한민수</a></th>
  </tr>
  <tr>
    <td><img src="https://avatars.githubusercontent.com/u/61442066?v=4" width="120" height="120"></td>
    <td><img src="https://avatars.githubusercontent.com/u/66450798?v=4" width="120" height="120"></td>
    <td><img src="https://avatars.githubusercontent.com/u/50360362?v=4" width="120" height="120"></td>
    <td><img src="https://avatars.githubusercontent.com/u/103404308?v=4" width="120" height="120"></td>
    <td><img src="https://avatars.githubusercontent.com/u/50696567?v=4" width="120" height="120"></td>
  </tr>
  <tr align="center">
    <td>Backend</td>
    <td>Backend</td>
    <td>Frontend</td>
    <td>Frontend</td>
    <td>Frontend</td>
  </tr>
</table>
