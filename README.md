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


<br>

## 📄 목차
<!-- TOC start (generated with https://github.com/derlin/bitdowntoc) -->

- [✨ 프로젝트 소개](#-)
- [🚀 주요 기능](#--1)
   * [🙋‍♀️ 가벼운 아이스브레이킹 질문들에 실시간으로 답변하며 서로의 관심사를 파악해 보세요](#--2)
   * [💫 우리 팀에서 이야기 나누면 좋을만한 공통 관심사를 확인할 수 있어요](#--3)
   * [🔃 서로의 관심사를 파악했다면 다함께 다양한 컨텐츠들을 실시간으로 공유하며 친해져봐요!](#--4)
- [🗺️ 프로젝트 플로우](#--5)
- [🌈 기술적 도전 및 문제 해결 과정](#--6)
   * [1️⃣ 어떻게 해야 참여자들이 실시간으로 데이터를 주고 받을 수 있을까요?](#1-)
      + [[BE] 사용자들이 모여서 소통을 나누는 ‘방’은 어떻게 구축 가능했을까요?](#be-)
   * [2️⃣ 어떻게 해야 다같이 모여 함께하고 있음을 사용자에게 인지시킬 수 있을까요?](#2-)
      + [[FE] 참여자들을 타원형으로 배치하는 UI 구현하기](#fe-ui-)
      + [[FE] 실시간 키워드들을 워드 클라우드 UI로 표현하기](#fe-ui--1)
      + [[FE] 유튜브 영상을 어떻게 동기화할 수 있을까요?](#fe-)
      + [[BE] 공유를 위한 상태 관리는 어떻게 제어해야 할까요?](#be--1)
   * [3️⃣ 완성도를 높이기 위한 추가적인 도전들](#3-)
      + [[FE] 통계 결과 소켓 알림 타이밍 제어 및 웹워커를 사용한 타이머 동기화](#fe--1)
      + [[FE] 사용자가 한 번에 하나의 방에만 입장하게 하고 싶어요!](#fe--2)
      + [[FE] 리팩토링과 최적화, 그리고 성능 개선하기](#fe--3)
      + [[BE] FE CI/CD 파이프라인 구축하기](#be--2)
      + [[BE] Let’s Encrypt 이용하여 HTTPS 적용하기](#be--3)
- [🧩 시스템 아키텍처](#--7)
- [⚙️ 기술 스택](#--8)
- [🫶🏻 팀 소개](#--9)

<!-- TOC end -->

<br>

<!-- TOC --><a name="-"></a>
## ✨ 프로젝트 소개
새로운 사람을 만날 때 어색했던 경험, 다들 한 번쯤은 있으셨죠? 저희 **다할수있조**도 프로젝트를 시작하며 비슷한 경험을 했어요. 이런 어색한 분위기를 바꿀 수 있는 열쇠가 뭘까 고민한 끝에, 답은 '**공통된 관심사**'라는 것을 깨달았답니다. <br><br>
이 경험을 바탕으로 기획한 **친해지길**은 처음 만나는 사람들로 구성된 팀이 자연스럽게 친밀감을 쌓을 수 있도록 돕는 '**온라인 아이스브레이킹 플랫폼**'입니다.<br>
**친해지길**에서는 팀원들이 실시간으로 다양한 질문에 답변 키워드를 입력하며 서로의 취향과 관심사를 알아갑니다. <br>
또한, 관련된 콘텐츠를 공유하며 빠르게 공감대를 형성할 수 있도록 설계했어요.<br><br>
이제 **친해지길**과 함께, 어색함을 깨고 진짜 소통을 시작해보세요!

<br>
 
<!-- TOC --><a name="--1"></a>
## 🚀 주요 기능

<!-- TOC --><a name="--2"></a>
### 🙋‍♀️ 가벼운 아이스브레이킹 질문들에 실시간으로 답변하며 서로의 관심사를 파악해 보세요

> 여러 명이 입력했거나, 많은 공감을 받은 답변들을 한눈에 파악할 수 있는 워드 클라우드 UI를 제공해요

![키워드표시](https://github.com/user-attachments/assets/cfce2002-a8c4-4392-9260-00c2da37402f)

<!-- TOC --><a name="--3"></a>
### 💫 우리 팀에서 이야기 나누면 좋을만한 공통 관심사를 확인할 수 있어요

> 모든 아이스브레이킹 질문이 끝나면, 개개인의 답변들 중 공감을 많이 받은 항목들을 표시하고, 팀에서 함께 나누면 좋을만한 공통 관심사를 분석해서 제안해 드려요

![통계](https://github.com/user-attachments/assets/ef008e74-3a98-4e39-93c7-3f71136d9932)


<!-- TOC --><a name="--4"></a>
### 🔃 서로의 관심사를 파악했다면 다함께 다양한 컨텐츠들을 실시간으로 공유하며 친해져봐요!

> 우리 팀이 다같이 즐길 수 있는 것도, 내가 추천하고 싶은 것도 좋아요. 이미지 또는 유튜브 컨텐츠를 공유할 수 있어요.

![컨텐츠 공유](https://github.com/user-attachments/assets/b3c6fc64-a950-49e6-aef7-9b691e2ce3b1)
![컨텐츠 공유 2](https://github.com/user-attachments/assets/6dc6a82d-7c0a-4fea-bf17-8f2060605113)

<br>

<!-- TOC --><a name="--5"></a>
## 🗺️ 프로젝트 플로우

![image](https://github.com/user-attachments/assets/958b87aa-5f37-4d6e-8032-79b3e5811172)

<br>

<!-- TOC --><a name="--6"></a>
## **🌈 기술적 도전 및 문제 해결 과정**

저희는 짧은 시간 내로 친해질 수 있는 아이스브레이킹 서비스를 만들고 싶었어요. 이를 위해 저희가 고려한 핵심 가치는 무엇일까요?

<!-- TOC --><a name="1-"></a>
### 1️⃣ 어떻게 해야 참여자들이 실시간으로 데이터를 주고 받을 수 있을까요?

첫 번째 가치는 “실시간성”이에요. 여러 명이 친해지기 위해서는 실시간으로 함께할 수 있어야 해요. 실시간으로 여러 명이 데이터를 주고 받을 수 있도록 아래와 같은 과정을 거쳤어요.

<!-- TOC --><a name="be-"></a>
#### **[BE] 사용자들이 모여서 소통을 나누는 ‘방’은 어떻게 구축 가능했을까요?**

> 사용자들의 실시간 데이터 전달을 위해 Nest.js의 Gateway와 Socket.IO를 사용해보기로 했어요.<br>
하지만 Socket.IO에서 제시한 ‘Room’의 개념과 프로젝트에서 구성할 ‘방’의 개념은 너무나도 달랐어요. Socket.io의 Room을 통해서는 방의 호스트, 페이즈, 키워드 목록 등을 기록할 수 없는 구조였기 때문이에요.<br>
이러한 차이를 어떻게 해결할 수 있었을까요?<br><br>
[👉 [Nest.js] Gateway 효율적으로 사용하기 - socket.io의 방 개념 도입](https://www.notion.so/Nest-js-Gateway-socket-io-1424a6a7b6f88071b27bee15b6f62ae2?pvs=21)

<br>

<!-- TOC --><a name="2-"></a>
### 2️⃣ 어떻게 해야 다같이 모여 함께하고 있음을 사용자에게 인지시킬 수 있을까요?

두 번째 가치는 사용자들이 서비스를 사용하면서, 마치 함께 모여서 재미있는 게임을 하면서 친해지고 있다는 느낌을 받게끔 하는 것이었어요.

그러한 목표를 달성하기 위해서는 서비스의 화면이 정적이면 좋지 않을 것 같아, UI/UX면에서 동적인 애니메이션과 인터랙션의 도입을 시도했어요

- **참여자들의 프로필을 타원형으로 배치**해 함께 모여 있다는 느낌을 강조했어요.
- 실시간으로 주고받는 관심사 키워드들이 추가되고 선택받는/공감받는 과정을 동적인 애니메이션으로 표현하기 위해 **워드 클라우드 UI**를 구현했어요
- 유튜브 영상을 공유한 사람의 화면과, 다른 참여자들에게 보여지는 화면을 **동기화**하여 동시에 같은 컨텐츠를 보며 친해질 수 있게끔 만들었어요

<!-- TOC --><a name="fe-ui-"></a>
#### **[FE] 참여자들을 타원형으로 배치하는 UI 구현하기**

> 실시간으로 입장하는 참여자들을 어떤 방식으로 원활하게 배치할 수 있을까요?<br>
타원형 배치를 구현하기위해 극좌표게를 사용하여 각 참여자의 위치를 수학적으로 계산했어요<br><br>
[👉사용자 배치 로직 구현하기](https://www.notion.so/4f6c1ed8d1d04938808add6f0009a2de?pvs=21)

<!-- TOC --><a name="fe-ui--1"></a>
#### **[FE] 실시간 키워드들을 워드 클라우드 UI로 표현하기**

> 어떻게 키워드들을 서로 겹치지 않으면서, 선택된 횟수가 높을수록 중앙에 위치하도록 배치할지 막막했어요.<br>
별도의 라이브러리 활용도 고려해 보았지만 스타일링의 한계가 느껴져서, 직접 로직을 분석해보기로 했어요.<br>
워드 클라우드 관련 오픈소스를 분석하고 별도의 라이브러리 없이 구현한 과정을 소개합니다<br><br>
[👉 워드 클라우드 UI 구현을 위한 방향성 고민](https://www.notion.so/UI-f85d187089b34a2fa69756b9584e8621?pvs=21)<br>
[👉 jQCloud 라이브러리의 워드클라우드 UI 구현 로직 분석](https://www.notion.so/jQCloud-1-0-4-UI-1fe9ace4c951414a8fd9a519f0db051a?pvs=21)<br>
[👉 오픈소스를 참고하여 React에서 워드 클라우드 UI 구현하기](https://www.notion.so/React-UI-d37bce31d70448e1bbda70d882a7df53?pvs=21)

<!-- TOC --><a name="fe-"></a>
#### **[FE] 유튜브 영상을 어떻게 동기화할 수 있을까요?**

> 유튜브 영상을 각 사용자 화면에서 동기화하려면, 영상 흐름 조작 권한을 특정 인원에게만 줘야 해요.<br>
그런데, 유튜브 영상은 iframe으로 가져와요. iframe 내부 영상의 컨트롤러를 영상 흐름 조작만 막도록 커스텀할 수 있을까요?<br>
영상의 흐름과 프로그래스바는 setTimeout으로 동기화하는 게 좋을까요?<br>
유튜브 영상 흐름을 동기화할 때 차이는 어떻게 줄일 수 있을까요?<br><br>
[👉 유튜브 영상을 어떻게 가져올 수 있을까](https://www.notion.so/adc3df31fe8c461a8ce484933428866c?pvs=21)<br>
[👉 유튜브 클라이언트끼리 동기화 개발하기 일지](https://www.notion.so/5aa21774a2df485e8d61f6469dcdd884?pvs=21)<br>
[👉 커스텀 비디오 컨트롤러 개발하기](https://www.notion.so/80ea82a941834fe6a8452f612600f89d?pvs=21)<br>

<!-- TOC --><a name="be--1"></a>
#### **[BE] 공유를 위한 상태 관리는 어떻게 제어해야 할까요?**

> 사용자들의 이미지, 유튜브 영상을 어떠한 방식으로 제공해야 효율적인 관리가 가능할까요?<br>
공유자가 방을 나가거나 강제 종료되는 경우, 이를 어떻게 처리하는 게 가장 안전할까요?<br><br>
[👉 공유 상태 관리와 동시성 문제 해결](https://www.notion.so/1504a6a7b6f880e4afb2c4ff34d26bff?pvs=21)

<br>

<!-- TOC --><a name="3-"></a>
### 3️⃣ 완성도를 높이기 위한 추가적인 도전들

서비스의 가치 차원 이외에도 완성도를 높이기 위해 고려해야할 점들은 추가로 존재했어요. 저희는 어떤 점들을 고려하고 어떻게 결론을 내렸을까요?

<!-- TOC --><a name="fe--1"></a>
#### **[FE] 통계 결과 소켓 알림 타이밍 제어 및 웹워커를 사용한 타이머 동기화**

> 실시간 통계결과를 처리할 때, 소켓알림 이벤트 등록과 해제는 어디서 이루어질까요?<br>
브라우저 탭 비활성화 시 타이머의 정확도가 떨어지는 문제는 어떻게 해결할까요?<br>
웹워커의 도입 이유와 타이머 동기화문제, 그리고 소켓이벤트 리스너 등록 타이밍 문제를 해결하는 방법입니다<br><br>
[👉 소켓이벤트 알림 타이밍 제어, Web Worker를 사용한 타이머 구현](https://www.notion.so/c987e9af0b414550a2bccf6820fbc450?pvs=21)<br>

<!-- TOC --><a name="fe--2"></a>
#### **[FE] 사용자가 한 번에 하나의 방에만 입장하게 하고 싶어요!**

> 사용자가 중복 입장할 수 있다면 어떤 문제가 발생할까요?<br>
> 탭마다 독립적인 브라우징 컨텍스트를 가지는데, 어떻게 한 번에 하나의 방에 입장하도록 만들 수 있을까요?<br>
> Shared Worker라는 개념이 있다는데… Shared Worker를 이용하면 사용자의 방 입장 여부를 저장해서 해결할 수 있지 않을까요?<br>
> Shared Worker에서 방 입장 여부는 어떻게 관리할 수 있을까요?<br><br>
> [👉 방 중복 입장 막기 우당탕탕 개발 과정](https://www.notion.so/dcb514d3a83c4266bd28e6ad641c712d?pvs=21)

<!-- TOC --><a name="fe--3"></a>
#### **[FE] 리팩토링과 최적화, 그리고 성능 개선하기**

> 동적인 인터페이스가 많은 서비스인 만큼 최적화와 성능 개선도 빠뜨릴 수 없죠<br>
> React Profiler를 활용하여 불필요하게 자주 리렌더링되는 컴포넌트를 찾아 최적화한 과정과,<br>
> 워드 클라우드 UI를 그릴 때 발생하는 reflow 횟수를 줄여서 성능을 개선한 과정을 소개합니다<br><br>
> [👉 FE 코드 리팩토링 및 최적화, 성능 개선 과정](https://lime-mall-d34.notion.site/FE-cc705396b35a49189bb5a56bd6459c85?pvs=4)

<!-- TOC --><a name="be--2"></a>
#### **[BE] FE CI/CD 파이프라인 구축하기**

> CI/CD 파이프라인을 어떤 방식으로 설계하고 구성해야 할까요?<br>
> FE 코드를 배포할 때, 어떤 절차와 도구를 활용해야 할까요?<br>
> 배포된 파일을 어디에 저장하고, 어떻게 제공해야 할까요?<br><br>
> [👉 FE CI/CD 구축하기](https://lime-mall-d34.notion.site/FE-CI-CD-068a37fd8f2d48359c1fdee8c9e1a794?pvs=4)

<!-- TOC --><a name="be--3"></a>
#### **[BE] Let’s Encrypt 이용하여 HTTPS 적용하기**

> Let’s Encrypt를 사용하여 HTTPS를 연결하면 어떤점이 좋을까요?<br>
> HTTPS 적용을 어떻게 해야할까요?<br>
> 인증서 발급 후, 관련 파일을 어디에 저장하고, 어떻게 보안을 강화할 수 있을까요?<br><br>
> [👉 Let’s Encrypt 이용하여 HTTPS 적용하기](https://lime-mall-d34.notion.site/HTTPS-2c3b152d00424993b26619d54a833f84?pvs=4)

<br>

<!-- TOC --><a name="--7"></a>
## 🧩 시스템 아키텍처

### 현재 아키텍처

<div align=center>
  <img width="670" alt="image" src="https://github.com/user-attachments/assets/3820a63a-1703-4328-a3db-7b2158f9684e">
</div>

<br>

### 개선 예정 아키텍처

<div align=center>
  <img width="670" alt="image" src="https://github.com/user-attachments/assets/e15ec6fa-efaa-4a04-92e3-c2d840f6dc82">
</div>

<br>

<!-- TOC --><a name="--8"></a>
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
                <img src="https://img.shields.io/badge/ESLint-4B32C3?logo=eslint&logoColor=ffffff">
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
              <img src="https://img.shields.io/badge/Redis-FF4438?logo=redis&logoColor=ffffff">
            </td>
        </tr>
        <tr>
            <td>
                <p align=center>Deployment</p>
            </td>
            <td>
                <img src="https://img.shields.io/badge/nginx-014532?logo=Nginx&logoColor=009639&">
                <img src="https://img.shields.io/badge/PM2-2B037A?logo=pm2&logoColor=ffffff&">
                <img src="https://img.shields.io/badge/Github Actions-2088FF?logo=githubactions&logoColor=ffffff&">
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

<!-- TOC --><a name="--9"></a>
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
