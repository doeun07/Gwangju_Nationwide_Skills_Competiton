<?php
function generateApiKey($length = 30)
{
    // 유일한 ID를 기반으로 random_bytes()를 결합하여 고유성을 극대화
    $key = bin2hex(random_bytes($length / 2)) . uniqid();

    // 필요한 경우 길이를 줄이거나 늘릴 수 있음
    return substr($key, 0, $length);
}

// 사용 예시

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $id = $_GET["id"];

    $sql = "SELECT users.username, 
    apikeyrequests.userid, 
    apikeyrequests.requested_at,
    apikeyrequests.status, 
    apikeyrequests.issued_at,
    apikeyrequests.apikey,
    apikeyrequests.deleted_at
    FROM apikeyrequests 
    INNER JOIN users ON apikeyrequests.userid = users.id
    WHERE apikeyrequests.userid = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(":id", $id);
    $stmt->execute();
    $apikey_list = $stmt->fetchAll(PDO::FETCH_ASSOC);

    header('Content-Type: application/json');
    echo json_encode($apikey_list);
} else if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST["apikeyapp"])) {
        $id = $_POST["id"];
        $apiKey = generateApiKey();
        $requested_at = date("Y-m-d");

        $sql = "INSERT INTO apikeyrequests (userid, apikey, requested_at) VALUES (?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$id, $apiKey, $requested_at]);

        echo "apikey 발급 대기 중";
    } else if (isset($_POST["delete"])) {
        $id = $_POST["id"];
        $deleted_at = date("Y-m-d");
        $status = 0;

        // apikeyrequests 테이블에 삭제 날짜 update
        $sql1 = "UPDATE apikeyrequests SET status = :status, deleted_at = :deleted_at WHERE userid =:id";
        $stmt1 = $pdo->prepare($sql1);
        $stmt1->bindParam(":deleted_at", $deleted_at);
        $stmt1->bindParam(":status", $status);
        $stmt1->bindParam(":id", $id);
        $stmt1->execute();

        // users 테이블 apikey 컬럼 null로 update
        $sql2 = "UPDATE users SET apikey = NULL WHERE id =:id";
        $stmt2 = $pdo->prepare($sql2);
        $stmt2->bindParam(":id", $id);
        $stmt2->execute();

        echo "apikey가 삭제되었습니다.";
    }
}
