const daysContainer = document.querySelector(".days");
const month = document.querySelector(".month");
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
let clickableDays;
let diaMesAno;
const haTasks = [];
let selectedDayNum, selectedDayMonth, selectedDayYear;

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

const days = ["Sun", "Mon", "Tue", "Wednesday", "Thu", "Friday", "Sat"];

//get current date
const date = new Date();

//get current month
let currentMonth = date.getMonth();

// get current year
let currentYear = date.getFullYear();


////////////////////////!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

const refreshTasksUsingLocalStorage = (diaMesAno) => {

  tasksContainer.innerHTML = "";

  const tasksFromLocalStorage = JSON.parse(localStorage.getItem(diaMesAno));

  //criar os elementos na página
  if (tasksFromLocalStorage != null){

    for (const task of tasksFromLocalStorage) {
      const taskItemContainer = document.createElement("div");
      taskItemContainer.classList.add("task-item");
  
      const taskContent = document.createElement("p");
      taskContent.innerText = task.description;
  
      taskContent.addEventListener("click", () => handleClick(taskContent));
  
      if (task.isCompleted) {
        taskContent.classList.toggle("completed");
      }
  
      const deleteItem = document.createElement("i");
      deleteItem.classList.add("fa-solid");
      deleteItem.classList.add("fa-trash-can");
  
      deleteItem.addEventListener("click", () => handleDeleteClick(deleteItem));
  
      taskItemContainer.appendChild(taskContent);
      taskItemContainer.appendChild(deleteItem);
  
      tasksContainer.appendChild(taskItemContainer);
    }
  }
  
};

////////////////////////////////////!!!!!!!!!!!/////////////////!!!!!!!!!!!!!!!!!

const showTasks = (day) => {
  //pegar diaMesAno ex: 01022024
  let dia;
  let mes;
  currentMonth += 1;
  currentMonth = currentMonth.toString();

  console.log(day.innerHTML);

  //logica dia
  if(day.innerHTML.length == 1){
    dia =  "0" + day.innerHTML;
  }
  else{
    dia = day.innerHTML
  }

  //logica mes
  if(currentMonth.length == 1){
    mes = "0" + currentMonth;
  }
  else{
    mes = currentMonth;
  }

  diaMesAno = dia+mes+currentYear; //colocar diaMesAno numa var global
  console.log(dia);
  console.log(mes);
  console.log(diaMesAno);
  currentMonth -= 1;

  //toggle class .selected
  let clickableDaySelected = document.querySelectorAll(".selected");

  if (clickableDaySelected.length > 0){
    for(d of clickableDaySelected){
      //remove a classe selected de todos os dias (limpa)
      d.classList.remove("selected");
    }
  }
  
  day.classList.toggle("selected");
  selectedDayNum = day.innerHTML;
  selectedDayMonth = currentMonth;
  selectedDayYear = currentYear;
  console.log(selectedDayNum);

  //chamar refreshTasks passando diaMesAno
  refreshTasksUsingLocalStorage(diaMesAno);

}
activeDays();
////////////////////////
function activeDays(){

  for(i=0; i<localStorage.length; i++){
    let chave = localStorage.key(i);
    let valor = localStorage.getItem(chave);
    if(valor != "[]" && !(haTasks.includes(chave))){
      haTasks.push(chave);
    }
    if(valor == "[]" && (haTasks.includes(chave))){
      let indice = haTasks.indexOf(chave);
      haTasks.splice(indice, 1);
      localStorage.removeItem(chave);
    }
  }

}
/////////////////

function renderCalendar(){
    const firstDay = new Date(currentYear, currentMonth, 1);
    const firstDayIndex = firstDay.getDay();//dia da semana do primeiro dia desse mes
    const lastDay = new Date(currentYear, currentMonth + 1, 0);//ultimo dia do mes atual
    const lastDayIndex = lastDay.getDay();//dia da semana do ultimo dia desse mes

    const prevLastDay = new Date(currentYear, currentMonth, 0); //dia 0 desse mes(ultimo do mes passado)
    const prevLastDayDate = prevLastDay.getDate();//last day em numero do mes passado

    const nextDays = 7 - (lastDayIndex + 1);

    // update current year and month in header
    month.innerHTML = months[currentMonth] + ', ' + currentYear;
    
    // update days html
    let days = "";

    //prev month days 
    for(let x = firstDayIndex; x > 0; x--){
      days += `<div class="notClickAbleDay prev">${prevLastDayDate - x + 1}</div>`;
    }

    ///////////!!!!!!!!!!!

    ////////!!!!!!!!!!!!!

    // current month days
    for(let i = 1; i <= lastDay.getDate(); i++){

        //////////////////////////!!!!!!!!!!!
        //pegar diaMesAno ex: 01022024
        let dia;
        let mes;
        let currentMonthTemp = (currentMonth+1).toString();
        let dayTemp = i.toString();

        //logica dia
        if(dayTemp.length == 1){
          dia =  "0" + dayTemp;
        }
        else{
          dia = dayTemp;
        }

        //logica mes
        if(currentMonthTemp.length == 1){
          mes = "0" + currentMonthTemp;
        }
        else{
          mes = currentMonthTemp;
        }

        let diaMesAnoTemp = dia+mes+currentYear;
        ////////////////////////////!!!!!!!!!!!

        if(i === new Date().getDate() && 
        currentMonth === new Date().getMonth() && 
        currentYear === new Date().getFullYear()){
            //add element with class                                                   
            if(haTasks.includes(diaMesAnoTemp)){
              days += `<div class="clickAbleDay today haTasks">${i}</div> `;
            }
            else{
              days += `<div class="clickAbleDay today">${i}</div> `;
            }
        }
        else{
          if(haTasks.includes(diaMesAnoTemp)){
            days += `<div class="clickAbleDay haTasks">${i}</div> `;
          }
          else{
            days += `<div class="clickAbleDay">${i}</div> `;
          }
            
        }

    }

    //next month days 
    for(i=1; i<=nextDays; i++){
        days += `<div class="notClickAbleDay next">${i}</div>`;
    }

    daysContainer.innerHTML = days;    
    clickableDays = document.querySelectorAll(".clickAbleDay"); //Gera uma NodeList
    //loop na NodeList adicionando eventListener
    for(i=0; i<(clickableDays.length); i++){

      clickableDays[i].addEventListener("click", (function(index) {
        return function() {
            console.log(clickableDays[index]);
            showTasks(clickableDays[index]);
        };
    })(i)); 

    }

    if(selectedDayMonth == currentMonth && selectedDayYear == currentYear){
      clickableDays.forEach((day)=>{
        if(day.innerHTML == selectedDayNum){
          day.classList.toggle("selected");
        }
      })

    }
}

renderCalendar();

nextBtn.addEventListener("click", nextMonth);

function nextMonth(){
    if(currentMonth == 11){
        currentMonth = 0;
        currentYear += 1;
    }
    else{
        currentMonth+=1;
    }
    
    renderCalendar();
}   

prevBtn.addEventListener("click", prevMonth);

function prevMonth(){
    if (currentMonth == 0){
        currentMonth = 11;
        currentYear -= 1;
    }
    else{
        currentMonth -= 1;
    }
 
    renderCalendar();
}

///////////////////////////////////////////////////////////////


// Logic page 2

const inputElement = document.querySelector(".new-task-input");
const addButton = document.querySelector(".new-task-button");
const tasksContainer = document.querySelector(".tasks-container");

function validateInput() {
  return inputElement.value.trim().length > 0;
}

function handleAddTask() {
  let currentDay = new Date().getDate();
  if (selectedDayNum >= currentDay && selectedDayMonth >= currentMonth && selectedDayYear >= currentYear){
    const inputIsValid = validateInput();

    //caso o input não seja válido
    if (!inputIsValid) {
      return inputElement.classList.add("error");
    }
  
    //lógica da adição de task caso o input seja válido
  
    const taskItemContainer = document.createElement("div");
    taskItemContainer.classList.add("task-item");
  
    const taskContent = document.createElement("p");
    taskContent.innerText = inputElement.value;
  
    taskContent.addEventListener("click", () => handleClick(taskContent)); 
  
    const deleteItem = document.createElement("i");
    deleteItem.classList.add("fa-solid");
    deleteItem.classList.add("fa-trash-can");
  
    deleteItem.addEventListener("click", () => handleDeleteClick(deleteItem));
  
    taskItemContainer.appendChild(taskContent);
    taskItemContainer.appendChild(deleteItem);
  
    tasksContainer.appendChild(taskItemContainer);
  
    inputElement.value = "";
  
    // diaMesAno = String passada na chamada do handleAddTask
  
    //                diaMesAno 
    updateLocalStorage(diaMesAno); //a var ja estara redefinida
    activeDays();
  }
  else{
    alert("You cannot add tasks before today!")
  }

}

const handleClick = (taskContent) => {
  const tasks = tasksContainer.childNodes;

  for (const task of tasks) {
    const currentTaskIsBeingClicked = task.firstChild.isSameNode(taskContent);
    if (currentTaskIsBeingClicked) {
      task.firstChild.classList.toggle("completed");
    }
  }

  updateLocalStorage(diaMesAno);
};

const handleDeleteClick = (deleteItem) => {
  //deletar taskItem pai "auto-destruição"
  const tasks = tasksContainer.childNodes;

  for (const task of tasks) {
    const currentTaskIsBeingClicked = task.lastChild.isSameNode(deleteItem);
    if (currentTaskIsBeingClicked) {
      task.remove();
    }
  }

  updateLocalStorage(diaMesAno); //vai reler e setar no lugar de diaMesAno, modificando o JSON string do dia
};

function handleInputChange() {
  const inputIsValid = validateInput();

  if (inputIsValid) {
    return inputElement.classList.remove("error");
  }
}

const updateLocalStorage = (diaMesAno) => {
  const tasks = tasksContainer.childNodes;

  const localStorageTasks = [...tasks].map((task) => {
    const content = task.firstChild; //pega o <p>
    const isCompleted = content.classList.contains("completed"); //verifica se possui a classe completed

    return { description: content.innerText, isCompleted }; //retorna um objeto com os dados de cada taskItem
  });

  //!!!!!!!!!!!!!

  //se a key for = [], entao atualizar campo "DaysWithTask", removendo key

  //!!!!!!!!!!!
  
  //                   diaMesAno
  localStorage.setItem(diaMesAno, JSON.stringify(localStorageTasks));
  activeDays();
  console.log("atualizou");
  renderCalendar();
  //armazena no local storage uma string no modelo json que é um array dos objetos de cada takItem
  //se já houver um storage com o mesmo nome diaMesAno ele irá substituir o antigo array pelo novo
};



//refreshTasksUsingLocalStorage(); deixa de ser chamado ao iniciar a pagina

addButton.addEventListener("click", handleAddTask);
inputElement.addEventListener("change", handleInputChange);
