$(() => {
    $('#reg-page').css('margin-top', ($(window).height() / 2) - ($('#reg-page').height() / 2));
    let date = new Date();
    $('p.text-center#copy-right').append(date.getFullYear());
});

$(window).resize(() => {
    $('#reg-page').css('margin-top', ($(window).height() / 2) - ($('#reg-page').height() / 2));
});