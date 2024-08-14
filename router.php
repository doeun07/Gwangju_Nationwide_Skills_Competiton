<?php
include("./config/DBconnect.php");
$request = $_SERVER["REQUEST_URI"];
$path = explode('?', $request);
$path[1] = isset($path[1]) ? $path[1] : null;
$resource = explode("/", $path[0]);

$page = "";

// echo $resource[3];

switch ($resource[3]) {
    case 'register':
        $page = "./C_Module/api/register.php";
        break;
    case 'login':
        $page = "./C_Module/api/login.php";
        break;
    case 'logout':
        $page = "./C_Module/api/logout.php";
        break;
    case 'mypage':
        $page = "./C_Module/api/mypage.php";
        break;
    case 'admin':
        $page = "./C_Module/api/admin.php";
        break;
    default:
        echo "잘못된 접근입니다.";
        break;
}

include($page);
