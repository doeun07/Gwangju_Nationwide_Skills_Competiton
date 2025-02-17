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
  let bestTitle = (document.querySelector(
    "#bestTitle"
  ).innerText = `${festival.title}`);
  let bestPhoto = (document.querySelector(
    "#bestPhoto"
  ).src = `./선수제공파일/images/${festival.photo}`);
  let bestStartEndDate = (document.querySelector(
    "#bestStartEndDate"
  ).innerText = `${festival.startdate} ~ ${festival.enddate}`);
  let bestPlace = (document.querySelector(
    "#bestPlace"
  ).innerText = `${festival.place}`);
  let bestOrganization = (document.querySelector(
    "#bestOrganization"
  ).innerText = `${festival.organization}`);
  let bestGovernment = (document.querySelector(
    "#bestGovernment"
  ).innerText = `${festival.government}`);
  let bestDepartment = (document.querySelector(
    "#bestDepartment"
  ).innerText = `${festival.department}`);
  let bestPosition = (document.querySelector(
    "#bestPosition"
  ).innerText = `${festival.position}`);
  let bestStaff = (document.querySelector(
    "#bestStaff"
  ).innerText = `${festival.staff}`);
  let bestTel = (document.querySelector(
    "#bestTel"
  ).innerText = `${festival.tel}`);
  let visitor_native = (document.querySelector(
    "#visitor_native"
  ).innerText = `${festival.visitor_native_2023.toLocaleString()}명`);
  let visitor_foreigner = (document.querySelector(
    "#visitor_foreigner"
  ).innerText = `${festival.visitor_foreigner_2023.toLocaleString()}명`);
  let visitor_total = (document.querySelector(
    "#visitor_total"
  ).innerText = `${festival.visitor_total_2023.toLocaleString()}명`);

  $("#bestFestivalModal").modal("show");
}

// 축제 찾기 섹션 Option 추가
async function festivalFindOptionAdd() {
  const festivalData = await fetchFestivalsData();

  let sidoArr = [];

  festivalData.forEach((festival) => {
    festival.sido = festival.sido.replace(" ", "");
    if (sidoArr.includes(festival.sido) == false) {
      sidoArr.push(festival.sido);
      $("#sido").append(new Option(festival.sido, festival.sido));
    }
  });

  let gunguArr = [];

  festivalData.forEach((festival) => {
    if (festival.gungu) {
      festival.gungu = festival.gungu.replace(" ", "");
      if (gunguArr.includes(festival.gungu) == false) {
        gunguArr.push(festival.gungu);
        $("#gungu").append(new Option(festival.gungu, festival.gungu));
      }
    }
  });

  let typeArr = [];

  festivalData.forEach((festival) => {
    festival.type = festival.type.replace(" ", "");
    if (typeArr.includes(festival.type) == false) {
      typeArr.push(festival.type);
      $("#type").append(new Option(festival.type, festival.type));
    }
  });
}

// YYYY-MM-DD 형식으로 바꾸는 정규표현식
const regexStartDate = (target) => {
  target.value = target.value
    .replace(/[^0-9]/g, "")
    .replace(/^(\d{4})(\d{2})(\d{2})/, `$1-$2-$3`);
};

let currentPage = 1; // 현재 페이지
const itemsPerPage = 5; // 페이지당 항목 수
let festivalSearchResult = []; // 검색 결과를 저장할 배열

// 축제 찾기 섹션 검색 기능
async function festivalFindSearch() {
  const festivalData = await fetchFestivalsData();

  const sido = document.querySelector("#sido").value;
  const gungu = document.querySelector("#gungu").value;
  const type = document.querySelector("#type").value;
  const startDate = document.querySelector("#startDate").value;
  const festivalName = document.querySelector("#festivalName").value;

  festivalSearchResult = festivalData.filter(
    (item) =>
      (!sido || item.sido == sido) &&
      (!gungu || item.gungu == gungu) &&
      (!type || item.type == type) &&
      (!startDate || item.startdate == startDate) &&
      (!festivalName || item.title == festivalName)
  );

  currentPage = 1; // 검색 시 페이지를 처음으로 리셋
  renderSearchResults();
}

function renderSearchResults() {
  const search_result = document.querySelector("#search_result");

  // 검색 결과가 없으면
  if (festivalSearchResult.length === 0) {
    search_result.innerHTML = "<p>검색 결과가 없습니다.</p>";
    return;
  }
  let table = `<tr>
                      <th>광역자치단체명</th>
                      <th>기초자치단체명</th>
                      <th>축제명</th>
                      <th>축제유형</th>
                      <th>개최기간</th>
                      <th>더보기</th>
                  </tr>`;

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedItems = festivalSearchResult.slice(start, end);

  paginatedItems.forEach((item) => {
    table += `<tr>
                      <td>${item.sido}</td>
                      <td>${item.gungu}</td>
                      <td>${item.title}</td>
                      <td>${item.type}</td>
                      <td>${item.startdate} ~ ${item.enddate}</td>
                      <td><button onclick="bestFestival(${item.id})" type="button" class="btn btn-primary">더보기</button></td>
                  </tr>`;
  });

  search_result.innerHTML = table;
  updatePaginationButtons();
}

function updatePaginationButtons() {
  const totalPages = Math.ceil(festivalSearchResult.length / itemsPerPage);
  document.querySelector("#prevButton").disabled = currentPage === 1;
  document.querySelector("#nextButton").disabled = currentPage === totalPages;
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    renderSearchResults();
  }
}

function nextPage() {
  const totalPages = Math.ceil(festivalSearchResult.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderSearchResults();
  }
}

// HTML 버튼에 다음 및 이전 페이지 함수를 연결합니다.
document.querySelector("#prevButton").addEventListener("click", prevPage);
document.querySelector("#nextButton").addEventListener("click", nextPage);

// 지도로 검색 영역
document.addEventListener("DOMContentLoaded", function () {
  const regionSelect = document.getElementById("sido");
  const paths = document.querySelectorAll("svg path");
  let selectedPath = null; // 선택된 경로를 저장할 변수

  // 영어 이름을 한글 이름으로 매핑하는 객체
  const nameMapping = {
    Seoul: "서울",
    Busan: "부산",
    Daegu: "대구",
    Incheon: "인천",
    Gwangju: "광주",
    Daejeon: "대전",
    Ulsan: "울산",
    Sejong: "세종",
    Gyeonggi: "경기",
    Gangwon: "강원",
    "North Chungcheong": "충북",
    "South Chungcheong": "충남",
    "North Jeolla": "전북",
    "South Jeolla": "전남",
    "North Gyeongsang": "경북",
    "South Gyeongsang": "경남",
    Jeju: "제주",
  };

  // 각 path 요소에 대해 이벤트 리스너를 설정
  paths.forEach((path) => {
    const regionName = path.getAttribute("name");
    const koreanName = nameMapping[regionName] || regionName; // 매핑되지 않은 경우 원래 이름 사용

    // 호버 시 색상 변경을 위한 이벤트 리스너
    path.addEventListener("mouseenter", function () {
      if (selectedPath !== this) {
        this.style.fill = "#ffcc00";
      }
    });

    path.addEventListener("mouseleave", function () {
      if (selectedPath !== this) {
        this.style.fill = "#6f9c76";
      }
    });

    // 지역 클릭 시 select 박스의 value를 변경
    path.addEventListener("click", function () {
      if (selectedPath) {
        selectedPath.style.fill = "#6f9c76"; // 이전 선택된 경로의 색상을 기본 색상으로 변경
      }
      selectedPath = this;
      regionSelect.value = koreanName;
      this.style.fill = "#ff5733"; // 선택된 경로 강조 색상

      // select 박스에서 해당하는 option 선택
      const options = regionSelect.options;
      let optionFound = false;
      for (let i = 0; i < options.length; i++) {
        if (options[i].value === koreanName) {
          options[i].selected = true;
          optionFound = true;
          break;
        }
      }
    });
  });

  // select 박스에서 선택한 지역을 강조하는 기능
  regionSelect.addEventListener("change", function () {
    const selectedRegion = this.value;
    paths.forEach((path) => {
      const koreanName =
        nameMapping[path.getAttribute("name")] || path.getAttribute("name");
      if (koreanName === selectedRegion) {
        if (selectedPath) {
          selectedPath.style.fill = "#6f9c76"; // 이전 선택된 경로의 색상을 기본 색상으로 변경
        }
        selectedPath = path;
        path.style.fill = "#ff5733"; // 선택된 지역 강조 색상
      } else {
        path.style.fill = "#6f9c76"; // 기본 색상
      }
    });
  });
});

// 이달의 축제 달력
const calendarDates = document.getElementById("calendar-dates");
const monthYear = document.getElementById("month-year");
const prevMonthButton = document.getElementById("prev-month");
const nextMonthButton = document.getElementById("next-month");

let currentDate = new Date();

async function renderCalendar(date) {
  const eventsData = await fetchFestivalsData(); // 축제 데이터를 가져옴
  const eventsMap = {};

  // 주어진 이벤트 데이터를 기반으로 이벤트 매핑하기
  eventsData.forEach((event) => {
    const eventDate = event.startdate;
    if (!eventsMap[eventDate]) {
      eventsMap[eventDate] = [];
    }
    eventsMap[eventDate].push(event);
  });

  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const lastDateOfMonth = new Date(year, month + 1, 0).getDate();

  // Setting month and year in the header
  const monthNames = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
  ];
  monthYear.innerText = `${year}년 ${monthNames[month]}월`;

  // Clearing previous dates
  calendarDates.innerHTML = "";

  let dateCounter = 1;
  for (let i = 0; i < 6; i++) {
    // 최대 6주간 표현 가능
    const row = document.createElement("tr");

    for (let j = 0; j < 7; j++) {
      const cell = document.createElement("td");

      if (i === 0 && j < firstDayOfMonth) {
        cell.innerText = "";
      } else if (dateCounter > lastDateOfMonth) {
        cell.innerText = "";
      } else {
        // 날짜 표시
        const dateSpan = document.createElement("span");
        dateSpan.innerText = dateCounter;
        cell.appendChild(dateSpan); // 날짜를 먼저 추가

        // 현재 날짜 형식으로 변환
        const eventDate = `${year}-${String(month + 1).padStart(
          2,
          "0"
        )}-${String(dateCounter).padStart(2, "0")}`;

        // 날짜에 맞는 축제 제목 확인 및 추가
        if (eventsMap[eventDate]) {
          eventsMap[eventDate].forEach((event) => {
            const eventP = document.createElement("p");
            eventP.className = "title";
            eventP.innerText = event.title;
            eventP.style.cursor = "pointer"; // 클릭 가능한 커서로 변경
            eventP.addEventListener("click", () => bestFestival(event.id)); // 클릭 시 bestFestival(id) 실행
            cell.appendChild(eventP); // 제목을 날짜 아래에 추가
          });
        }

        dateCounter++;
      }

      row.appendChild(cell);
    }

    calendarDates.appendChild(row);
  }
}

function navigateMonth(offset) {
  currentDate.setMonth(currentDate.getMonth() + offset);
  renderCalendar(currentDate);
}

prevMonthButton.addEventListener("click", () => navigateMonth(-1));
nextMonthButton.addEventListener("click", () => navigateMonth(1));

renderCalendar(currentDate);

document.addEventListener("DOMContentLoaded", async () => {
  const eventsData = await fetchFestivalsData(); // 축제 데이터를 가져옴

  const upcomingEvents = getUpcomingEvents(eventsData, 5); // 다가오는 5개의 축제 정보를 가져옴
  populateCarousel(upcomingEvents); // 슬라이드에 추가

  // 슬라이드 자동 재생 설정
  const carousel = new bootstrap.Carousel(
    document.querySelector("#carouselExample"),
    {
      interval: 3000, // 3초마다 자동으로 슬라이드 넘김
      wrap: true, // 마지막 슬라이드 이후에 첫 번째 슬라이드로 돌아감
    }
  );
});

// 현재 날짜를 기준으로 다가오는 n개의 축제 정보를 반환하는 함수
function getUpcomingEvents(eventsData, n) {
  const today = new Date();
  return eventsData
    .filter((event) => new Date(event.enddate) >= today) // 오늘 이후에 끝나는 축제만 필터링
    .sort((a, b) => new Date(a.startdate) - new Date(b.startdate)) // 시작 날짜순 정렬
    .slice(0, n); // 상위 n개의 축제 선택
}

// 다가오는 축제 정보를 슬라이드에 추가하는 함수
function populateCarousel(events) {
  const carouselInner = document.querySelector(".carousel-inner");
  carouselInner.innerHTML = ""; // 기존 슬라이드 내용 초기화

  events.forEach((event, index) => {
    const carouselItem = document.createElement("div");
    carouselItem.classList.add("carousel-item");
    if (index === 0) carouselItem.classList.add("active"); // 첫 번째 아이템 활성화

    const img = document.createElement("img");
    img.src = `./선수제공파일/images/${event.photo}`; // 축제 이미지 경로
    img.classList.add("d-block", "w-100", "carousel-image"); // 이미지 크기 조정
    img.alt = event.title; // 축제 제목을 alt 속성으로 사용

    const carouselCaption = document.createElement("div");
    carouselCaption.classList.add("carousel-caption", "d-none", "d-md-block");

    const title = document.createElement("h5");
    title.textContent = event.title;

    const period = document.createElement("p");
    period.textContent = `기간: ${event.startdate} ~ ${event.enddate}`;

    const location = document.createElement("p");
    location.textContent = `장소: ${event.place}`;

    carouselCaption.appendChild(title);
    carouselCaption.appendChild(period);
    carouselCaption.appendChild(location);

    carouselItem.appendChild(img);
    carouselItem.appendChild(carouselCaption);
    carouselInner.appendChild(carouselItem);
  });
}

// 회원가입
function register() {
  const userid = document.querySelector("#userid").value;
  const username = document.querySelector("#username").value;
  const password = document.querySelector("#password").value;
  const passwordCheck = document.querySelector("#passwordCheck").value;
  const captcha = document.querySelector("#captcha").value;

  if (!userid) {
    alert("아이디를 입력해주세요.");
  } else if (!username) {
    alert("이름을 입력해주세요.");
  } else if (!password) {
    alert("비밀번호를 입력해주세요.");
  } else if (!passwordCheck) {
    alert("비밀번호 재확인 입력해주세요.");
  } else if (!captcha) {
    alert("캡차 코드를 입력해주세요.");
  } else if (password != passwordCheck) {
    alert("비밀번호 재확인해주세요.");
  } else {
    $.post("./C_Module/api/register", {
      userid: userid,
      username: username,
      password: password,
      captcha: captcha,
    }).done(function (data) {
      if (data == "회원가입이 완료되었습니다.") {
        alert(data);
        location.href = "./";
      } else if (data == "캡차를 다시 입력해주세요.") {
        alert(data);
        captcha();
        captcha.value = "";
      } else {
        alert(data);
        console.log(data);
      }
    });
  }
}

function captcha() {
  const captcha_img = document.querySelector("#captcha_img");
  $.get("./C_Module/api/register", function (data) {
    if (!data) {
      console.error("Failed to generate captcha.");
    } else {
      captcha_img.src = data; // 서버에서 받은 URL을 이미지 src에 할당
      console.log(data);
    }
  }).fail(function () {
    console.error("Failed to load captcha image.");
  });
}

function login() {
  const id = document.querySelector("#id").value;
  const pw = document.querySelector("#pw").value;

  if (!id) {
    alert("아이디를 입력해주세요.");
  } else if (!pw) {
    alert("비밀번호를 입력해주세요.");
  } else {
    $.post("./C_Module/api/login", {
      userid: id,
      userpassword: pw,
    }).done(function (data) {
      if (data.message === "로그인 성공") {
        if (!data.apikey) {
          alert("apikey를 발급받으세요.");
          alert(data.message);
          setCookie("id", data.id, 7);
          setCookie("token", data.token, 7);
          setCookie("userid", data.userid, 7);
          setCookie("username", data.name, 7);
          location.href = "./";
        }
      } else if (data.message === "로그인 실패") {
        alert(data.message);
      } else {
        console.log(data);
      }
    });
  }
}

// setCookie("test", "testValue", 1);
// console.log("Test cookie:", getCookie("test"));
// deleteCookie("test");

// 쿠키 저장하는 함수
function setCookie(name, value, days) {
  var date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000); // days 단위로 변환
  document.cookie =
    encodeURIComponent(name) +
    "=" +
    encodeURIComponent(value) +
    ";expires=" +
    date.toUTCString() +
    ";path=/";
}

// 쿠키 값 가져오는 함수
function getCookie(name) {
  var value = document.cookie.match("(^|;) ?" + name + "=([^;]*)(;|$)");
  return value ? decodeURIComponent(value[2]) : null;
}

// 쿠키 삭제하는 함수
function deleteCookie(name) {
  document.cookie =
    encodeURIComponent(name) +
    "=; expires=Thu, 01 JAN 1999 00:00:10 GMT;path=/";
}

function logout() {
  $.post("./C_Module/api/logout", {
    userid: getCookie("userid"),
  }).done(function (data) {
    if (data == "로그아웃 성공") {
      deleteCookie("id");
      deleteCookie("token");
      deleteCookie("userid");
      deleteCookie("username");
      location.href = "./";
    } else {
      console.log(data);
    }
  });
}

function loginCheck() {
  const header_section = document.querySelector("#header_section");
  const mypage = document.querySelector("#mypage");
  let headerElem = "";
  let mypageElem = `<a href="./mypage.php">마이페이지</a>`;
  mypage.innerHTML = mypageElem;
  if (!getCookie("token")) {
    // alert("로그인 후 이용해주세요.");
    headerElem = `<li><label for="login">로그인</label></li>
            <li><label onclick="captcha()" for="register">회원가입</label></li>`;
    header_section.innerHTML = headerElem;
    // location.href = "./";
  } else if (getCookie("token")) {
    // console.log(getCookie("token"));
    $.get("./C_Module/api/login", {
      // userid: getCookie("userid"),
      // userid: getCookie("username"),
      token: getCookie("token"),
    }).done(function (data) {
      if (data == "이미 로그인 되었습니다.") {
        headerElem = `<li><label onclick="logout()">로그아웃</label></li>`;
        header_section.innerHTML = headerElem;
        if (getCookie("userid") == "admin") {
          mypageElem = `<a href="./admin.php">관리자페이지</a>`;
          mypage.innerHTML = mypageElem;
        }
      } else {
        alert(data);
      }
    });
  } else {
    headerElem = `<li><label for="login">로그인</label></li>
    <li><label onclick="captcha()" for="register">회원가입</label></li>`;
    header_section.innerHTML = headerElem;
  }
}

loginCheck();

// 로그인 하지 않으면 에러메시지 없이 메인페이지로 이동.
function mypageLoginCheck() {
  if (!getCookie("token")) {
    location.href = "./";
  }
}

// apikey 신청 현황
function mypageApikeyList() {
  const apikeylist = document.querySelector("#apikey_list");
  let apiListElem = "";
  let deleteBtn = `<button onclick="apikeyDelete()" disabled type="button" class="btn btn-danger">삭제</button>`;
  const apiAddBtn = document.querySelector("#apiAddBtn");
  apiAddBtn.disabled = false;
  $.get("./C_Module/api/mypage", {
    id: getCookie("id"),
  }).done(function (data) {
    if (data.length == 0) {
      alert("아직 발급받은 apikey가 없습니다.");
    } else {
      data.forEach(function (apikey) {
        if (apikey.status == 1) {
          apikey.status = "신청중";
        } else if (apikey.status == 2) {
          apikey.status = "발급됨";
          apiAddBtn.disabled = true;
          deleteBtn = `<button onclick="apikeyDelete()" type="button" class="btn btn-danger">삭제</button>`;
        } else {
          apikey.status = "삭제됨";
        }
        apiListElem += `<tr>
                <td>${apikey.username}</td>
                <td>${apikey.userid}</td>
                <td>${apikey.requested_at}</td>
                <td>${apikey.status}</td>
                <td>${apikey.issued_at || "없음"}</td>
                <td>${apikey.apikey}</td>
                <td>${apikey.deleted_at || "없음"}</td>
                <td>${deleteBtn}</td>
            </tr>`;
        // console.log(apikey);
      });
      apikeylist.innerHTML = apiListElem;
      // console.log(data);
    }
  });
}

// apikey 신청
function apikeyApp() {
  $.post("./C_Module/api/mypage", {
    id: getCookie("id"),
    apikeyapp: true,
  }).done(function (data) {
    if (data == "apikey 발급 대기 중") {
      alert(data);
      location.href = "./mypage.php";
    }
  });
}

// apikey 삭제
function apikeyDelete() {
  $.post("./C_Module/api/mypage", {
    id: getCookie("id"),
    delete: true,
  }).done(function (data) {
    if (data == "apikey가 삭제되었습니다.") {
      alert(data);
      logout();
    } else {
      alert(data);
      console.log(data);
    }
  });
}

// 관리자 페이지 : apikey 신청 현황
function adminApikeyList() {
  const apikeylist = document.querySelector("#apikey_list");
  let apiListElem = "";

  $.get("./C_Module/api/admin").done(function (data) {
    if (data.length == 0) {
      alert("신청내역이 없습니다.");
    } else {
      data.forEach(function (apikey) {
        let deleteBtn = `<button onclick="adminApikeyDelete('${apikey.apikey}')" disabled type="button" class="btn btn-danger">삭제</button>`;
        let okBtn = `<button onclick="apikeyOk('${apikey.apikey}')" disabled type="button" class="btn btn-primary">승인</button>`;

        if (apikey.status == 1) {
          apikey.status = "신청중";
          okBtn = `<button onclick="apikeyOk('${apikey.apikey}')" type="button" class="btn btn-primary">승인</button>`;
        } else if (apikey.status == 2) {
          apikey.status = "발급됨";
          deleteBtn = `<button onclick="adminApikeyDelete('${apikey.apikey}')" type="button" class="btn btn-danger">삭제</button>`;
        } else {
          apikey.status = "삭제됨";
        }

        apiListElem += `<tr>
                <td>${apikey.username}</td>
                <td>${apikey.userid}</td>
                <td>${apikey.requested_at}</td>
                <td>${apikey.status}</td>
                <td>${apikey.issued_at || "없음"}</td>
                <td>${apikey.apikey}</td>
                <td>${apikey.deleted_at || "없음"}</td>
                <td>${deleteBtn}</td>
                <td>${okBtn}</td>
            </tr>`;
      });
      apikeylist.innerHTML = apiListElem;
    }
  });
}

function apikeyOk(value) {
  const apikey = value;
  $.post("./C_Module/api/admin", {
    apikey: apikey,
    Ok: true,
  }).done(function (data) {
    if (data == "승인 완료") {
      alert(data);
      location.href = "./admin.php";
    } else {
      alert(data);
      console.log(data);
    }
  });
}

function adminApikeyDelete(value) {
  const apikey = value;
  $.post("./C_Module/api/admin", {
    apikey: apikey,
    delete: true,
  }).done(function (data) {
    if (data == "삭제 완료") {
      alert(data);
      location.href = "./admin.php";
    } else {
      alert(data);
      console.log(data);
    }
  });
}
