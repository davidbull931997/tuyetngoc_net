$(() => {
    swal.setDefaults({
        allowOutsideClick: false,
        allowEscapeKey: false
    });
    $('#login-page').css('margin-top', ($(window).height() / 2) - ($('#login-page').height() / 2));
    let date = new Date();
    $('p.text-center#copy-right').append(date.getFullYear());
});

$(window).resize(() => {
    if ($('#login-page').css('display') == 'block')
        $('#login-page').css('margin-top', ($(window).height() / 2) - ($('#login-page').height() / 2));
    if ($('#manage-page').css('display') == 'block') {
        $('#search-bar').css({
            width: ($(window).width() - $('#manage-page > div.container').width()) / 2,
            top: $('#manage-page > div.container > div > table > thead').height() - $('#search-bar').height()
        });
        $('#search-bar').css({
            left: $(window).width() - $('#search-bar').width()
        });
    }
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
    if (e.keyCode == 13) checkInput();
});

$('input#password').keypress((e) => {
    if (e.keyCode == 13) checkInput();
});

$('#custom-search-input > div > span > button').click(() => {
    searchCustomer();
});

$('#custom-search-input > div > input').keypress((e) => {
    if (e.keyCode == 13) searchCustomer();
});

$('#add-new-btn').click(() => {
    addNewCustomer();
});

function checkPlayTime1() {
    if (parseInt($('#manage-page > div  > div.vex.vex-theme-wireframe > div.vex-content > form > div.vex-dialog-input > label > input[type="number"]:nth-child(2)').val()) <= 0) {
        $('#manage-page > div > div.vex.vex-theme-wireframe > div.vex-content > form > div.vex-dialog-input > label > input[type="number"]:nth-child(2)').val(1);
        $('#manage-page > div > div.vex.vex-theme-wireframe > div.vex-content > form > div.vex-dialog-input > label > input[type="number"]:nth-child(2)').select();
    }
}

function searchCustomer() {
    for (i = 0; i < vue.$data.customerList.length; i++) {
        if ($('#custom-search-input > div > input').val().toLowerCase() == vue.$data.customerList[i].username.toLowerCase()) {
            $('body').animate({ scrollTop: $('#' + vue.$data.customerList[i]._id).offset().top - ($(window).height() / 2) });
            setTimeout(function (_id) {
                $('#' + _id).css({
                    transition: '1s',
                    'background-color': '#5cd660'
                });
                setTimeout(function (_id) {
                    $('#' + _id).css({
                        'background-color': ''
                    });
                }, 1001, _id);
            }, 401, vue.$data.customerList[i]._id);
        }
    }
}

function addNewCustomer() {
    vex.dialog.open({
        overlayClosesOnClick: false,
        appendLocation: '#manage-page',
        message: 'Add new customers here:',
        input: [
            `<label for><input name="customerName" type="text" placeholder="Customer name" required />`,
            `<input name="customerPoint" min=1 oninput="checkPlayTime1();" type="number" placeholder="Point" required />`,
            `<label class="col-xs-4" style="font-weight:normal;">Reward</label>
			<div class="col-xs-8">
                <div class="pull-right">
                    <input type="checkbox" name="customerReward30">
                    <label for="customerReward30">30</label>
                    <input type="checkbox" name="customerReward50">
                    <label for="customerReward50">50</label>
                    <input type="checkbox" name="customerReward70">
                    <label for="customerReward70">70</label>
                    <br>
                    <input type="checkbox" name="customerReward80">
                    <label for="customerReward80">80</label>
                    <input type="checkbox" name="customerReward100">
                    <label for="customerReward100">100</label>
                    <input type="checkbox" name="customerReward111">
                    <label for="customerReward111">111</label>
                </div>
			</div>`
        ].join(''),
        buttons: [
            $.extend({}, vex.dialog.buttons.YES, { text: 'Add' }),
            $.extend({}, vex.dialog.buttons.NO, { text: 'Cancel' })
        ],
        callback: function (data) {
            if (data) {
                var exist = false;
                for (i = 0; i < vue.$data.customerList.length; i++) {
                    if (data.customerName == vue.$data.customerList[i].username) {
                        vex.dialog.alert({
                            message: 'The customer name existed!',
                            overlayClosesOnClick: false,
                            appendLocation: '#manage-page',
                            callback: (value) => {
                                if (value) {
                                    addNewCustomer();
                                }
                            }
                        });
                        //console.log(vex.getAll());
                        exist = true;
                        break;
                    }
                }
                if (!exist) {
                    var reward = ["30", "50", "70", "80", "100", "111"],
                        newUser = {
                            username: "",
                            playtime: 0,
                            release_card_day: moment().tz('Asia/Ho_Chi_Minh').format('L'),
                            expire_card_day: moment().add(60, 'days').calendar(),
                            card_quantity: 1,
                            reward: ["false", "false", "false", "false", "false", "false"]
                        };
                    newUser.username = data.customerName;
                    newUser.playtime = data.customerPoint;
                    for (i = 0; i < reward.length; i++) {
                        if (data["customerReward" + reward[i]] == "on") {
                            newUser.reward[i] = "true";
                        } else {
                            newUser.reward[i] = "false";
                        }
                    }
                    swal({ padding: 30 });
                    swal.showLoading();
                    $.post('/admin/newUser', newUser, (_id) => {
                        swal.hideLoading();
                        swal('Sucess', 'The user has been added!', 'success');
                        newUser._id = _id;
                        vue.$data.customerList.push(newUser);
                        vue.$data.customerList.sort((a, b) => b["playtime"] - a["playtime"]);
                    });
                }
            }
        }
    });
    $('#manage-page > div > div.vex.vex-theme-wireframe > div.vex-content > form > div.vex-dialog-input > label > input[type="text"]:nth-child(1)').blur();
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
            vue.$data.customerList.sort((a, b) => b["playtime"] - a["playtime"]);
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
        $.post('admin/adminLogin', {
            username: $('input#username').val(),
            password: $('input#password').val()
        }, (result) => {
            if (result.status) {
                $('div#login-page').fadeOut(400, () =>
                    $('div#manage-page').fadeIn(400, () => {
                        $('input#username').val('');
                        $('input#password').val('');
                        $('#search-bar').css({
                            width: ($(window).width() - $('#manage-page > div.container').width()) / 2,
                            top: $('#manage-page > div.container > div > table > thead').height() - $('#search-bar').height()
                        });
                        $('#search-bar').css({
                            left: $(window).width() - $('#search-bar').width()
                        });
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