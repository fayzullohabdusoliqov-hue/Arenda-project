const sidebar = document.querySelector(".site__sidebar")
const footer = document.querySelector(".site__footer")
const headerBtn = document.querySelector(".header_btn")
const somethinksModal = document.querySelector(".somethinks__form")
const somethinksBtn = document.querySelector(".somethinks_btn")
const somethinksCloseModal = document.querySelector("#somethinks_close")
const somethinksSubmitModal = document.querySelector("#somethinks_submit")
const somethinksInput = document.querySelector("#somethink_input")
const somethinksList = document.querySelector(".somethinks__list")
const historyModal = document.querySelector(".history__form")
const historyBtn = document.querySelector(".history_btn")
const historyCloseBtn = document.querySelector("#history_close")
const historySubmitBtn = document.querySelector("#history_submit")
const historyNameInput = document.querySelector("#history_name")
const historySurnameInput = document.querySelector("#history_surname")
const historySomethinkInput = document.querySelector("#history_somethink")
const historyNumberInput = document.querySelector("#history_number")
const historyList = document.querySelector(".history__list")
const dashboardSpent = document.querySelector("#spent")
const dashboardProfit = document.querySelector("#profit")
const dashboardSomethinks = document.querySelector("#somethinks")

isOpenSidebar = false
headerBtn.addEventListener("click", (evt) => {
    evt.preventDefault()
    isOpenSidebar = !isOpenSidebar
    
    if(isOpenSidebar){
        setTimeout(() => {
            sidebar.style.display = "block"
            sidebar.style.animation = "openSidebar 0.5s ease-out"
        }, 500)
    }else{
        setTimeout(() => {
            sidebar.style.animation = "closeSidebar 0.5s ease-in"
        }, 500)
        setTimeout(() => {
            sidebar.style.display = "none"
        }, 1000)
    }
})

somethinksBtn.addEventListener("click", (evt) => {
    evt.preventDefault()
    footer.style.display = "flex"
    somethinksModal.style.display = "block"
})
somethinksCloseModal.addEventListener("click", (evt) => {
    evt.preventDefault()
    footer.style.display = "none"
    somethinksModal.style.display = "none"
})
somethinksSubmitModal.addEventListener("click" , async(evt) => {
    evt.preventDefault()
    try{
        const res = await fetch("https://variant-4d481-default-rtdb.firebaseio.com/somethinks.json",{
            method: "POST",
            body:JSON.stringify({
                name: somethinksInput.value
            })
        })
        const data = await res.json()

        if(data){
            footer.style.display = "none"
            somethinksModal.style.display = "none"
            getSomethinks()
        }
    }catch(err){
        console.log(err)
        alert(err)
    }
})

historyBtn.addEventListener("click", (evt) => {
    evt.preventDefault()
    footer.style.display = "flex"
    historyModal.style.display = "block"
})
historyCloseBtn.addEventListener("click", (evt) => {
    evt.preventDefault()
    footer.style.display = "none"
    historyModal.style.display = "none"
})
historySubmitBtn.addEventListener("click" , async(evt) => {
    evt.preventDefault()
    try{
        const res = await fetch("https://variant-4d481-default-rtdb.firebaseio.com/history.json",{
            method: "POST",
            body:JSON.stringify({
                name: historyNameInput.value,
                surname: historySurnameInput.value,
                phone: historyNumberInput.value,
                somethink: historySomethinkInput.value
            })
        })
        const data = await res.json()

        if(data){
            footer.style.display = "none"
            historyModal.style.display = "none"
            getHistory()
        }
    }catch(err){
        console.log(err)
        alert(err)
    }
})

async function getSomethinks(){
    try{
        const res = await fetch("https://variant-4d481-default-rtdb.firebaseio.com/somethinks.json")
        const json = await res.json()

        if(json){
            const data = Object.entries(json).map(([key,value]) => ({firebaseKey: key, ...value}))
            renderSomethinks(data)
        }else{
            renderSomethinks(null)
        }
    }catch(err){
        console.log(err)
    }
}
async function deleteSomethinks(firebaseKey){
    try{
        const res = await fetch(`https://variant-4d481-default-rtdb.firebaseio.com/somethinks/${firebaseKey}.json`, {
            method: "DELETE"
        })
        getSomethinks()
    }catch(err){
        console.log(err)
    }
}
function renderSomethinks(data){
    if(data){
        somethinksList.innerHTML = ""
        data.forEach((el) => {
            somethinksList.innerHTML += `
                <li class="somethinks_item">
                    <div class="somethinks__inner">
                        <strong class="somthinks_strong">${el.name[0]}</strong>
                        <h4 class="somethinks_subtitle">${el.name}</h4>
                    </div>
                    <button class="somethinks_delete" onclick="deleteSomethinks('${el.firebaseKey}')">D</button>
                </li>`
        })
    }else{
        somethinksList.innerHTML = `
            <h3 class='somethinks_dont-have'>Mahsulotlar mavjud emas!</h3>
        `
    }
}

async function getHistory(){
    try{
        const res = await fetch("https://variant-4d481-default-rtdb.firebaseio.com/history.json")
        const json = await res.json()

        if(json){
            const data = Object.entries(json).map(([key,value]) => ({firebaseKey: key, ...value}))
            renderHistory(data)
            console.log(data)
        }else{
            renderHistory(null)
        }
    }catch(err){
        console.log(err)
    }
}
async function deleteHistory(firebaseKey){
    try{
        const res = await fetch(`https://variant-4d481-default-rtdb.firebaseio.com/history/${firebaseKey}.json`, {
            method: "DELETE"
        })
        getHistory()
    }catch(err){
        console.log(err)
    }finally{
        console.log("Yakunlandi")
    }
}
function renderHistory(data){
    if(data){
        historyList.innerHTML = ""
        data.forEach((el) => {
            historyList.innerHTML += `
                    <li class="history_item">
                        <div class="history__inner">
                            <strong class="history_strong">TS</strong>
                            <h4 class="history_subtitle">${el.name} <br> ${el.surname}</h4>
                        </div>
                        <div class="history__btns">
                            <span class="history_number">${el.phone}</span>
                            <button class="history_somethink">S</button>
                            <button class="history_delete" onclick="deleteHistory('${el.firebaseKey}')">D</button>
                        </div>
                    </li>`
        })
    }else{
        historyList.innerHTML = `
            <h3 class='somethinks_dont-have'>Tarix mavjud emas!</h3>
        `
    }
}

getSomethinks()
getHistory()