<?php
$_COOKIE['dd'] = "s";
var_dump($_COOKIE);
?>
<html>
    <head>
        <link rel="stylesheet" href="style.css"/>
    </head>
    <body>
        <?php
        $_SESSION['username'] ="nicolas";
        ?>
        <form action="" method="POST">
            <input name="name">
            <input type="submit" name="submit">
        </form>
    </body>
</html>