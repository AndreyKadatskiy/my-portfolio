let username=prompt('Как вас зовут?')
alert('Привет,'+username+'!');
const myButton=document.getElementById('myBtn');
myButton.addEventListener('click',function (){alert('Кнопка нажата!');});
let count=0;
const myButton2=document.getElementById('myBtn1');
myButton2.addEventListener('click',function (){count++; alert(count);});
