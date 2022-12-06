<?php
if(isset($_SESSION)){
    var_dump($_SESSION);
}
echo "<pre>";
var_dump($argv[1]);
var_dump($argv[2]);
var_dump($argv[3]);
echo "-------------\n";
var_dump($_GET);
var_dump($_POST);
var_dump($argv[3]);
echo "</pre>";
?>