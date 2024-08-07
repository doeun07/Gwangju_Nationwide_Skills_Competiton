// Festivals json 불러오기
async function fetchFestivalsData() {
  const response = await fetch("../선수제공파일/json/festivals.json");
  const data = await response.json();
  return data;
}

// 축제 데이터를 가져오고 정렬하여 상위 5개 축제의 정보를 HTML 카드로 표시하는 함수
async function getTop5Festivals() {
  // 데이터 가져오기
  const data = await fetchFestivalsData();

  // 'like' 속성으로 내림차순 정렬
  data.sort((a, b) => b.like - a.like);

  // 상위 5개 축제 추출
  const top5Festivals = data.slice(0, 5);

  // 축제 정보를 HTML 카드로 생성
  const container = document.querySelector("#festivals-container"); // 축제 정보를 삽입할 컨테이너 요소

  container.innerHTML = ""; // 컨테이너 초기화

  top5Festivals.forEach((festival) => {
    // 카드 HTML 생성
    const cardHTML = `
            <div class="card" style="width:21rem; margin-bottom: 1rem;">
                <img src="./선수제공파일/images/${festival.photo}" class="card-img-top" alt="${festival.title}" />
                <div class="card-body">
                    <h5 class="card-title">${festival.title}</h5>
                    <p class="card-text">축제 기간 : ${festival.startdate} ~ ${festival.enddate}</p>
                    <p class="card-text">장소 : ${festival.place}</p>
                    <p class="card-text">좋아요 수 : ${festival.like}</p>
                    <button onclick="bestFestival(${festival.id})" class="btn btn-primary">더보기</button>
                </div>
            </div>
        `;
    // 컨테이너에 카드 추가
    container.innerHTML += cardHTML;
  });
}


async function bestFestival(id) {
    const festivalData = await fetchFestivalsData();
    
    const festival = festivalData.find((f) => f.id === id);
    let bestTitle = document.querySelector("#bestTitle").innerText = `${festival.title}`;
    let bestPhoto = document.querySelector("#bestPhoto").src = `./선수제공파일/images/${festival.photo}`;
    let bestStartEndDate = document.querySelector("#bestStartEndDate").innerText = `${festival.startdate} ~ ${festival.enddate}`;
    let bestPlace = document.querySelector("#bestPlace").innerText = `${festival.place}`;
    let bestOrganization = document.querySelector("#bestOrganization").innerText = `${festival.organization}`;
    let bestGovernment = document.querySelector("#bestGovernment").innerText = `${festival.government}`;
    let bestDepartment = document.querySelector("#bestDepartment").innerText = `${festival.department}`;
    let bestPosition = document.querySelector("#bestPosition").innerText = `${festival.position}`;
    let bestStaff = document.querySelector("#bestStaff").innerText = `${festival.staff}`;
    let bestTel = document.querySelector("#bestTel").innerText = `${festival.tel}`;
    let visitor_native = document.querySelector("#visitor_native").innerText = `${festival.visitor_native_2023.toLocaleString()}명`;
    let visitor_foreigner = document.querySelector("#visitor_foreigner").innerText = `${festival.visitor_foreigner_2023.toLocaleString()}명`;
    let visitor_total = document.querySelector("#visitor_total").innerText = `${festival.visitor_total_2023.toLocaleString()}명`;
    
  $("#bestFestivalModal").modal("show");
}
