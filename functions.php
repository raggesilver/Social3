<?php

  // possible responses for this page:

  // error
  // ok
  // json

  // remember not to answer with json in case of fail

  /*
    Error codes: 100 = function specified on POST not available, 200 = database connection error, AUTH = authentication error
  */

  function base64ToImage($imageData)
  {
      $pos = explode(',', $imageData)[0];
      $data = explode(',', $imageData)[1];

      $type = str_replace(';base64', '', explode('/', $pos)[1]);

      $filename = md5(uniqid() . rand()) . '.' . $type;

      $fh = fopen('posts_res/' . $filename, 'wb');
      stream_filter_append($fh, 'convert.base64-decode');

      fwrite($fh, $data);

      fclose($h);

      return $filename;
  }

  function checkCookie()
  {
      if (!isset($_COOKIE['username'])) {
          echo "error:must login first";
          die();
      }

      setcookie('username', $_COOKIE['username'], time() + 3600); // Add some time for the cookie
  }

  if (!$_POST) {
      echo "error";
      die();
  }

  include 'db.php';
  if (!$conn) {
      echo "error:200";
      die();
  }

  switch ($_POST['func']) {

    case 'login':
      $username = $_POST['username'];
      $password = md5($_POST['password']);

      $query = $conn->query("SELECT * FROM users WHERE username='$username' AND password='$password'");

      if ($query->num_rows > 0) {
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

      $query = mysqli_query($conn, "INSERT INTO users(username, password, email, fullname, likes, friends) VALUES('$username', '$password', '$email', '$fullname', '[]', '[]')");

      if ($query) {
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

        if (!$query) {
            die('not query');
        }

        if ($query->num_rows > 0) {
            $info = mysqli_fetch_array($query);

            $qr = mysqli_query($conn, "SELECT * FROM posts WHERE publisher='$username'");

            $totalPosts = (int) $qr->num_rows;

            $arr = array("username" => $info['username'], "fullname" => $info['fullname'], "totalPosts" => $totalPosts, "profpic" => $info['profpic']);
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

        $contentObj = (array) json_decode($_POST['content']);

        $sharing = (bool) $contentObj['sharing'];

        $newContentObj = NULL;

        $queryString = "";

        if($sharing) {

            $id = $contentObj['postid'];

            $qr = mysqli_query($conn, "SELECT * FROM posts WHERE id=$id");
            $post = mysqli_fetch_array($qr);

            $postContent = (array) json_decode($post['content']);

            $originalPublisher = $post['originalPublisher'];

            if($originalPublisher == null) $originalPublisher = $post['publisher'];

            $newContentObj = array('contentType' => $postContent['contentType'], 'content' => $postContent['content'], 'attatchments' => $postContent['attatchments']);

            $newContentJSON = mysqli_real_escape_string($conn, json_encode($newContentObj));

            $queryString = "INSERT INTO posts(publisher, originalPublisher, postdate, content) VALUES('$username', '$originalPublisher', CURDATE(), '$newContentJSON')";

        } else {

            $files = (array) json_decode($contentObj['media']);

            $newFiles = array();

            for ($i=0; $i < count($contentObj['media']); $i++) {
                $newFiles[] = base64ToImage($contentObj['media'][$i]);
            }

            $newContentObj = array('contentType' => $contentObj['contentType'], 'content' => utf8_encode($contentObj['content']), 'attatchments' => $newFiles);

            $newContentJSON = mysqli_real_escape_string($conn, json_encode($newContentObj));

            $queryString = "INSERT INTO posts(publisher, postdate, content) VALUES('$username', CURDATE(), '$newContentJSON')";

        }

        $query = mysqli_query($conn, $queryString);

        $ans = ($query) ? 'OK' . $_POST['postid'] : 'FAIL ' . mysqli_error($conn) . mysqli_real_escape_string($conn, json_encode($newContentObj));

        echo $ans;

        break;

    case 'generateFeed':

        checkCookie();

        $username = $_COOKIE['username'];

        $query = mysqli_query($conn, "SELECT * FROM posts ORDER BY id DESC");

        $arr = array();

        if ($query->num_rows > 0) {
            while ($row = mysqli_fetch_array($query)) {
                $q = mysqli_query($conn, "SELECT likes, friends FROM users WHERE username='$username'");

                $r = mysqli_fetch_array($q);

                $friends = (array) json_decode($r['friends']);

                if(!in_array($row['publisher'], $friends) && $row['publisher'] != $username)
                    continue;

                $likes = (array) json_decode($r['likes']);

                $liked = false;

                if (in_array($row['id'], $likes)) {
                    $liked = true;
                }

                $qr = mysqli_query($conn, "SELECT profpic FROM users WHERE username='" . $row['publisher'] . "'");
                $qrArr = mysqli_fetch_array($qr);

                $arr[] = array("publisher" => $row['publisher'], "isShared" => ($row['originalPublisher'] != null), "originalPublisher" => $row['originalPublisher'], "content" => utf8_decode($row['content']), "postdate" => $row['postdate'], "likes" => $row['likes'], "id" => $row['id'], "liked" => $liked, "profpic" => $qrArr['profpic']);
            }

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

        if ($query->num_rows > 0) {
            while ($row = mysqli_fetch_array($query)) {
                $username = $_COOKIE['username'];

                $q = mysqli_query($conn, "SELECT likes FROM users WHERE username='$username'");

                $r = mysqli_fetch_array($q);

                $likes = (array) json_decode($r['likes']);

                $liked = false;

                if (in_array($row['id'], $likes)) {
                    $liked = true;
                }

                $qr = mysqli_query($conn, "SELECT profpic FROM users WHERE username='" . $row['publisher'] . "'");
                $qrArr = mysqli_fetch_array($qr);

                $arr[] = array("publisher" => $row['publisher'], "isShared" => ($row['originalPublisher'] != null), "originalPublisher" => $row['originalPublisher'], "content" => $row['content'], "postdate" => $row['postdate'], "likes" => $row['likes'], "id" => $row['id'], "liked" => $liked, "profpic" => $qrArr['profpic']);
            }

            echo json_encode($arr);
        } else {
            echo 'no results';
        }

        break;

    case 'toggleLike':

        checkCookie();

        $id = (int) $_POST['id'];
        $username = $_COOKIE['username'];

        $query = mysqli_query($conn, "SELECT likes FROM users WHERE username='$username'");

        $row = mysqli_fetch_array($query);

        $likes = (array) json_decode($row['likes']);

        if (in_array($id, $likes)) {
            if (($key = array_search($id, $likes)) !== false) {
                unset($likes[$key]);
            }
            $lk = json_encode(array_values($likes));
            mysqli_query($conn, "UPDATE users SET likes='$lk' WHERE username='$username'");
            mysqli_query($conn, "UPDATE posts SET likes=likes-1 WHERE id='$id'");
        } else {
            array_push($likes, $id);
            $lk = json_encode(array_values($likes));
            mysqli_query($conn, "UPDATE users SET likes='$lk' WHERE username='$username'");
            mysqli_query($conn, "UPDATE posts SET likes=likes+1 WHERE id='$id'");
        }

        break;

    case 'getProfileInfo':

        checkCookie();

        $profile = $_POST['profile'];

        $query = mysqli_query($conn, "SELECT * FROM users WHERE username='$profile'");

        if (!$query) {
            die('not query');
        }

        if ($query->num_rows > 0) {
            $info = mysqli_fetch_array($query);

            $qr = mysqli_query($conn, "SELECT * FROM posts WHERE publisher='$profile'");

            $totalPosts = (int) $qr->num_rows;

            $isMe = ($profile == $_COOKIE['username']);
            $isAdded = false;

            if (!$isMe) {
                $me = $_COOKIE['username'];
                $qr2 = mysqli_query($conn, "SELECT friends FROM users WHERE username='$me'");
                $info2 = mysqli_fetch_array($qr2);
                $friends = (array) json_decode($info2['friends']);
                $isAdded = (in_array($profile, $friends));
            }

            $arr = array("username" => $info['username'], "fullname" => $info['fullname'], "totalPosts" => $totalPosts, "isMe" => $isMe, "isAdded" => $isAdded, "profpic" => $info['profpic']);
            echo json_encode($arr);
        } else {
            echo 'not found';
        }

        break;

    case 'toggleFriendship':

        checkCookie();

        $friend = $_POST['friend'];
        $username = $_COOKIE['username'];

        $query = mysqli_query($conn, "SELECT friends FROM users WHERE username='$username'");
        $info = mysqli_fetch_array($query);
        $friends = (array) json_decode($info['friends']);
        $added = false;

        if(in_array($friend, $friends)) {
            if (($key = array_search($friend, $friends)) !== false) {
                unset($friends[$key]);
            }

            $fds = json_encode(array_values($friends));

            $qr = mysqli_query($conn, "UPDATE users SET friends='$fds' WHERE username='$username'");

            if($qr) echo "REMOVED";

        } else {

            array_push($friends, $friend);
            $fds = json_encode(array_values($friends));

            $qr = mysqli_query($conn, "UPDATE users SET friends='$fds' WHERE username='$username'");

            if($qr) echo "ADDED";

        }

        break;

    case 'search':

        // Remember that in the future there will be a way to search for pages

        $search = $_POST['search'];

        $arr = array();

        $query = mysqli_query($conn, "SELECT * FROM users WHERE username LIKE _utf8'%" . $search . "%' OR fullname LIKE _utf8'%" . $search . "%'");

        while($row = mysqli_fetch_array($query)) {
            $tmp = array("username" => $row['username'], "fullname" => $row['fullname'], "profpic" => $row['profpic']);
            $arr[] = $tmp;
        }

        echo json_encode($arr);

        break;

    case 'updateProfpic':

        checkCookie();

        $username = $_COOKIE['username'];
        $contentObj = (array) json_decode($_POST['content']);

        $img = $contentObj['profpic'];
        $url = "/carlos/posts_res/" . base64ToImage($img);

        $query = mysqli_query($conn, "UPDATE users SET profpic='$url' WHERE username='$username'");
        if($query) {
            echo 'OK:' . $img;
        } else {
            echo 'FAIL: ' . mysqli_error($conn);
        }

        break;

    default: echo "error:100"; die();
  }
