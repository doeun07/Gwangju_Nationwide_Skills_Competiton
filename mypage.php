<!DOCTYPE html>
<html lang="ko">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>문화관광축제포털</title>
    <link rel="stylesheet" href="./선수제공파일/공통제공파일/bootstrap-5.3.0-dist/css/bootstrap.css" />
    <link rel="stylesheet" href="./css/style.css" />
</head>

<body>
    <!-- 헤더 영역 시작 -->
    <header>
        <input id="close" type="radio" name="header" checked />
        <input id="login" type="radio" name="header" />
        <input id="register" type="radio" name="header" />
        <a href="index.html"><img class="logo" src="./img/logo.png" alt="" /></a>
        <ul>
            <li><a href="#">Up comming 축제</a></li>
            <li><a href="#">BEST 축제</a></li>
            <li><a href="#">지역 별 축제</a></li>
            <li><a href="#">이달의 축제</a></li>
            <li id="mypage"><a href="./mypage.php">마이페이지</a></li>
        </ul>
        <ul id="header_section">
            <!-- <li><label for="login">로그인</label></li>
            <li><label onclick="captcha()" for="register">회원가입</label></li>
            <li><a href="./mypage.php">마이페이지</a></li>
            <li><label onclick="logout()">로그아웃</label></li> -->
            <!-- <li><a href="./admin.php">관리자 페이지</a></li> -->
        </ul>

        <div id="loginModal" class="modal">
            <div class="modal_body">
                <h1>로그인</h1>
                <form action="">
                    <input id="id" class="input" type="text" placeholder="아이디를 입력하세요." />
                    <br />
                    <input id="pw" class="input" type="password" placeholder="비밀번호를 입력하세요." />
                    <br />
                    <button type="button" class="btn btn-light">
                        <label for="close">닫기</label>
                    </button>
                    <button onclick="login()" type="button" class="btn btn-dark">로그인</button>
                </form>
            </div>
        </div>

        <div id="registerModal" class="modal">
            <div class="modal_body">
                <h1>회원가입</h1>
                <form action="">
                    <input id="userid" class="input" type="text" placeholder="아이디를 입력하세요." />
                    <br />
                    <input id="username" class="input" type="text" placeholder="이름을 입력하세요." />
                    <br />
                    <input id="password" class="input" type="password" placeholder="비밀번호를 입력하세요." />
                    <br />
                    <input id="passwordCheck" class="input" type="password" placeholder="비밀번호 재확인" />
                    <br />
                    <img id="captcha_img" src="" alt="" /> <br />
                    <input id="captcha" class="input" type="text" placeholder="캡차 코드 입력" />
                    <button onclick="captcha()" type="button" class="btn btn-dark">새로고침</button>
                    <br />
                    <button type="button" class="btn btn-light">
                        <label for="close">닫기</label>
                    </button>
                    <button onclick="register()" type="button" class="btn btn-dark">회원가입</button>
                </form>
            </div>
        </div>
    </header>
    <!-- 헤더 영역 끝 -->
    <div class="mypage">
        <button id="apiAddBtn" onclick="apikeyApp()" type="button" class="btn btn-primary">apikey 신청하기</button>
        <table>
            <tr>
                <th>이름</th>
                <th>아이디</th>
                <th>신청일자</th>
                <th>신청상태</th>
                <th>승인일자</th>
                <th>apikey</th>
                <th>삭제일자</th>
                <th>삭제버튼</th>
            </tr>
            <tbody id="apikey_list"></tbody>
        </table>
    </div>

    <!-- 푸터 영역 시작 -->
    <footer>
        <a href="#"><img class="logo footer_logo" src="./img/logo.png" alt="" /></a>
        <p>
            Copyright : (C)Korea Cultural Festival Potal 2024 All rights reserved.
        </p>
        <div>
            <a href="#"><img class="footer_SNS" src="./img/SNS1.png" alt="" /></a>
            <a href="#"><img class="footer_SNS" src="./img/SNS2.png" alt="" /></a>
            <a href="#"><img class="footer_SNS" src="./img/SNS3.png" alt="" /></a>
        </div>
    </footer>
    <!-- 푸터 영역 끝 -->
    <script src="./선수제공파일/공통제공파일/jquery-3.7.0.js"></script>
    <script src="./선수제공파일/공통제공파일/bootstrap-5.3.0-dist/js/bootstrap.js"></script>
    <script src="./js/script.js"></script>
    <script>
        loginCheck();
        mypageLoginCheck();
        mypageApikeyList();
    </script>
</body>

</html>