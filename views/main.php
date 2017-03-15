<div class="page">
    <div class="container-fluid col-md-3 col-sm-3 side-menu">
        <div class="side-menu-prof-container">
            <img class="side-menu-profpic self-profpic-sm profpic">
            <h3 class="side-menu-name self-fullname">User Name</h3>
            <a class="side-menu-username "href="#">@username</a>
            <p class="side-menu-totalposts"></p>
        </div>

        <div class="">
            <ul class="side-menu-tools">
                <li><a href="/carlos/test.php"><i class="fa fa-calendar" aria-hidden="true"></i> Calendar</a></li>
                <li><a href="/carlos/test.php"><i class="fa fa-book" aria-hidden="true"></i> Assignments</a></li>
            </ul>
        </div>
    </div>

    <div class="container-fluid col-md-6 col-sm-6 col-xs-12 feed">
        <div class="write-box">
            <h3>Write a post</h3>
            <textarea name="text" rows="3" placeholder="What is on your mind?" class="big-font"></textarea>
            <button type="button" class="publishButton"><i class="fa fa-paper-plane" aria-hidden="true"></i></button>
            <button type="button" class="img-btn attatchImgButton"><i class="fa fa-camera" aria-hidden="true"></i></button>
            <div class="preview-box"></div>
            <div class="invisible">
                <input type="file" class="attatchFileInput" multiple>
            </div>
            <div class="clear">

            </div>
        </div>
    </div>

    <link rel="stylesheet" href="views/css/main.css">
    <script src="views/js/main.js"></script>
    <script src="views/js/global.js"></script>
</div>

<div class="img-full">
    <table>
        <tr>
            <td>
                <img>
            </td>
        </tr>
    </table>

    <button class="img-button full-close-btn">
        <i class="fa fa-close" aria-hidden="true"></i>
    </button>
</div>

<div class="search-full">
    <input type="text">
    <button class="img-btn search-return-button"><i class="fa fa-angle-left" aria-hidden="true"></i></button>
    <button class="img-btn do-search-button"><i class="fa fa-search" aria-hidden="true"></i></button>
    <ul class="result-container">

    </ul>
</div>
