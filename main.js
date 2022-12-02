window.addEventListener('load', () => {
    if (localStorage.getItem('selected')) {
        checkDates();
        checkItems();    

        load();
    } else {
        localStorage.setItem('list_general', JSON.stringify({}));
        localStorage.setItem('list_today', JSON.stringify({}));
        localStorage.setItem('list_upcoming', JSON.stringify({}));

        localStorage.setItem('selected', 'general');
        document.getElementById('list').innerHTML += 'list is empty... click the button in the bottom right to add items.';
    }
    
    //start clock functioning
    setTime();
});

function load() {
    document.getElementById('list').innerHTML = '';
    
    let save = JSON.parse(localStorage.getItem('list_' + localStorage.getItem('selected')));

    if (!save.items || save.items.length == 0) {
        document.getElementById('list').innerHTML += 'list is empty... click the button in the bottom right to add items.';
    } else {   
        save.items = sortByDate(save.items);

        for (let item in save.items) {
            let html = `
                <li name="${save.items[item].name}" order="${item}">
                    <div class="checkbox ${save.items[item].checked}" onClick="checkItem(event)"></div>
                    <span class="${save.items[item].checked}">${save.items[item].name}</span>

                    <svg xmlns="http://www.w3.org/2000/svg" onclick="deleteItem(event)"  width="20" height="20" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                    </svg>

                    <span class="date">${save.items[item].date}</span>

                    <hr class="focused">

                    <span class="focused" id="focus-${save.items[item].name}">

                        <p onclick="edit();">${save.items[item].description || 'description'}</p>
                    </span>
                </li>
            `;

            document.getElementById('list').innerHTML += html;
        }
    }

    for (let list in lists) {
        document.getElementById(lists[list]).classList = 'list-item';
    }

    document.getElementById(localStorage.getItem('selected')).classList += ' selected';
}
//edit list item
function edit() {
    if (selecting == 'items' && selectedItem != null) {
        let saved = JSON.parse(localStorage.getItem('list_' + localStorage.getItem('selected')));

        document.getElementById('item-name').value = saved.items[selectedItem].name;
        document.getElementById('item-description').value = saved.items[selectedItem].description;
        
        open('Submit');
    }
}

//open new list item popup
function open(type) {
    document.getElementById('popup').style.display = 'block';
    document.getElementById('item-name').select();

    if (localStorage.getItem('selected') == 'upcoming') {
        document.getElementById('date-input').style.display = 'block';
    } else {
        document.getElementById('date-input').style.display = 'none';
    }

    document.getElementById('submit-button').innerText = type || 'Create';
}

//close new list item popup
function close() {
    document.getElementById('popup').style.display = 'none';
    document.getElementById('item-name').value = '';
    document.getElementById('item-description').value = '';
}

//submit new list item popup
function submit() {
    let name = document.getElementById('item-name').value;
    let description = document.getElementById('item-description').value;

    if (!name) return alert('name is required');

    let save = JSON.parse(localStorage.getItem('list_' + localStorage.getItem('selected')));

    if (!save.items) save.items = [];

    if (document.getElementById('submit-button').innerText == 'Submit') {
        // editing item
        save.items[selectedItem].description = description;
        save.items[selectedItem].name = name;
    } else {
        // creating new item
        if (localStorage.getItem('selected') == 'today') {
            save.items.push({"name": name, "checked": false, "date": "", "description": description || ''});
        } else if (localStorage.getItem('selected') == 'general') {
            save.items.push({"name": name, "checked": false, "date": "", "description": description || ''});
        } else if (localStorage.getItem('selected') == 'upcoming') {
            let month = document.getElementById('month').value;
            let day = document.getElementById('day').value;
            let year = document.getElementById('year').value;
    
            if (!month || !day || !year) return alert('date is required');
    
            //check if date is valid
            if (!dateIsValid(year, month, day)) return alert('invalid date');
    
            //check is date is old
            if (!dateIsPast(month, day, year)) return alert('date cannot be in the past');
            
            let date = `${month}/${day}/${year}`;
    
            save.items.push({"name": name, "checked": false, "date": date, "description": description || ''});
        }
    }

    localStorage.setItem('list_' + localStorage.getItem('selected'), JSON.stringify(save));

    close();

    load();
}

//delete item from list
function deleteItem(e) {
    let name =  e.target.parentNode.getAttribute('name');
    let save = JSON.parse(localStorage.getItem('list_' + localStorage.getItem('selected')));

    let item = save.items.findIndex(element => element.name == name);

    if (item == -1) return console.log('error finding item');

    save.items.splice(item, 1);

    localStorage.setItem('list_' + localStorage.getItem('selected'), JSON.stringify(save));

    load();
}

//check item from list
function checkItem(e) {
    let name =  e.target.parentNode.getAttribute('name');
    let save = JSON.parse(localStorage.getItem('list_' + localStorage.getItem('selected')));

    let item = save.items.findIndex(element => element.name == name);

    if (item == -1) return console.log('error finding item');

    save.items[item].checked = !save.items[item].checked;

    localStorage.setItem('list_' + localStorage.getItem('selected'), JSON.stringify(save));

    load();
}

//switch selected list 
function switchList(e) {
    let list = e.target.id;

    localStorage.setItem('selected', list);

    load();
}

//clock
function setTime() {
    document.getElementById('clock').innerHTML =  getDate();
    setTimeout(setTime, 60 * 1000);
}

//handle outdated upcoming dates
function checkDates() {
    let saved = JSON.parse(localStorage.getItem('list_upcoming'));

    for (let item in saved.items) {
        let date = saved.items[item].date;

        // month/day/year
        let split = date.split('/')

        if (!dateIsPast(split[0], split[1], split[2])) {
            let today = JSON.parse(localStorage.getItem('list_today'));

            today.items.push({"name": saved.items[item].name, "checked": saved.items[item].checked, "date": ""});

            saved.items.splice(item, 1);

            localStorage.setItem('list_upcoming', JSON.stringify(saved));
            localStorage.setItem('list_today', JSON.stringify(today));
        }
    }
}

//handle removing check items
function checkItems() {
    for (let list in lists) {
        let saved = JSON.parse(localStorage.getItem('list_' + lists[list]));

        if (!saved.items) return;

        saved.items = saved.items.filter(ele => !ele.checked);

        localStorage.setItem('list_' + lists[list], JSON.stringify(saved));
    }
}

// display keybind info when keyboard icon clicked
function showControls() {
    openInfoModal(`
        'n' -> create new item <br>
        'escape' -> exit popup <br>
        'enter' -> submit <br>
        'left arrow' -> switch to sidebar navigation <br>
        'right arrow' -> switch to list item navigation <br>
        <b>sidebar navigation</b> <br>
        'up arrow' -> navigate to list above on sidebar <br>
        'down arrow' -> navigate to list below on sidebar <br>
        <b>list item navigation</b> <br>
        'up arrow' -> navigate to previous item <br>
        'down arrow' -> navigate to next item <br>
        'e' -> edit selected items description <br>
    `);
}