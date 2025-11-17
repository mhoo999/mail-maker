# Mail Maker

HTML 이메일을 쉽고 빠르게 만드는 비주얼 빌더

## 소개

Mail Maker는 운영팀이 복잡한 HTML 코드 없이도 전문적인 이메일 템플릿을 쉽게 제작할 수 있도록 도와주는 서비스입니다. 드래그 앤 드롭 방식의 직관적인 인터페이스로 누구나 간편하게 사용할 수 있습니다.

## 주요 기능

### 블록 기반 편집
13가지 다양한 블록 타입을 제공하여 원하는 이메일을 자유롭게 구성할 수 있습니다.

- **Header** - 로고와 배지
- **Title** - 제목 (H1, H2)
- **Text** - 본문 텍스트
- **List** - 불릿/숫자 리스트
- **Badge** - 컬러 배지 (빨강, 주황, 파랑, 초록)
- **Button** - 링크 버튼
- **Image** - 이미지
- **Highlight** - 강조 박스 (정보, 경고, 성공, 에러)
- **Stats** - 통계 카드
- **InfoTable** - 정보 테이블
- **Divider** - 구분선
- **Spacer** - 간격 조절
- **Footer** - 푸터

### 드래그 앤 드롭
블록을 자유롭게 드래그하여 순서를 변경할 수 있습니다.

### 실시간 미리보기
편집 중인 내용을 실시간으로 확인할 수 있습니다.

### HTML 코드 생성
작성한 이메일을 이메일 클라이언트 호환 HTML 코드로 즉시 변환하여 복사할 수 있습니다.

### 템플릿 저장
자주 사용하는 레이아웃을 템플릿으로 저장하고 재사용할 수 있습니다.
- 기본 템플릿: 공지 메일, 프로모션 메일, 뉴스레터
- 사용자 정의 템플릿: localStorage에 저장

## 기술 스택

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Toss Design System)
- **Drag & Drop**: @dnd-kit
- **Icons**: Lucide React

## 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

http://localhost:3000 에서 확인할 수 있습니다.

### 빌드

```bash
npm run build
```

## 사용 방법

1. **템플릿 선택** - 기본 템플릿을 선택하거나 빈 페이지에서 시작
2. **블록 추가** - 왼쪽 패널에서 원하는 블록 타입 선택
3. **내용 편집** - 각 블록의 내용을 입력하고 수정
4. **순서 조정** - 드래그 앤 드롭으로 블록 순서 변경
5. **미리보기** - 오른쪽 패널에서 실시간 미리보기 확인
6. **HTML 복사** - 완성된 이메일의 HTML 코드를 복사하여 사용

## 라이선스

MIT

## Developer

- Email: famehoon@mz.co.kr
- GitHub: https://github.com/mhoo999
