const itemForm = document.getElementById('item-form');

const itemInput = document.getElementById('item-input');

const itemList = document.getElementById('item-list');

const clearButton = document.getElementById('clear');

const itemFilter = document.getElementById('filter');

const formBtn = itemForm.querySelector('button');
//const items = document.querySelectorAll('li');
let isEditMode = false;


function displayItems (){
 let itemsFromStorage = getItemsFromStorage();
 itemsFromStorage.forEach((item) =>{
     addItemToDOM(item);
 });
 checkUI();
};


// functions

const onAddItemSubmit = (e) =>{
   e.preventDefault();

   const  newItem = itemInput.value;
   // Validate Input
   if(newItem === ''){
    alert('Please add an item');
    return;
   }

   // check for edit mode
   if(isEditMode){
    const itemToEdit = itemList.querySelector('.edit-mode');
    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove();
   }else{
      if(checkIfItemExist(newItem)){
        alert('Item Already Exists');
        return;
      }
   }

   addItemToDOM(newItem)

   addItemToStorage(newItem);

   checkUI();

   itemInput.value = '';

 
};

function  addItemToDOM(newItem){
    // create list item
    const li =  document.createElement('li');
    li.appendChild(document.createTextNode(newItem));

    const button = createButton('remove-item btn-link text-red')
    li.appendChild(button);

    itemList.appendChild(li);
}

const createButton = (classes) =>{

    const button = document.createElement('button');
    button.className = classes;

    const icon = createIcon('fa solid fa-xmark');
    
    button.appendChild(icon);
    return button;
};

const createIcon = (classes) =>{

    const icon = document.createElement('i');
    icon.className = classes;
    
    return icon;
};


function addItemToStorage(item){
   let itemsFromStorage = getItemsFromStorage();

   // Add item to Array
   itemsFromStorage.push(item);


   /// Convet to JSON string and set to local storage 
   localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}



function getItemsFromStorage(){
    let items; 
    if(localStorage.getItem('items') === null){
        items = []    
    }else{
        items = JSON.parse(localStorage.getItem('items'));
    }
    return items;
}

function onClickItem(e){
    if(e.target.parentElement.classList.contains('remove-item')){
       removeItem(e.target.parentElement.parentElement);  
    }else{
         setItemToEdit(e.target);
    }
}

function checkIfItemExist(item){
  const itemsFromStorage = getItemsFromStorage();
  return itemsFromStorage.includes(item);
}

function setItemToEdit(item){
    isEditMode = true;
    itemList.querySelectorAll('li').forEach((i) => i.classList.remove('edit-mode'));
    item.classList.add('edit-mode');
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
    formBtn.style.backgroundColor ='#228822';
    itemInput.value = item.textContent;
}

function removeItem(item){
    console.log('Removing item')
    if(confirm('Are you sure?')){
        item.remove();
        removeItemFromStorage(item.textContent);
        checkUI();
    } 


}

function removeItemFromStorage(key){
    console.log("Key" + key);
    let items = getItemsFromStorage();
    items =  items.filter(i => i !== key);

    localStorage.setItem('items', JSON.stringify(items));
}


const clearItems = (e) =>{
   //itemList.innerHTML = '';
   while(itemList.firstChild){
     itemList.removeChild(itemList.firstChild);
   }

   localStorage.removeItem('items');
   checkUI();
}

const filterItems = (e) =>{

    const items = document.querySelectorAll('li');
    const text = e.target.value.toLowerCase();

    items.forEach((item) =>{
      const itemName = item.firstChild.textContent.toLowerCase();
      if(itemName.indexOf(text)  != -1){
        item.style.display = 'flex';
      }else{
        item.style.display = 'none';
      }
    });
};

const checkUI = () =>{
    itemInput.value = '';
    const items = document.querySelectorAll('li');
    if(items.length === 0){
        clearButton.style.display = 'none';
        itemFilter.style.display = 'none';
    }else{
        clearButton.style.display = 'block';
        itemFilter.style.display = 'block';
    }

    formBtn.innerHTML =  '<i class ="fa-solid fa-plus"></i> Add Item'
    formBtn.style.backgroundColor ='#333';
    isEditMode = false;

};




function init(){

   itemForm.addEventListener('submit',onAddItemSubmit);
   itemList.addEventListener('click',onClickItem);
   clearButton.addEventListener('click',clearItems)
   itemFilter.addEventListener('input', filterItems) 
    document.addEventListener('DOMContentLoaded',displayItems);

     checkUI();
}


// Event Listeners

init();
