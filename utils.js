function getDate() 
{
    const today = new Date();

    let y = today.getFullYear();
    let mo = today.getMonth() + 1;
    let d = today.getDate();

    return `${mo}/${d}/${y}`
}

function checkTime(i) 
{
    if (i < 10) {i = '0' + i};  // add zero in front of numbers < 10
    return i;
}

//check if valid date -- will break on febuary leap years
function dateIsValid(year, month, day)
{
    if (isNaN(year) || isNaN(month) ||isNaN(day)) return false;

    if (month > 12 || month < 1) return false;

    if (day < 1) return false;

    if (month == 1 && day > 31) return false;
    if (month == 2 && day > 28) return false;
    if (month == 3 && day > 31) return false;
    if (month == 4 && day > 30) return false;
    if (month == 5 && day > 31) return false;
    if (month == 6 && day > 30) return false;
    if (month == 7 && day > 31) return false;
    if (month == 8 && day > 31) return false;
    if (month == 9 && day > 30) return false;
    if (month == 10 && day > 31) return false;
    if (month == 11 && day > 30) return false;
    if (month == 12 && day > 31) return false;

    // year will break after 3000 shouldn't be a problem for a long while
    if (year < 1000 || year > 3000) return false;

    return true;
}

//check if date is in the past
function dateIsPast(month, day, year) 
{
    const today = new Date();

    let y = today.getFullYear();
    let mo = today.getMonth() + 1;
    let d = today.getDate();

    if (year < y) return false;
    if (year == y && month < mo) return false;
    if (year == y && month == mo && day <= d) return false;

    return true;
}

function sortByDate(list) 
{
    return list.sort((b, a) => new Date(b.date) - new Date(a.date))
}