$(() => {
    $('#search-page').css('margin-top', ($(window).height() / 2) - ($('#search-page').height() / 2));
    let date = new Date();
    $('p.text-center#copy-right').append(date.getFullYear());
    $('#account-name').tooltip({
        trigger: 'manual'
    });
    $('body').height($('body').height() - parseInt($('#search-page').css('margin-top')));
});

$(window).resize(() => {
    $('#search-page').css('margin-top', ($(window).height() / 2) - ($('#search-page').height() / 2));
});

$('#account-name').keypress((e) => {
    if (e.keyCode == 13) {
        checkInput();
        return false;
    }
});

$('#account-btn').click(() => {
    checkInput();
    return false;
});

function checkInput() {
    if ($('#account-name').val() == '' || $('#account-name').val().length == 0) {
        $('input#account-name[data-toggle=tooltip]').tooltip('show');
        setTimeout(function () {
            $('input#account-name[data-toggle=tooltip]').tooltip('hide');
        }, 2000);
    }
    else {
        var input = $('#account-name').val().toUpperCase();
        $('div#search-page').css('display', 'none');
        $('div.loader-parent').css('display', '');
        $.post('/getUser', { username: input }, (data) => {
            if (data.flag) {
                vue.$data.user = data.user;
                $('div.loader-parent').fadeOut(400, () => {
                    $('div#profile-page').css('display', '');
                });
            } else {
                $('div.loader-parent').css('display', 'none');
                swal('Không tìm thấy', 'Tài khoản không tồn tại', 'error');
                $('div#search-page').css('display', '');
            }
        });
    }
}