# Cafe Masters (Ver 2 - 2025.3.30 Released)

![썸네일](https://github.com/user-attachments/assets/e042eb80-164e-4031-ba76-b3c129eea431)

## 목차

- [🔗 접속 링크](#🔗-접속-링크)
- [✅ 스택](#✅-스택)
- [🕹️ 기능 소개](#🕹️-기능-소개)
- [🧱 아키텍처](#🧱-아키텍처)
- [🌱 업데이트 예정](#🌱-업데이트-예정)

### 앱 소개

카페 마스터즈는 카페를 많이 모아 마스터가 되는 세계입니다. <br />
여러분이 방문했던 카페를 카드로 수집하면 됩니다. <br />
카드를 수집할 때마다 티어가 올라가니, 많이 모아 마스터가 되어보세요-v-

## 🔗 접속 링크

https://app.cafe-masters.co

## ✅ 스택

<div style='display:flex; align-items:center'>
    <img src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=Next.js&logoColor=white"> 
    <img src="https://img.shields.io/badge/React.js-61DAFB?style=flat-square&logo=React&logoColor=black">
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white">
</div>
<div style='display:flex; align-items:center'>
    <img src="https://img.shields.io/badge/React Query-FF4154?style=flat-square&logo=reactquery&logoColor=white">
    <img src="https://img.shields.io/badge/Zustand-4a2c2a?style=flat-square&logo=zustand&logoColor=white">
</div>
<div style='display:flex; align-items:center'>
    <img src="https://img.shields.io/badge/tailwindcss-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white">
    <img src="https://img.shields.io/badge/MUI-007FFF?style=flat-square&logo=mui&logoColor=white">
</div>
<div style='display:flex; align-items:center'>
    <img src="https://img.shields.io/badge/Supabase-3FCF8E?style=flat-square&logo=supabase&logoColor=white">
</div>
<div style='display:flex; align-items:center'>
    <img src="https://img.shields.io/badge/ESLint-4B32C3?style=flat-square&logo=eslint&logoColor=white">
</div>
<div style='display:flex; align-items:center'>
    <img src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white"> 
</div>

## 🕹️ 기능 소개

### 1. 로그인 / 회원가입 / 비밀번호 재설정


<img src='https://github.com/user-attachments/assets/b3591dc5-954d-459e-960c-d4a18b4b013d' width='500' height='360'>

카페 마스터즈를 이용하기 위해서는 먼저 로그인을 해야합니다.<br/>
이메일로 생성하거나 카카오 계정으로 회원가입 하시면 됩니다.<br/>


<img src='https://github.com/user-attachments/assets/3a50583b-d428-4051-9c4a-3264f0a1afb8' width='500' height='360'>

<img src='https://github.com/user-attachments/assets/bf6574fd-1880-4b8e-8129-28be2ae484a8' width='500' height='270'>

이메일로 가입시 연결할 이메일과 계정 로그인시 사용할 비밀번호를 입력하고 회원가입 버튼을 눌러주세요.<br/>
해당 이메일로 발송된 인증번호 6자리를 확인한 뒤 돌아와 입력해주세요.<br/>
회원가입이 정상적으로 이루어지면 자동으로 로그인 됩니다.<br/>

<img src='https://github.com/user-attachments/assets/d4837349-4b2f-44df-a6c9-a528f813effd' width='500' height='360'>

혹시 비밀번호를 깜빡하셨나요? 걱정하지 않으셔도 됩니다😄<br/>
계정의 이메일을 입력하고 재설정하기를 누르면, 이메일로 비밀번호 재설정 링크가 담긴 메일이 전송됩니다.<br/>
전송된 링크를 클릭하면 비밀번호를 입력할 수 있는 탭이 열립니다.<br/>

### 2. 모든 카페 보기

![로그인 후 초기 화면](https://github.com/user-attachments/assets/812e094f-435e-4537-8df3-ea7ac057eb64)

로그인을 하고 난 후 보게 되는 페이지입니다.


<img src='https://github.com/user-attachments/assets/c55fd9bf-a204-40d7-858d-01e96380cb46' width='500' height='360'>
<img src='https://github.com/user-attachments/assets/afe495db-f82d-46b0-8474-8a3d60e4691f' width='500' height='300'>

원하는 카페를 찾으시나요? 카페의 이름을 검색해보세요.<br/>
특정 카페가 아닌, 지역만 검색해도 안의 카페를 찾을 수 있어요.<br/>
썸네일 이미지를 클릭하면 카카오 플레이스에서 제공하는 페이지로 이동할 수 있어요.<br/>


<img src="https://github.com/user-attachments/assets/dcf79bf5-e42c-4d55-97d7-9101310e31a2" width="500" height="400" />

나중에 가고 싶은 카페라면 북마크 해두세요.<br/>

<img src="https://github.com/user-attachments/assets/9bc0d755-8374-4b7c-87fd-2f98a86b5419" width="400" height="600" />

카페를 갔다오셨나요? 당신의 카드로 수집할 차례입니다!<br/>
별점을 매겨주시면 별점에 따라 카드의 등급이 적용됩니다.<br/>
(1-2점: 언더 카드 / 3-4점: 실버 카드 / 5점: 골드 카드)<br/>

### 3. 수집한 카드 보기

<img src="https://github.com/user-attachments/assets/8da4deca-c105-4055-beb3-344075a0a042" width="400" height="600" />

내가 여태 수집한 카드를 볼 수 있어요.<br/>
수집한 카드는 설명했던 것처럼 등급에 따라 컬러가 달라요.<br/>

<img src="https://github.com/user-attachments/assets/1b8cfc57-2658-4837-8213-431b21437b45" width="400" height="600" />

수집하면서 저장했던 메모의 내용이 담겨있으니, 필요할 때 기억해내기 좋겠죠?<br/>

<img src="https://github.com/user-attachments/assets/aeea5e50-1897-4c8f-b370-044753869e31" width="250" height="180" />

혹시 히든 카드를 찾으셨나요..? 히든 카드를 수집하고 개발자에게 인증하시면 기프티콘을 드립니다!<br/>
히든 카드는 카페 이름 오른쪽에 'HIDDEN' 라벨이 표시되어있습니다:)

### 4. 가고 싶은 카페 보기

<img src="https://github.com/user-attachments/assets/d959326d-c9aa-46ad-83b5-778afe2b0fb0" width="340" height="600" />

북마크 해뒀던 카페를 확인할 수 있어요.<br/>
만약 마음이 바뀌어서 가고싶지 않아지면 삭제하시면 됩니다.<br/>
여기서도 물론 카드를 수집할 수 있습니다!

### 5. 추천 카페

<img src="https://github.com/user-attachments/assets/22fe6775-9fd1-4dea-8500-3187bde29ea1" width="340" height="650" />


개발자가 특별히 추천하는 카페입니다! 방문했던 곳 위주로 업로드합니다.<br/>
각 카페에는 카테고리가 부여되어있어요.<br/>
필터링을 사용해서 원하는 카테고리에 해당하는 카페를 구경해보세요.<br/>

### 6. 티어 시스템

<img src="https://github.com/user-attachments/assets/839057fd-872b-4951-9cc0-5b7cb0969e5d" width="600" height="400" />

티어는 여러분이 모은 카드의 수에 따라 달라져요.<br/>
마스터가 되고 싶지 않으신가요??<br/>
서버 최초의 마스터에게는 개발자의 선물이 기다리고 있으니 마스터가 되어보세요!<br/>

## 🧱 아키텍처

<img src="https://github.com/user-attachments/assets/985b0c24-343f-422b-b013-f717f591c6d9" width="600" height="340" />

확장성과 효율성을 모두 갖춘 풀스택 아키텍처입니다.<br/>
서버와 클라이언트간 책임 분담과 효율적인 상태 관리를 추구했습니다.<br/>
TypeScript와 ESLint가 주는 타입 안정성을 기반으로 DB의 GET, POST 요청을 안전하게 처리하며,<br/>
예상 가능한 흐름과 유지보수가 쉬운 구조를 지향했습니다.