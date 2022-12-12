let selecting = 'lists';
let selectedItem;
let lists = [
    'list_general',
    'list_today',
    'list_upcoming',
    ... JSON.parse(localStorage.getItem('topics') || '[]')
];

document.addEventListener('keydown', (e) => {
    if (document.getElementById('popup').style.display != 'block') {
        if (e.key.toLowerCase() == 'n') {
            e.preventDefault();
    
            open();
        } else if (e.key.toLowerCase() == 'N') {
            e.preventDefault();
    
            open();
        } else if (e.key == 'ArrowLeft') {
            selecting = 'lists';
    
            document.querySelectorAll('li').forEach((item) => {
                document.getElementById('focus-' + item.getAttribute('name')).style.display = 'none';
            });
    
            selectedItem = null;
        } else if (e.key == 'ArrowRight') {
            selecting = 'items';
        } else if (e.key == 'ArrowUp') {
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
        } else if (e.key == 'ArrowDown') {
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
        } else if (e.key == 'e' || e.key == 'E') {
            e.preventDefault();
            
            edit();
        } else if (e.key == 'Enter') {
            if (selecting == 'items' && selectedItem != null) {
                let saved = JSON.parse(localStorage.getItem(localStorage.getItem('selected')));
    
                saved.items[selectedItem].checked = !saved.items[selectedItem].checked;
    
                localStorage.setItem(localStorage.getItem('selected'), JSON.stringify(saved));
    
                load();
            }
        } 
    } else {
        if (e.key == 'Escape') {
            close();
        } else if (e.key == 'Enter') {
            submit();
        } 
    }
});

// display new item popup when button clicked
document.getElementById('new').addEventListener('click', () => {
    open();
});
// submit new item popup when create button clicked
document.getElementById('submit-button').addEventListener('click', () => {
    submit();
});