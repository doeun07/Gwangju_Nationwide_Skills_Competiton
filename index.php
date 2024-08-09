<?php
include("./config/DBconnect.php");
$request = $_SERVER["REQUEST_URI"];
$path = explode('?', $request);
$path[1] = isset($path[1]) ? $path[1] : null;
$resource = explode("/", $path[0]);

$page = "";

switch ($resource[1]) {
    case '':
        $page = "./pages/index.html";
        break;
    case 'mypage':
        $page = "./pages/mypage.php";
        break;
    default:
        echo "잘못된 접근입니다.";
        break;
}


include($page);
?>