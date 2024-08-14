<?php
$userid = $_POST["userid"];

$sql = "UPDATE users SET token = NULL WHERE userid = :userid";
$stmt = $pdo->prepare($sql);
$stmt->bindParam(":userid", $userid);
$stmt->execute();

echo "로그아웃 성공";