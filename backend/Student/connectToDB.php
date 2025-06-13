<?php
    $ip = "localhost";
    $username = "root";
    $password = "";
    $dbName = "student";
    $connect = mysqli_connect($ip, $username, $password, $dbName);

    if($connect->connect_errno)
    {
        die("Database connect failed:".$connect->connect_errno);
    }
?>