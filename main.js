let storage = new Storage();

window.addEventListener('load', () => 
{
    checkDates();
    checkItems();    

    load();
    
    // init date in top right of screen
    document.getElementById('clock').innerHTML = getDate();
});

function load() 
{
    document.getElementById('list').innerHTML = '';
    document.getElementById('topics').innerHTML = '';
    
    let save = storage.data.hasOwnProperty(storage.data.selected) ? storage.data[storage.data.selected] : storage.data.topics[storage.data.selected];

    if (!save || save.length == 0) 
    {
        // there are no items in the selected list, alert user
        document.getElementById('list').innerHTML += '<p style="margin: 5px">list is empty... click the button in the bottom right to add items.</p>';
    } 
    else 
    {
        save = sortByDate(save);

        for (let item in save) 
        {
            let html = `
                <li name="${save[item].name}" order="${item}">
                    <div class="checkbox ${save[item].checked}" onClick="checkItem(event)"></div>
                    <span class="${save[item].checked}">${save[item].name}</span>

                    <svg id="delete" xmlns="http://www.w3.org/2000/svg" onclick="deleteItem(event)"  width="20" height="20" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                    </svg>

                    <span class="date">${save[item].date}</span>

                    <hr class="focused">

                    <span class="focused" id="focus-${save[item].name}">

                        <p onclick="edit();">${save[item].description || 'description'}</p>
                        <svg style="margin-right: -160px; margin-top: -35px;" onclick="edit();" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                        </svg>
                    </span>
                </li>
            `;

            document.getElementById('list').innerHTML += html;
        }
    }

    let topics = Object.keys(storage.data.topics);

    for (let topic in topics) 
    {
        // add all the topics the user has created to the sidebar
        document.getElementById('topics').innerHTML += `
            <p class="selectableItem" onclick="switchList(event);" id="${topics[topic]}">${topics[topic]}</p>
        `;
    }

    // underline the selected list on the sidebar
    document.getElementById(storage.data.selected).classList += ' selected';
}


function edit() 
{
    // edit a already created item
    if (selecting == 'items' && selectedItem != null) 
    {
        // get the list that is currently selected, depending on whether it is user created or not
        let saved = storage.data.hasOwnProperty(storage.data.selected) ? storage.data[storage.dataselected] : storage.data.topics[storage.data.selected];

        // add the item's current data to the input fields
        document.getElementById('item-name').value = saved[selectedItem].name;
        document.getElementById('item-description').value = saved[selectedItem].description;
        
        open('Submit');
    }
}
function open(type) 
{
    // open the list item popup
    document.getElementById('popup').style.display = 'block';
    document.getElementById('item-name').select();

    if (storage.data.selected == 'upcoming') 
    {
        // we are creating an upcoming item, display the date input element
        document.getElementById('date-input').style.display = 'block';
    } 
    else 
    {
        // otherwise hide the dateinput element
        document.getElementById('date-input').style.display = 'none';
    }

    // submit-bottom text will say submit when editing and create when creating a new item
    document.getElementById('submit-button').innerText = type || 'Create';
}
function close() 
{
    // close list item popup
    document.getElementById('popup').style.display = 'none';
    document.getElementById('item-name').value = '';
    document.getElementById('item-description').value = '';
}

function submit() 
{
    // submit list item popup
    let selected = storage.data.selected;
    let name = document.getElementById('item-name').value;
    let description = document.getElementById('item-description').value;

    if (!name) return alert('name is required');

    if (document.getElementById('submit-button').innerText == 'Submit') 
    {
        // editing item
        if (storage.data.hasOwnProperty(selected))
        {
            // editing an item in a base default list
            storage.data[selected][selectedItem].description = description;
            storage.data[selected][selectedItem].name = name;
        }
        else
        {
            // editing an item in a user created topic
            storage.data.topics[selected][selectedItem].description = description;
            storage.data.topics[selected][selectedItem].name = name;
        }
    } 
    else 
    {
        // creating new item
        if (selected == 'today' || selected == 'general') 
        {
            storage.addItem(selected, name, '', description);
        } 
        else if (selected == 'upcoming') 
        {
            let month = document.getElementById('month').value;
            let day = document.getElementById('day').value;
            let year = document.getElementById('year').value;
    
            if (!month || !day || !year) return alert('date is required');
    
            //check if date is valid
            if (!dateIsValid(year, month, day)) return alert('invalid date');
    
            //check is date is old
            if (!dateIsPast(month, day, year)) return alert('date cannot be in the past');
            
            let date = `${month}/${day}/${year}`;

            storage.addItem(selected, name, date, description);    
        }
        else
        {
            storage.addItem(selected, name, '', description);  
        }
    }

    close();

    load();
}

function deleteItem(e) 
{
    // delete item from list
    let name = e.target.parentNode.getAttribute('name');

    let activeList = storage.data.selected;

    if (storage.data.hasOwnProperty(activeList))
    {
        // item is within default lists, remove
        let item = storage.data[activeList].find(element => element.name == name);
        storage.data[activeList].splice(storage.data[activeList].indexOf(item), 1);
    } 
    else if (storage.data.topics.hasOwnProperty(activeList))
    {
        // element is within user defined lists, remove
        let item = storage.data.topics[activeList].find(element => element.name == name);
        storage.data.topics[activeList].splice(storage.data.topics[activeList].indexOf(item), 1);
    }
    else
    {
        // cannot find element within any lists, fail
        // this should never happen
        console.log('error finding item');
    }

    load();
}
function checkItem(e) 
{
    // check item from list
    let name =  e.target.parentNode.getAttribute('name');

    let activeList = storage.data.selected;

    if (storage.data.hasOwnProperty(activeList))
    {
        // item is within default lists, remove
        let item = storage.data[activeList].find(element => element.name == name);
        let index = storage.data[activeList].indexOf(item);

        storage.data[activeList][index].checked = !storage.data[activeList][index].checked;
    } 
    else if (storage.data.topics.hasOwnProperty(activeList))
    {
        // element is within user defined lists, remove
        let item = storage.data.topics[activeList].find(element => element.name == name);
        let index = storage.data.topics[activeList].indexOf(item);

        storage.data.topics[activeList][index].checked = !storage.data.topics[activeList][index].checked;
    }
    else
    {
        // cannot find element within any lists, fail
        // this should never happen
        console.log('error finding item');
    }

    load();
}

function switchList(e) {
    // switch selected list

    document.querySelectorAll('.selectableItem').forEach((ele) => 
    {
        // this is a bit of a workaround for removing selected from an item
        // we just string replace it with t instead which will leave t class
        // scattered in classes that have been unselected...
        // this shouldn't impact anything else
        ele.classList.replace('selected', 't');
    });
    
    if (typeof e === 'object' && 'target' in e)
    {
        // called from a click event
        storage.data.selected = e.target.id;
    }
    else
    {
        // called from a keyboard input event
        storage.data.selected = e;
    }

    load();
}

//handle outdated upcoming dates
function checkDates() {
    let saved = storage.data.upcoming;

    for (let item in saved) {
        let date = saved[item].date;

        // month/day/year
        let split = date.split('/')

        if (!dateIsPast(split[0], split[1], split[2])) {

            storage.data.today.push({"name": saved[item].name, "checked": saved[item].checked, "date": ""});

            storage.data.upcoming.splice(item, 1);
        }
    }
}

// handle removing check items
function checkItems() {
    for (let list of storage.lists) {

        if (storage.data.hasOwnProperty(list))
        {
            let curList = storage.data[list];

            curList = curList.filter(ele => !ele.checked);

            storage.data[list] = curList;
        }
        else if (storage.data.topics.hasOwnProperty(list))
        {
            let curList = storage.data.topics[list];

            curList = curList.filter(ele => !ele.checked);

            storage.data.topics[list] = curList;
        }
    }
}

//create new topic
function newTopic() {
    let name = prompt('Enter a name for your new topic', '');

    if (name == null || name == '') return;

    if (storage.data.topics.hasOwnProperty(name)) {
        return alert('topic already exists');
    }

    storage.data.topics[name] = [];

    load();
}