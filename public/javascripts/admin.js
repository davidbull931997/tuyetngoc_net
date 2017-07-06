$(() => {
    if ($(window).width() < 992) {
        swal({
            title: 'Không tương thích',
            type: 'error',
            text: 'Ứng dụng không hoạt động trên thiết bị di động',
            showConfirmButton: false,
            showCloseButton: false,
            showCancelButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false
        });
    } else {
        setTimeout(function () {
            $('div.loader-parent').fadeOut(400, () => {
                $('div#login-page').css('display', '');
            });
        }, 1500);
        swal.setDefaults({
            allowOutsideClick: false,
            allowEscapeKey: false
        });
        let date = new Date();
        $('p.text-center.copy-right').append(date.getFullYear());
    }
});

$(window).resize(() => {
});

$(window).on('unload', () => {
    if ($('div#manage-page').css('display') == 'block') {
        $.post({ url: '/admin/adminUnLoad', async: false });
    }
});

$('a#login-btn').click((e) => {
    checkInput();
    return false;
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
            $('body').animate({ scrollTop: $('#' + vue.$data.customerList[i]._id).offset().top - $('#fixed-thead').height() });
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
    var updateding = false;
    for (i = 1; i <= $('tbody#vue > tr').length; i++) {
        if ($('tbody#vue > tr:nth-child(' + i + ') > td:nth-child(7) > a:first-child').css('display') == 'inline-block') {
            updateding = true;
            break;
        }
    }
    if (!updateding) {
        vex.dialog.open({
            overlayClosesOnClick: false,
            appendLocation: '#manage-page',
            message: 'Thêm mới khách hàng:',
            input: [
                `<label for><input name="customerName" type="text" placeholder="Tên khách hàng" required />`,
                `<input name="customerPoint" min=1 oninput="checkPlayTime1();" type="number" placeholder="Điểm" required />`,
                `<label class="col-xs-4" style="font-weight:normal;">Mốc nhận quà:</label>
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
                $.extend({}, vex.dialog.buttons.YES, { text: 'Thêm' }),
                $.extend({}, vex.dialog.buttons.NO, { text: 'Hủy' })
            ],
            callback: function (data) {
                if (data) {
                    var exist = false;
                    for (i = 0; i < vue.$data.customerList.length; i++) {
                        if (data.customerName == vue.$data.customerList[i].username) {
                            vex.dialog.alert({
                                message: 'Tên khách hàng đã tồn tại!',
                                overlayClosesOnClick: false,
                                appendLocation: '#manage-page',
                                callback: (value) => {
                                    if (value) {
                                        addNewCustomer();
                                    }
                                }
                            });
                            exist = true;
                            break;
                        }
                    }
                    if (!exist) {
                        var reward = ["30", "50", "70", "80", "100", "111"],
                            newUser = {
                                username: "",
                                playtime: 0,
                                release_card_day: '',
                                expire_card_day: '',
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
                        $.get('//api.timezonedb.com/v2/get-time-zone?key=UWMROEOGW3ST&format=json&by=zone&zone=Asia/Ho_Chi_Minh', (result) => {
                            newUser.release_card_day = new Date(result.timestamp * 1000).toLocaleDateString();
                            newUser.expire_card_day = new Date((result.timestamp + 5184000) * 1000).toLocaleDateString();
                            $.post('/admin/newUser', newUser, (_id) => {
                                swal.hideLoading();
                                swal('Thành công', 'Đã thêm khách hàng!', 'success');
                                newUser._id = _id;
                                vue.$data.customerList.push(newUser);
                                vue.$data.customerList.sort((a, b) => b["playtime"] - a["playtime"]);
                            });
                        });
                    }
                }
            }
        });
    }
}

function removeCustomer(_id) {
    swal({
        title: 'Bạn có chắc chắn?',
        text: "Bạn không thể hoàn tác khi đã thực hiện xóa !",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy bỏ'
    }).then(function () {
        swal({ padding: 30 });
        swal.showLoading();
        $.post('/admin/removeUser', { _id: _id }).done(() => {
            swal.hideLoading();
            swal('Thành công', 'Đã xóa khách hàng!', 'success');
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
        resizeFixedTableHead();
    }
}

function saveUpdateCustomer(_id) {
    for (i = 0; i < vue.$data.customerList.length; i++) {
        var tempReward = [];
        if (_id == vue.$data.customerList[i]._id) {
            $('#' + _id + ' > td:nth-child(6) > input').each((index, element) => {
                if (vue.$data.customerList[i].reward[index] == $(element).is(':checked').toString())
                    tempReward[index] = true;
                else
                    tempReward[index] = false;
            });
            if (($('tr#' + _id + ' > td:nth-child(2) > input').val() == vue.$data.customerList[i].playtime || $('tr#' + _id + ' > td:nth-child(2) > input').val() == '') &&
                ($('tr#' + _id + ' > td:nth-child(5) > input').val() == vue.$data.customerList[i].card_quantity || $('tr#' + _id + ' > td:nth-child(5) > input').val() == '') &&
                (tempReward[0] == true && tempReward[1] == true && tempReward[2] == true && tempReward[3] == true && tempReward[4] == true && tempReward[5] == true)) {
                $('tr#' + _id + ' > td:nth-child(2) > input').remove();
                $('tr#' + _id + ' > td:nth-child(5) > input').remove();
                $('tr#' + _id + ' > td:nth-child(2) > p').css('display', 'block');
                $('tr#' + _id + ' > td:nth-child(5) > p').css('display', 'block');
                $('tr#' + _id + ' > td:nth-child(7) > a:nth-child(1)').css('display', 'none');
                $('tr#' + _id + ' > td:nth-child(7) > a:nth-child(2)').css('display', 'inline-block');
                $('tr#' + _id + ' > td:nth-child(6) > input').css('cursor', 'default').attr('disabled', true);
                resizeFixedTableHead();
                break;
            }
            else {
                vue.$data.customerList[i].playtime = $('tr#' + _id + ' > td:nth-child(2) > input').val();
                vue.$data.customerList[i].card_quantity = $('tr#' + _id + ' > td:nth-child(5) > input').val();
                $('#' + _id + ' > td:nth-child(6) > input').each((index, element) => {
                    vue.$data.customerList[i].reward[index] = $(element).is(':checked').toString();
                });
                swal({ padding: 30 });
                swal.showLoading();
                $.post('/admin/updateUser', vue.$data.customerList[i], () => {
                    swal.hideLoading();
                    swal('Thành công', 'Đã cập nhật thành công thông tin khách hàng!', 'success');
                    $('tr#' + _id + ' > td:nth-child(2) > input').remove();
                    $('tr#' + _id + ' > td:nth-child(5) > input').remove();
                    $('tr#' + _id + ' > td:nth-child(2) > p').css('display', 'block');
                    $('tr#' + _id + ' > td:nth-child(5) > p').css('display', 'block');
                    $('tr#' + _id + ' > td:nth-child(7) > a:nth-child(1)').css('display', 'none');
                    $('tr#' + _id + ' > td:nth-child(7) > a:nth-child(2)').css('display', 'inline-block');
                    $('tr#' + _id + ' > td:nth-child(6) > input').css('cursor', 'default').attr('disabled', true);
                    vue.$data.customerList.sort((a, b) => b["playtime"] - a["playtime"]);
                    resizeFixedTableHead();
                });
                break;
            }
        }
    }
}

function checkInput() {
    if ($('input#username').val() == '' || $('input#password').val() == '')
        swal(
            'Oops...',
            'Vui lòng nhập tài khoản và mật khẩu',
            'warning'
        )
    else {
        $.post('admin/adminLogin', {
            username: $('input#username').val(),
            password: $('input#password').val()
        }, (result) => {
            if (result.status) {
                $('div#login-page').css('display', 'none');
                $('div.loader-parent').css('display', '');
                $('div#manage-page').css('visibility', 'hidden').fadeIn(400, () => {
                    $('input#username').val('');
                    $('input#password').val('');
                    $('#custom-search-input > div > input').height($('#custom-search-input > div > input').height() - 4);
                    $('#custom-search-input > div > span > button').height($('#add-new-btn').height() + 18);
                    resizeFixedTableHead();
                    $('div.loader-parent').fadeOut(400, () => {
                        $('div#manage-page').css('visibility', '');
                    });
                });
            }
            else {
                if (result.code == 2)
                    swal(
                        'Oops...',
                        'Tài khoản hoặc mật khẩu sai!',
                        'error'
                    )
                else
                    swal(
                        'Oops...',
                        'Tài khoản đang được sử dụng !',
                        'error'
                    )
            }
        });
    }
}

function resizeFixedTableHead() {
    $('#fixed-thead > tr:nth-child(1) > th').width($('#manage-page > div > div > table > thead:nth-child(2) > tr:nth-child(1) > th').width());
    for (i = 0; i < 7; i++) {
        $('#fixed-thead > tr:nth-child(2) > th:nth-child(' + i + ')').width($('#manage-page > div > div > table > thead:nth-child(2) > tr:nth-child(2) > th:nth-child(' + i + ')').width());
    }
}