var profile, username, fullname, name, surname;

function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

function UrlExists(url) {
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status != 404;
}

function setProfileInfo() {
    $('.self-fullname').html(fullname);
    $('.side-menu-username').text('@' + username);
    $('.side-menu-username').attr('href', '/carlos/?profile=' + username);

    var url = (UrlExists('/carlos/users/' + username + '/profpic-small.png')) ? '/carlos/users/' + username + '/profpic-small.png' : '/carlos/views/res/default-user.jpg';

    selfpic = url;

    $('.self-profpic-sm').attr('src', url);
}

function getProfileInfo() {

    $.post({
        url: '/carlos/functions.php',
        data: 'func=getProfileInfo&profile=' + profile,
        success: function(_data) {

            // alert(_data);

            data = JSON.parse(_data);
            username = data.username;
            fullname = data.fullname;
            name = data.fullname.split(' ')[0];
            surname = data.fullname.split(' ')[data.fullname.split(' ').length - 1];

            setProfileInfo();
            generateFeed();
        },
        error: function(err) {
            alert(err);
        }
    });

}

function generateFeed() {
    $.post({
        url: '/carlos/functions.php',
        data: 'func=generateProfileFeed&profile=' + profile,
        success: function(data) {

            var json = JSON.parse(data);
            for (var post of json) {
                var publisher = post.publisher;
                var content = post.content;
                var postdate = post.postdate;

                var url = (UrlExists('/carlos/users/' + publisher + '/profpic-small.png')) ? '/carlos/users/' + publisher + '/profpic-small.png' : '/carlos/views/res/default-user.jpg';

                var div = document.createElement('div');
                $(div).addClass('feed-card');
                $(div).append('<img class="post-profpic profpic" src="' + url + '">');
                $(div).append('<a class="profile-link">@' + publisher + '</a>');
                $(div).append('<p> - ' + postdate + '</p>');
                $(div).append('<div class="clear"></div>');
                $(div).append('<p class="content">' + content + '</p>');
                $(div).append('<table><tr><td><button class="img-button like-btn"><i class="fa fa-heart" aria-hidden="true"></i></button></td><td><button class="img-button"><i class="fa fa-mail-forward" aria-hidden="true"></i></button></td><td><button class="img-button"><i class="fa fa-comment" aria-hidden="true"></i></button></td></tr></table>');
                $('.feed').append(div);
            }
        },
        error: function(err) {
            alert(err);
        }
    });
}

$(function(){
    profile = getParameterByName('profile');
    getProfileInfo();
    // alert(profile);
});
