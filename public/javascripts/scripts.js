$(() => {
    $('#reg-page').css('margin-top', ($(window).height() / 2) - ($('#reg-page').height() / 2));
    let date = new Date();
    $('p.text-center#copy-right').append(date.getFullYear());
    $('#account-name').tooltip({
        trigger: 'manual'
    });
});

$(window).resize(() => {
    $('#reg-page').css('margin-top', ($(window).height() / 2) - ($('#reg-page').height() / 2));
});

$('#account-name').keypress((e) => {
    if (e.keyCode == 13) {
        console.log('press enter');
        checkInput();
        return false;
    }
});

$('#account-btn').click(() => {
    console.log('click');
    checkInput();
    return false;
});

function checkInput() {
    if ($('#account-name').val() == '' || $('#account-name').val().length == 0) {
        $('#account-name').tooltip('show');
        setTimeout(function () {
            $('#account-name').tooltip('hide');
        }, 2000);
    }
    else {
        $.post('/getUser', $('#account-name').val().toUpperCase(), (data) => {
            console.log(data.flag + '\n' + data.user);
        });
    }
}