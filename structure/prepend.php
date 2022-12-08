<?php
var_dump($argv);
$_GET = (array) json_decode($argv[1]);
$_POST = (array) json_decode($argv[2]);
$_COOKIE = (array)json_decode($argv[3]);
$_SESSION = (array)json_decode($argv[4]);
$_ID = $argv[5];
var_dump($_SESSION);
?>
