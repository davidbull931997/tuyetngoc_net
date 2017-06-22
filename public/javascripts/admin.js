$(() => {
    swal.setDefaults({
        allowOutsideClick: false,
        allowEscapeKey: false
    });
    $('#login-page').css('margin-top', ($(window).height() / 2) - ($('#login-page').height() / 2));
    let date = new Date();
    $('p.text-center#copy-right').append(date.getFullYear());
    //$('#manage-page > div > table > thead > tr:nth-child(2) > th').css('width', '20%');
});

$(window).resize(() => {
    $('#login-page').css('margin-top', ($(window).height() / 2) - ($('#login-page').height() / 2));
});

$(window).on('beforeunload', () => $.post('/admin/adminUnLoad'));

$('button#login-btn').click((e) => {
    // e.preventDefault();
    checkInput();
});

$('input#username').keypress((e) => {
    if (e.keyCode == 13) checkInput()
});

$('input#password').keypress((e) => {
    if (e.keyCode == 13) checkInput()
});

$('#add-new-btn').click(() => {
    if ($('#temp-user').length) return;
    $('#manage-page > div > table > thead > tr:nth-child(2)').append('<th style="border-top:0;">Action</th>');
    $('#manage-page > div > table > tbody').append(`
    <tr id='temp-user'>
        <td>
            <input type='text' id='temp-username' placeholder='New username' data-toggle="tooltip" data-placement="top" title="Please input username" style='width:100%'>
        </td>
        <td>
            <input onchange='checkPlayTime();' oninput='checkPlayTime();' type='number' step=1 id='temp-play-time' placeholder='Play time' data-toggle="tooltip1" data-placement="top" title="Please input play time" style='width:100%'>
        </td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>
            <a id='temp-btn-add' href='javascript:void(0);' onclick='addTemp();' class='material-icons' style='text-decoration:none;color:lightgreen;'>check_circle</a>
            <a id='temp-btn-cancel' href='javascript:void(0);' onclick='removeTemp();' class='material-icons' style='text-decoration:none;color:red'>close</a>
        </td>
    </tr>
    `);
});

function checkPlayTime() {
    if (parseInt($('input#temp-play-time').val()) <= 0)
        $('input#temp-play-time').val(0);
}

function removeTemp() {
    $('#temp-user').fadeOut(400, () => {
        $('#temp-user').remove();
        $('#manage-page > div > table > thead > tr:nth-child(2) > th:last-child').remove();
    });
}

function addTemp() {
    var exist = false;
    for (i = 0; i < vue.$data.customerList.length; i++) {
        if ($('input#temp-username').val() == vue.$data.customerList[i].username) {
            exist = true;
            console.log('existed');
            break;
        }
    }
    if ($('input#temp-username').val() == '') {
        $('[data-toggle="tooltip"]').tooltip({
            trigger: 'manual'
        }).tooltip('show');
        setTimeout(function () {
            $('[data-toggle="tooltip"]').tooltip('hide');
        }, 2000);
    }
    else if ($('input#temp-play-time').val() == '') {
        $('[data-toggle="tooltip1"]').tooltip({
            trigger: 'manual'
        }).tooltip('show');
        setTimeout(function () {
            $('[data-toggle="tooltip1"]').tooltip('hide');
        }, 2000);
    }
    else if (exist == true) {
        swal('Oops...!', 'The username availabled!', 'warning');
    }
    else {
        $('#temp-user').fadeOut(400, () => {
            var unixNow = Date.now(),
                expire = new Date(unixNow + 5184000000).toLocaleDateString(),
                now = new Date(unixNow).toLocaleDateString();
            newUser = {
                username: $('input#temp-username').val(),
                playtime: parseInt($('input#temp-play-time').val()),
                release_card_day: now,
                expire_card_day: expire,
                card_quantity: 1
            }
            swal.showLoading();
            $.post('/admin/newUser', newUser, () => {
                swal.hideLoading();
                swal('Sucess', 'The user has been added!', 'success');
                vue.$data.customerList.push(newUser);
            });
            $('#temp-user').remove();
            $('#manage-page > div > table > thead > tr:nth-child(2) > th:last-child').remove();
            $('#manage-page > div > table > tbody > tr:last-child').fadeIn();

        });
    }
}

function checkInput() {
    if ($('input#username').val() == '' || $('input#password').val() == '')
        swal(
            'Oops...',
            'Please input username and password',
            'warning'
        )
    else {
        //swal.showLoading();
        $.post('admin/adminLogin', {
            username: $('input#username').val(),
            password: $('input#password').val()
        }, (result) => {
            //swal.hideLoading();
            if (result.status) {
                $('div#login-page').fadeOut(400, () => {
                    $('div#manage-page').fadeIn();
                });
            }
            else {
                if (result.code == 2)
                    swal(
                        'Oops...',
                        'Something went wrong!',
                        'error'
                    )
                else
                    swal(
                        'Oops...',
                        'Admin account is using (Logged)!',
                        'error'
                    )
            }
        });
    }
}