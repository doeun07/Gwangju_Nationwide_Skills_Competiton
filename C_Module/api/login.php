<?php
function generateUniqueToken($length = 30)
{
    // Generate a unique identifier with more entropy
    $token = bin2hex(random_bytes($length / 2));

    // Ensure the token meets the desired length (30 characters)
    return substr($token, 0, $length);
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $token = $_GET["token"];

    $sql = "SELECT * FROM users WHERE token = :token";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(":token", $token);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo "로그인 해주세요.";
    } else {
        echo "이미 로그인 되었습니다.";
    }
} else if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    $userid = $_POST["userid"];
    $userpassword = $_POST["userpassword"];

    $sql = "SELECT * FROM users WHERE userid = :userid";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(":userid", $userid);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (password_verify($userpassword, $user["userpassword"])) {
        $token = generateUniqueToken(30);

        $sql = "UPDATE users SET token = :token WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(":token", $token);
        $stmt->bindParam(":id", $user["id"]);
        $stmt->execute();

        $response = [
            "id" => $user["id"],
            "userid" => $user["userid"],
            "name" => $user["username"],
            "apikey" => $user["apikey"],
            "token" => $token,
            "message" => "로그인 성공"
        ];

        header('Content-Type: application/json');
        echo json_encode($response);
    } else {
        $response = [
            "message" => "로그인 실패"
        ];

        header('Content-Type: application/json');
        echo json_encode($response);
    }
}
