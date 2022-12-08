<?php
var_dump($_SESSION);
$json = json_encode(array(
    "session" =>$_SESSION,
    "cookie" => $_COOKIE
));
file_put_contents("data_session/".$_ID.".data", $json);
?>