<?php

  // possible responses for this page:

  // error
  // ok
  // json

  // remember not to answer with json in case of fail

  /*
    Error codes: 100 = function specified on POST not available, 200 = database connection error, AUTH = authentication error
  */

  function checkCookie() {
    if(!isset($_COOKIE['username'])) { echo "error:must login first"; die(); }

    setcookie('username', $_COOKIE['username'], time() + 3600); // Add some time for the cookie
  }

  if(!$_POST) { echo "error"; die(); }

  include 'db.php';
  if(!$conn) {echo "error:200"; die();}

  switch($_POST['func']) {

    case 'login':
      $username = $_POST['username'];
      $password = md5($_POST['password']);

      $query = $conn->query("SELECT * FROM users WHERE username='$username' AND password='$password'");

      if($query->num_rows > 0) {

        setcookie('username', $username, time() + 3600);

        echo "OK";
        die();
      } else {
        echo "error:AUTH, username: " . $username . ", password: " . $password;
        die();
      }

      break;

    case 'register':
      $username = $_POST['username'];
      $password = md5($_POST['password']);
      $email = $_POST['email'];
      $fullname = $_POST['fullname'];

      $query = mysqli_query($conn, "INSERT INTO users(username, password, email, fullname) VALUES('$username', '$password', '$email', '$fullname')");

      if($query) {
        setcookie('username', $username, time() + 3600);
        echo 'OK';
        die();
      } else {
        echo 'error ' . mysqli_error($conn);
        die();
      }

      break;

    case 'selfinfo':

        checkCookie();

        $username = $_COOKIE['username'];

        $query = mysqli_query($conn, "SELECT * FROM users WHERE username='$username'");

        if(!$query) {
            die('not query');
        }

        if($query->num_rows > 0) {
            $info = mysqli_fetch_array($query);

            $arr = array("username" => $info['username'], "fullname" => $info['fullname']);
            echo json_encode($arr);
        } else {
            echo 'not found';
        }

        // echo json_encode($arr);

        break;

    case 'post':

        checkCookie();

        $username = $_COOKIE['username'];

        $content = $_POST['content'];

        $query = mysqli_query($conn, "INSERT INTO posts(publisher, postdate, content) VALUES('$username', CURDATE(), '$content')");

        $ans = ($query) ? 'OK' : 'FAIL ' . mysqli_error($conn);

        echo $ans;

        break;

    case 'generateFeed':

        checkCookie();

        $username = $_COOKIE['username'];

        $query = mysqli_query($conn, "SELECT * FROM posts ORDER BY id DESC");

        $arr = array();

        if($query->num_rows > 0) {

            while($row = mysqli_fetch_array($query))
                $arr[] = array("publisher" => $row['publisher'], "content" => $row['content'], "postdate" => $row['postdate'], "likes" => $row['likes']);

            echo json_encode($arr);
        } else {
            echo 'no results';
        }

        break;

    case 'generateProfileFeed':

        checkCookie();

        $profile = $_POST['profile'];

        $query = mysqli_query($conn, "SELECT * FROM posts WHERE publisher='$profile' ORDER BY id DESC");

        $arr = array();

        if($query->num_rows > 0) {

            while($row = mysqli_fetch_array($query))
                $arr[] = array("publisher" => $row['publisher'], "content" => $row['content'], "postdate" => $row['postdate'], "likes" => $row['likes']);

            echo json_encode($arr);
        } else {
            echo 'no results';
        }

        break;

    case 'toggleLike':

        checkCookie();

        $id = $_POST['postid'];

        $query = mysqli_query($conn, "UPDATE users SET likes=likes+1 WHERE id=$id");

        //Still have to remove/add the id from/to the user account

        break;

    case 'getProfileInfo':

        checkCookie();

        $profile = $_POST['profile'];

        $query = mysqli_query($conn, "SELECT * FROM users WHERE username='$profile'");

        if(!$query) {
            die('not query');
        }

        if($query->num_rows > 0) {
            $info = mysqli_fetch_array($query);

            $arr = array("username" => $info['username'], "fullname" => $info['fullname']);
            echo json_encode($arr);
        } else {
            echo 'not found';
        }



        break;

    default: echo "error:100"; die();
  }

?>
