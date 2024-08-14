<?php
$userid = $_POST["userid"];
$username = $_POST["username"];
// $token = $_POST["token"];

$sql = "UPDATE users SET token = NULL WHERE userid = :userid AND username = :username";
$stmt = $pdo->prepare($sql);
$stmt->bindParam(":userid", $userid);
$stmt->bindParam(":username", $username);
$stmt->execute();

echo "로그아웃 성공";