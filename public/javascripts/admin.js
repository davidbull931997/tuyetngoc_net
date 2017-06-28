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

$(window).on('beforeunload', () => {
    if ($('div#manage-page').css('display') == 'block') {
        $.post('/admin/adminUnLoad');
        return null;
    }
});

$('button#login-btn').click((e) => {
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
    $('#manage-page > div > table > tbody').append(`
    <tr id='temp-user' style='display:none;'>
        <td>
            <input type='text' id='temp-username' placeholder='New username' data-toggle="tooltip" data-placement="top" title="Please input username" style='width:100%'>
        </td>
        <td>
            <input oninput='checkPlayTime();' type='number' step=1 min=1 id='temp-play-time' placeholder='Point' data-toggle="tooltip1" data-placement="top" title="Please input play time" style='width:100%'>
        </td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>
            <input type="checkbox" id="temp-reward30">
            <label for="temp-reward30">30</label>
            <input type="checkbox" id="temp-reward50">
            <label for="temp-reward50">50</label>
            <input type="checkbox" id="temp-reward70">
            <label for="temp-reward70">70</label>
            <br>
            <input type="checkbox" id="temp-reward80">
            <label for="temp-reward80">80</label>
            <input type="checkbox" id="temp-reward100">
            <label for="temp-reward100">100</label>
            <input type="checkbox" id="temp-reward111">
            <label for="temp-reward111">111</label></td>
        <td>
            <a id='temp-btn-add' href='javascript:void(0);' onclick='addCustomer();' class='material-icons' style='text-decoration:none;color:lightgreen;'>check_circle</a>
            <a id='temp-btn-cancel' href='javascript:void(0);' onclick='removeTemp();' class='material-icons' style='text-decoration:none;color:red'>close</a>
        </td>
    </tr>
    `);
    $('tr#temp-user').fadeIn();
});

function checkPlayTime() {
    if (parseInt($('input#temp-play-time').val()) <= 0) {
        $('input#temp-play-time').val(1);
        $('input#temp-play-time').select();
    }
}

function removeTemp() {
    $('#temp-user').fadeOut(400, () => {
        $('#temp-user').remove();
    });
}

function addCustomer() {
    var exist = false;
    for (i = 0; i < vue.$data.customerList.length; i++) {
        if ($('input#temp-username').val() == vue.$data.customerList[i].username) {
            exist = true;
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
    else if (exist == true)
        swal('Oops...!', 'The username availabled!', 'warning');
    else {
        $('#temp-user').fadeOut(400, () => {
            newUser = {
                username: $('input#temp-username').val(),
                playtime: parseInt($('input#temp-play-time').val()),
                release_card_day: moment().tz('Asia/Ho_Chi_Minh').format('L'),
                expire_card_day: moment().add(60, 'days').calendar(),
                card_quantity: 1,
                reward: []
            };
            $('#temp-user > td:nth-child(6) > input').each((index, element) => {
                newUser.reward[index] = $(element).is(':checked').toString();
            });
            swal({ padding: 30 });
            swal.showLoading();
            $.post('/admin/newUser', newUser, (_id) => {
                swal.hideLoading();
                swal('Sucess', 'The user has been added!', 'success');
                newUser._id = _id;
                vue.$data.customerList.push(newUser);
            });
            $('#temp-user').remove();
            $('#manage-page > div > table > tbody > tr:last-child').fadeIn();
        });
    }
}

function removeCustomer(_id) {
    swal({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then(function () {
        swal({ padding: 30 });
        swal.showLoading();
        $.post('/admin/removeUser', { _id: _id }).done(() => {
            swal.hideLoading();
            swal('Deleted', 'The customer has been deleted!', 'success');
            for (i = 0; i < vue.$data.customerList.length; i++) {
                if (vue.$data.customerList[i]._id == _id) {
                    vue.$data.customerList.splice(i, 1);
                    break;
                }
            }
        });
    }).catch(swal.noop);
}

function updateCustomer(_id) {
    var exist = false;
    for (i = 1; i <= $('tbody#vue > tr').length; i++) {
        if ($('tbody#vue > tr:nth-child(' + i + ') > td:nth-child(7) > a:first-child').css('display') == 'inline-block') {
            exist = true;
            break;
        }
    }
    if (!exist) {
        var value = {
            point: parseInt($('tr#' + _id + ' > td:nth-child(2)').text()),
            card_quantity: parseInt($('tr#' + _id + ' > td:nth-child(5)').text()),
        }
        $('tr#' + _id + ' > td:nth-child(2) > p').css('display', 'none');
        $('tr#' + _id + ' > td:nth-child(5) > p').css('display', 'none');
        $('tr#' + _id + ' > td:nth-child(2)').append('<input type="number" step="1" value=' + value.point + ' min="1">');
        $('tr#' + _id + ' > td:nth-child(5)').append('<input type="number" step="1" value=' + value.card_quantity + ' min="1">');
        $('tr#' + _id + ' > td:nth-child(6) > input').css('cursor', '').removeAttr('disabled');
        $('tr#' + _id + ' > td:nth-child(7) > a:nth-child(2)').css('display', 'none');
        $('tr#' + _id + ' > td:nth-child(7) > a:nth-child(1)').css('display', 'inline-block');
    }
}

function saveUpdateCustomer(_id) {
    for (i = 0; i < vue.$data.customerList.length; i++) {
        if (_id == vue.$data.customerList[i]._id) {
            vue.$data.customerList[i].playtime = $('tr#' + _id + ' > td:nth-child(2) > input').val();
            vue.$data.customerList[i].card_quantity = $('tr#' + _id + ' > td:nth-child(5) > input').val();
            $('#' + _id + ' > td:nth-child(6) > input').each((index, element) => {
                vue.$data.customerList[i].reward[index] = $(element).is(':checked').toString();
            });
            swal({ padding: 30 });
            swal.showLoading();
            $.post('/admin/updateUser', vue.$data.customerList[i], () => {
                swal.hideLoading();
                swal('Updated', 'The customer information has been updated!', 'success');
                $('tr#' + _id + ' > td:nth-child(2) > input').remove();
                $('tr#' + _id + ' > td:nth-child(5) > input').remove();
                $('tr#' + _id + ' > td:nth-child(2) > p').css('display', 'block');
                $('tr#' + _id + ' > td:nth-child(5) > p').css('display', 'block');
                $('tr#' + _id + ' > td:nth-child(7) > a:nth-child(1)').css('display', 'none');
                $('tr#' + _id + ' > td:nth-child(7) > a:nth-child(2)').css('display', 'inline-block');
                $('tr#' + _id + ' > td:nth-child(6) > input').css('cursor', 'default').attr('disabled', true);
            });
            break;
        }
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
                $('div#login-page').fadeOut(400, () =>
                    $('div#manage-page').fadeIn(400, () => {
                        $('input#username').val('');
                        $('input#password').val('');
                    })
                );
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