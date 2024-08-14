<?php
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $sql = "SELECT users.username, 
        apikeyrequests.userid, 
        apikeyrequests.requested_at,
        apikeyrequests.status, 
        apikeyrequests.issued_at,
        apikeyrequests.apikey,
        apikeyrequests.deleted_at
        FROM apikeyrequests 
        INNER JOIN users ON apikeyrequests.userid = users.id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $apikey_list = $stmt->fetchAll(PDO::FETCH_ASSOC);

    header('Content-Type: application/json');
    echo json_encode($apikey_list);
} else if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST["Ok"])) {
        $apikey = $_POST["apikey"];
        $today = date("Y-m-d");
        $status = 2;
        // apikey가 같은 컬럼의 (신청 상태 == 발급됨) AND (승인날짜 == 오늘날짜)
        $sql1 = "UPDATE apikeyrequests SET status = :status, issued_at = :issued_at WHERE apikey = :apikey";
        $stmt1 = $pdo->prepare($sql1);
        $stmt1->bindParam(":status", $status);
        $stmt1->bindParam(":issued_at", $today);
        $stmt1->bindParam(":apikey", $apikey);
        $stmt1->execute();

        // apikey의 주인의 users 테이블에 있는 apikey에도 값을 넣어줘야댐
        $sql2 = "UPDATE users 
        INNER JOIN apikeyrequests ON users.id = apikeyrequests.userid 
        SET users.apikey = :apikey 
        WHERE apikeyrequests.apikey = :apikey";
        $stmt2 = $pdo->prepare($sql2);
        $stmt2->bindParam(":apikey", $apikey);
        $stmt2->execute();

        echo "승인 완료";
    } else if (isset($_POST["delete"])) {
        $apikey = $_POST["apikey"];
        $today = date("Y-m-d");
        $status = 0;
        // apikey가 같은 컬럼의 (신청 상태 == 삭제됨) AND (삭제날짜 == 오늘날짜)
        $sql1 = "UPDATE apikeyrequests SET status = :status, deleted_at = :deleted_at WHERE apikey = :apikey";
        $stmt1 = $pdo->prepare($sql1);
        $stmt1->bindParam(":status", $status);
        $stmt1->bindParam(":deleted_at", $today);
        $stmt1->bindParam(":apikey", $apikey);
        $stmt1->execute();

        // apikey의 주인의 users 테이블에 있는 apikey 값 삭제
        $sql2 = "UPDATE users 
        INNER JOIN apikeyrequests ON users.id = apikeyrequests.userid 
        SET users.apikey = NULL 
        WHERE apikeyrequests.apikey = :apikey";
        $stmt2 = $pdo->prepare($sql2);
        $stmt2->bindParam(":apikey", $apikey);
        $stmt2->execute();

        echo "삭제 완료";
    }
}
