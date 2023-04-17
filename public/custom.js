function saveHoliday(e) {
    $('form#haform').submit();
    return;
}

function deleteHoliday(e) {
    $('form#haform,#action').val('delete');
    $('form#haform').submit();
    return;
}