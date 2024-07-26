# 지출 캘린더

## 프로젝트 개요
**지출 캘린더**는 사용자가 일일 지출을 효과적으로 관리하고 시각적으로 확인할 수 있는 웹 애플리케이션입니다. FullCalendar 라이브러리를 활용하여 달력에서 직접 지출 내역을 기록하고, 수정 및 삭제할 수 있는 기능을 제공합니다. 또한, 데이터를 JSON 파일 형식으로 저장하고 불러올 수 있습니다.

## 프로젝트 개발 기간
2024/07/26 ~ 개발중

## 기능 설명

### **지출 기록 및 관리**
- **달력 기반 지출 기록**: 사용자가 특정 날짜를 클릭하여 지출 내역을 추가할 수 있습니다.
- **총 지출 금액 표시**: 달력의 날짜 칸에 지출 총액을 표시하여 빠르게 지출 현황을 파악할 수 있습니다.

### **지출 내역 수정 및 삭제**
- **내역 수정**: 기존의 지출 내역을 선택하여 카테고리와 금액을 수정할 수 있습니다.
- **내역 삭제**: 지출 내역을 삭제하여 불필요한 기록을 관리할 수 있습니다.

### **데이터 저장 및 불러오기**
- **JSON 파일로 저장**: 사용자의 지출 데이터를 JSON 파일로 저장하여 로컬에 안전하게 보관할 수 있습니다.
- **JSON 파일 불러오기**: 저장된 JSON 파일을 불러와서 지출 기록을 복원할 수 있습니다.

### **초기 화면**
- **초기 상태**: 지출 기록이 없는 경우 초기 화면을 표시하여 사용자가 지출 기록을 추가하도록 안내합니다.

### **사용자 인터페이스**
- **지출 추가 폼**: 날짜, 카테고리, 금액을 입력하여 지출을 추가할 수 있는 폼을 제공합니다.
- **지출 내역 상세보기**: 선택한 날짜의 모든 지출 내역을 보여주며, 각 내역을 클릭하여 수정하거나 삭제할 수 있습니다.
- **수정 및 삭제 폼**: 지출 내역을 수정하거나 삭제할 수 있는 폼을 제공합니다.

## 향후 추가하면 좋을 내용들
- **캘린더로써 기능**: 지출 계획이나 기록만 남기는 것이 아니라 당일에 무슨 일을 했는지, 할 건지 등 캘린더로써의 기능도 추가하면 좋겠다.
- **지출 총액 확인**: 주별, 월별 지출 총액을 볼 수 있게 할 계획.
- **지출 기록 색 변경**: 지출 기록의 색상을 변경할 수 있게 하면 좋겠다.
- **카테고리 일반화**: 지출의 카테고리가 일정해야 나중에 정렬을 구현하는 데에도 편할 것이고, 사용자로 하여금 카테고리(ex작명과 같은) 고민을 줄일 수 있다.
- **리마인더 기능**: 특정 지출 금액 초과 시 알림을 설정하는 기능을 추가할 계획.
- **정렬 기능**: 지출 내역을 카테고리별로 오름차순 또는 내림차순으로 정렬할 수 있는 기능을 추가할 예정.

- 모바일에서도 이용가능하지만 json 파일의 경로를 찾기 힘들것 같다.