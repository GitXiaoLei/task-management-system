import $ from 'jquery';

$(document).on('click', 'button', function() {
    $.post({
        url: '/home/login',
        data: {
            username: $('#username').val(),
            password: $('#password').val()
        },
        success: function(data) {
            console.log(data);
        },
        error: function(data) {
            console.error(data);
        }
    });
});
