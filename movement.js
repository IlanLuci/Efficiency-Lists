let selecting = 'lists';
let selectedItem;
let descriptionOpen = false;
let lists = [
    'general',
    'today',
    'upcoming'
];

document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() == 'n' && document.getElementById('popup').style.display != 'block' && descriptionOpen == false) {
        e.preventDefault();

        openNewPopup();
    } else if (e.key.toLowerCase() == 'N' && document.getElementById('popup').style.display != 'block' && descriptionOpen == false) {
        e.preventDefault();

        openNewPopup();
    }  else if (e.key == 'Escape' && document.getElementById('popup').style.display == 'block') {
        closeNewPopup();
    } else if (e.key == 'Enter' && document.getElementById('popup').style.display == 'block'  && descriptionOpen == false) {
        submitNewPopup();
    } else if (e.key == 'ArrowLeft'  && descriptionOpen == false) {
        selecting = 'lists';

        document.querySelectorAll('li').forEach((item) => {
            document.getElementById('focus-' + item.getAttribute('name')).style.display = 'none';
        });

        selectedItem = null;
    } else if (e.key == 'ArrowRight'  && descriptionOpen == false) {
        selecting = 'items';
    } else if (e.key == 'ArrowUp' && descriptionOpen == false) {
        if (selecting == 'lists') {
            let selected = localStorage.getItem('selected');

            if (lists.indexOf(selected) == 0) return;
    
            localStorage.setItem('selected', lists[lists.indexOf(selected) - 1]);
    
            load();
        } else if (selecting == 'items') {
            if (document.querySelectorAll('li').length == 0) return;

            if (selectedItem == null) {
                //select first item
                selectedItem = 0;
            } else if (selectedItem > 0) {
                selectedItem -= 1;
            }

            document.querySelectorAll('li').forEach((item) => {
                if (item.getAttribute('order') == selectedItem) document.getElementById('focus-' + item.getAttribute('name')).style.display = 'block';
                else document.getElementById('focus-' + item.getAttribute('name')).style.display = 'none';
            });
        }
    } else if (e.key == 'ArrowDown' && descriptionOpen == false) {
        if (selecting == 'lists') {
            let selected = localStorage.getItem('selected');

            if (lists.indexOf(selected) == lists.length - 1) return;
            
            localStorage.setItem('selected', lists[lists.indexOf(selected) + 1]);
    
            load();
        } else if (selecting == 'items') {
            if (document.querySelectorAll('li').length == 0) return;

            if (selectedItem == null) {
                //select first item
                selectedItem = 0;
            } else if (selectedItem < document.querySelectorAll('li').length - 1) {
                selectedItem += 1;
            }

            document.querySelectorAll('li').forEach((item) => {
                if (item.getAttribute('order') == selectedItem) document.getElementById('focus-' + item.getAttribute('name')).style.display = 'block';
                else document.getElementById('focus-' + item.getAttribute('name')).style.display = 'none';
            });
        }
    } else if (e.key == 'Enter') {
        if (selecting == 'items' && selectedItem != null && descriptionOpen == false) {
            let saved = JSON.parse(localStorage.getItem('list_' + localStorage.getItem('selected')));

            saved.items[selectedItem].checked = !saved.items[selectedItem].checked;

            localStorage.setItem('list_' + localStorage.getItem('selected'), JSON.stringify(saved));

            load();
        }
    } else if (e.key == 'e' || e.key == 'E') {
        editDescription();
    }
});
// display new item popup when button clicked
document.getElementById('new').addEventListener('click', () => {
    openNewPopup();
});
// submit new item popup when create button clicked
document.getElementById('create-button').addEventListener('click', () => {
    submitNewPopup();
});

function editDescription() {
    if (selecting == 'items' && selectedItem != null && !descriptionOpen) {
        let saved = JSON.parse(localStorage.getItem('list_' + localStorage.getItem('selected')));

        descriptionOpen = true;

        openInputModal('Enter new item description', saved.items[selectedItem].description, (modal, input) => {
            if (input.value == null || input.value == '') {
                return openInfoModal('description cannot be empty');
            }

            saved.items[selectedItem].description = input.value;

            localStorage.setItem('list_' + localStorage.getItem('selected'), JSON.stringify(saved));

            load();

            descriptionOpen = false;
            modal.parentNode.removeChild(modal);
        });
    }
}