let selecting = 'lists';
let selectedItem;

document.addEventListener('keydown', (e) =>
{
    if (document.getElementById('popup').style.display != 'block')
    {
        // popup is not open, proceed with normal keybinds
        if (e.key.toLowerCase() == 'n')
        {
            // open create new post popup
            e.preventDefault();
            open();
        }
        else if (e.key.toLowerCase() == 'e') 
        {
            // open editing post popup
            e.preventDefault();
            edit();
        }
        else if (e.key == 'ArrowLeft')
        {
            selecting = 'lists';
    
            document.querySelectorAll('li').forEach((item) =>
            {
                document.getElementById('focus-' + item.getAttribute('name')).style.display = 'none';
            });
    
            selectedItem = null;
        }
        else if (e.key == 'ArrowRight')
        {
            selecting = 'items';
        }
        else if (e.key == 'ArrowUp')
        {
            if (selecting == 'lists')
            {
                // if we are on the top list, return out of function. 
                // there will not be another list to move up to
                if (storage.lists.indexOf(storage.data.selected) == 0) return;

                switchList(storage.lists[storage.lists.indexOf(storage.data.selected) - 1]);
            }
            else if (selecting == 'items')
            {
                if (document.querySelectorAll('li').length == 0) return;
    
                if (selectedItem == null)
                {
                    // select first item
                    selectedItem = 0;
                }
                else if (selectedItem > 0)
                {
                    selectedItem -= 1;
                }
    
                document.querySelectorAll('li').forEach((item) =>
                {
                    if (item.getAttribute('order') == selectedItem) document.getElementById('focus-' + item.getAttribute('name')).style.display = 'block';
                    else document.getElementById('focus-' + item.getAttribute('name')).style.display = 'none';
                });
            }
        } 
        else if (e.key == 'ArrowDown') 
        {
            if (selecting == 'lists') 
            {
                // if we are on the last list, return out of function. 
                // there will not be another list to move down to
                if (storage.lists.indexOf(storage.data.selected) == storage.lists.length - 1) return;

                switchList(storage.lists[storage.lists.indexOf(storage.data.selected) + 1]);
            } 
            else if (selecting == 'items') {
                if (document.querySelectorAll('li').length == 0) return;
    
                if (selectedItem == null) 
                {
                    //select first item
                    selectedItem = 0;
                } 
                else if (selectedItem < document.querySelectorAll('li').length - 1) 
                {
                    selectedItem += 1;
                }
    
                document.querySelectorAll('li').forEach((item) => 
                {
                    if (item.getAttribute('order') == selectedItem) document.getElementById('focus-' + item.getAttribute('name')).style.display = 'block';
                    else document.getElementById('focus-' + item.getAttribute('name')).style.display = 'none';
                });
            }
        }
        else if (e.key == 'Enter') 
        {
            if (selecting == 'items' && selectedItem != null) 
            {
                if (storage.data.hasOwnProperty(storage.data.selected))
                {
                    // selected list is a base list
                    storage.data[storage.data.selected][selectedItem].checked =  !storage.data[storage.data.selected][selectedItem].checked
                }
                else
                {
                    console.log(storage.data.topics[storage.data.selected][selectedItem].checked)
                    // selected list is a topic added by the user
                    storage.data.topics[storage.data.selected][selectedItem].checked = !storage.data.topics[storage.data.selected][selectedItem].checked;
                }
    
                load();
            }
        } 
    } 
    else
    {
        // popup is open only allow popup related keybinds
        if (e.key == 'Escape')
        {
            // close the popup when escape is clicked
            close();
        } 
        else if (e.key == 'Enter') 
        {
            // submit the popup data when enter is clicked
            submit();
        } 
    }
});


document.getElementById('new').addEventListener('click', () => 
{
    // display new item popup when button clicked
    open();
});

document.getElementById('submit-button').addEventListener('click', () => 
{
    // submit new item popup when create button clicked
    submit();
});