<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <meta name="mobile-web-app-capable" content="yes">
  <title>Ifetter</title>

  <script src="views/js/jquery-3.1.1.min.js"></script>

  <!-- Latest compiled and minified CSS -->
  <link rel="stylesheet" href="views/css/bootstrap.min.css">

  <!-- Optional theme -->
  <link rel="stylesheet" href="views/css/bootstrap-theme.min.css">

  <!-- Latest compiled and minified JavaScript -->
  <script src="views/js/bootstrap.min.js"></script>

  <link href="views/css/font.css" rel="stylesheet">

  <script src="https://use.fontawesome.com/a873715b1c.js"></script>
</head>
<body>

<?php

  if(!isset($_COOKIE['username'])) {
    include 'views/index.html';
  } else {
      include 'views/navbar.html';
      if($_GET['profile']) {
          include 'views/profile.php';
      } else {
          include 'views/main.php';
      }
  }

?>

</body>
</html>
