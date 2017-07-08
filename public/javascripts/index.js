// create an observer instance
var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        console.log(mutation);
        if (mutation.attributeName == 'style' && mutation.target.style.cssText != ('display: none !important;' || 'display: none !important') && !glob_submit) {
            checkInput(glob_submit);
        }
    });
}), glob_submit = false;



$(() => {
    // config target, options for observer - observer.observe(target, config) - after document ready
    observer.observe(document.querySelector('div#profile-page'), { attributes: true });
    $('#search-page').css('margin-top', ($(window).height() / 2) - ($('#search-page').height() / 2));
    let date = new Date();
    $('p.text-center#copy-right').append(date.getFullYear());
    $('#account-name').tooltip({
        trigger: 'manual'
    });
    $('body').height($('body').height() - parseInt($('#search-page').css('margin-top')));
});

$(window).on('unload', () => {
    observer.disconnect();
});

$(window).resize(() => {
    $('#search-page').css('margin-top', ($(window).height() / 2) - ($('#search-page').height() / 2));
});

$('#account-name').keypress((e) => {
    glob_submit = true;
    if (e.keyCode == 13) {
        checkInput(glob_submit);
        return false;
    }
});

$('#account-btn').click(() => {
    glob_submit = true;
    checkInput(glob_submit);
    return false;
});

function checkInput(submit_parameter) {
    if (submit_parameter) {
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
            $.post({
                url: '/getUser',
                data: { username: input },
                success: (data) => {
                    if (data.flag) {
                        vue.$data.user = data.user;
                        $('div.loader-parent').fadeOut(400, () => {
                            $('div#profile-page').removeAttr('style');
                        });
                    } else {
                        $('div.loader-parent').css('display', 'none');
                        swal('Không tìm thấy', 'Tài khoản không tồn tại', 'error');
                        $('div#search-page').css('display', '');
                        glob_submit = false;
                    }
                }
            });
        }
    } else
        userExecuteMaliciousScript();
}

function userExecuteMaliciousScript() {
    swal('WARNING!!!', 'You are trying to executed malicious script, stop it!!!', 'error');
    $('div#profile-page').attr('style', 'display: none !important');
}