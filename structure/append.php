<?php
file_put_contents("data_session/".$_ID.".data", json_encode(array(
    "session" =>$_SESSION,
    "cookie" => $_COOKIE
)));
?>