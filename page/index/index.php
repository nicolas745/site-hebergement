<?php
session_start();
$_SESSION['dd'] ="ddd";
?>
<html>
    <head>
        <link rel="stylesheet" href="style.css"/>
    </head>
    <body>
        <form action="" method="POST">
            <input name="name">
            <input type="submit" name="submit">
        </form>
    </body>
</html>