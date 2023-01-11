const button = document.querySelector('button');
const input = document.querySelector('input');
const wrapper = document.querySelector('.wrapper');
const body = document.querySelector('body');

const elements = []; // array of all elements
let selectedElement = null;
let x = null;     //point of click relative to the left side of selected element
let y = null;     //point of click relative to the top side of selected element
let offsetLeft = null;   // offsetLeft of checked element
let offsetTop = null;    // offsetTop of checked element

function showText(){
    const text = input.value.trim().replace(/\s\s+/g, ' '); 
    input.value = ''
    const lettersArray = text.split(''); 
    let prevElement = null;
    lettersArray.forEach((item) => {
        prevElement = createElement(item, prevElement)
    })
}

function createElement(letter, prevElement){
    let span = document.createElement('span');
    span.textContent = letter;
    span.classList.add('letter');
    span.style.left = prevElement && prevElement.offsetLeft + prevElement.offsetWidth +'px'; // move the next element to right
    wrapper.appendChild(span);
    elements.push(span);
    return span 
}

function checkOverlap(){
    let filteredElements = elements.filter(item => item !== selectedElement); //filter selected element from array 
    let elemRect = selectedElement.getBoundingClientRect();
    return filteredElements.find((item) => {
        let itemRect = item.getBoundingClientRect();
        return !(itemRect.right < elemRect.left || 
            itemRect.left > elemRect.right || 
            itemRect.bottom < elemRect.top || 
            itemRect.top > elemRect.bottom)
    })
}

function clickSpan(e){
    //before deleting the selected element, check the overlap the selected element and other elements
    if(selectedElement){                                     
        let foundElem = checkOverlap()
        if(foundElem) {
            //if overlap was found, change element position
            foundElem.style.left = offsetLeft+"px";
            foundElem.style.top = offsetTop+"px";
        }
    }

    selectedElement = selectedElement ? null : e.target;  //add or remove selected element after click 
    // after selecting an element fill in its coordinates
    if(selectedElement){
        offsetLeft = selectedElement.offsetLeft;
        offsetTop = selectedElement.offsetTop;
        x = e.pageX - selectedElement.offsetLeft;
        y = e.pageY - selectedElement.offsetTop;
    }
}

wrapper.addEventListener("click", (e) => {
    clickSpan(e)
})

body.addEventListener("mousemove", (e) => {
    //move element with cursor
    if (selectedElement) {
        selectedElement.style.left = e.pageX - x +"px";
        selectedElement.style.top = e.pageY - y + "px";
    }
})

button.addEventListener("click", (event) => {
    event.preventDefault()
    event.stopPropagation()
    showText()
})