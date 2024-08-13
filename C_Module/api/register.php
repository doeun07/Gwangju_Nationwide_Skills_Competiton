<?php
session_start();

// 캡차 이미지 생성 후 화면에 띄우기
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $image_url = generateCaptchaImage();
    if (!$image_url) {
        echo "Failed to generate captcha image.";
    } else {
        echo $image_url; // 캡차 이미지 URL을 반환
    }
} else if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $userid = $_POST["userid"];
    $username = $_POST["username"];
    $password = $_POST["password"];
    $captcha = $_POST["captcha"];
    
    if ($_SESSION["captcha_code"] == $captcha) {
        // 비밀번호 암호화
        $password = password_hash($password, PASSWORD_DEFAULT);
        $sql = "INSERT INTO users (userid, username, userpassword) VALUES (?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$userid, $username, $password]);

        echo "회원가입이 완료되었습니다.";
    } else {
        echo "캡차를 다시 입력해주세요.";
    }
}

function generateCaptchaImage()
{
    $width = 150;
    $height = 50;
    $image = imagecreatetruecolor($width, $height);

    // 색상 설정
    $bg_color = imagecolorallocate($image, 255, 255, 255);
    $text_color = imagecolorallocate($image, 0, 0, 0);
    $line_color = imagecolorallocate($image, 64, 64, 64);

    // 배경 색 채우기
    imagefilledrectangle($image, 0, 0, $width, $height, $bg_color);

    // 랜덤한 문자 생성
    $charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    $captcha_code = '';
    $length = 6;

    for ($i = 0; $i < $length; $i++) {
        $captcha_code .= $charset[rand(0, strlen($charset) - 1)];
    }

    // 세션에 캡차 코드 저장
    $_SESSION['captcha_code'] = $captcha_code;

    // 기본 폰트를 사용하여 문자열을 이미지에 그리기
    $font_size = 5;
    $x_start = 10; // 문자들이 시작할 기본 x 좌표
    $x_step = ($width - 20) / $length; // 각 문자 간의 x 간격

    for ($i = 0; $i < $length; $i++) {
        $x = $x_start + ($i * $x_step) + rand(-2, 2);
        $y = rand(($height / 2) - 10, ($height / 2) + 10);
        imagestring($image, $font_size, $x, $y, $captcha_code[$i], $text_color);
    }

    // 이미지에 라인 추가
    for ($i = 0; $i < 5; $i++) {
        imageline($image, 0, rand() % $height, $width, rand() % $height, $line_color);
    }

    // 캡차 이미지를 파일로 저장
    $timestamp = time();
    $file_name = 'captcha_image_' . $timestamp . '.png';
    $file_path = __DIR__ . '/../captcha/' . $file_name;

    // 디렉토리가 없는 경우 생성
    if (!is_dir(__DIR__ . '/../captcha')) {
        if (!mkdir(__DIR__ . '/../captcha', 0755, true)) {
            echo "Failed to create captcha directory.";
            return '';
        }
    }

    // 이미지 파일 저장
    if (imagepng($image, $file_path)) {
        imagedestroy($image);
        // 파일 저장이 성공한 경우 URL 반환
        return '/C_Module/captcha/' . $file_name;
    } else {
        imagedestroy($image);
        // 파일 저장이 실패한 경우 빈값 반환 또는 오류 처리
        echo "Failed to save image file.";
        return '';
    }
}
