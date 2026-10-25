const headerBtn = document.querySelector(".header_btn")
const sidebar = document.querySelector(".site__sidebar")
const footer = document.querySelector(".site__footer")
const infoList = document.querySelector(".info__list")
const infoModal = document.querySelector(".info__form")
const infoBtn = document.querySelector(".info_btn-content")
const infoCloseBtn = document.querySelector(".form_close")
const infoSubmitBtn = document.querySelector(".info_submit")
const infoHumanName = document.querySelector("#name")
const infoHumanSurame = document.querySelector("#surname")
const infoHumanPhone = document.querySelector("#phone")
const infoSomethinkName = document.querySelector("#somethinkName")
const infoBuyDate = document.querySelector("#buyDate")
const infoSellDate = document.querySelector("#sellDate")
const infoBuyPrice = document.querySelector("#buyPrice")
const infoMonthlyPrice = document.querySelector("#monthlyPrice")
const infoImage = document.querySelector("#image")
const infoComment = document.querySelector("#comment")

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
function stringImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
            resolve(reader.result)
        }
        reader.onerror = () => {
            reject(reader.error)
        }

        reader.readAsDataURL(file)
    })
}

infoBtn.addEventListener("click", (evt) => {
    evt.preventDefault()
    footer.style.display = "flex"
    infoModal.style.display = "block"
})
infoCloseBtn.addEventListener("click", (evt) => {
    evt.preventDefault()
    footer.style.display = "none"
    infoModal.style.display = "none"
})
infoSubmitBtn.addEventListener("click", async(evt) => {
    evt.preventDefault()
    try{
        const res = await fetch("https://variant-4d481-default-rtdb.firebaseio.com/products.json",{
            method: "POST",
            body: JSON.stringify({
                humanName: infoHumanName.value,
                humanSurame: infoHumanSurame.value,
                phone: infoHumanPhone.value,
                image: stringImage(infoImage.files[0]),
                somethinkName: infoSomethinkName.value,
                buyDate: infoBuyDate.value,
                sellDate: infoSellDate.value,
                buyPrice: infoBuyPrice.value,
                monthlyPrice: infoMonthlyPrice.value,
                comment: infoComment.value
            })
        })
        const data = await res.json()

        if(data){
            getProducts()
        }
    }catch(err){
        console.log(err)
        alert(err)
    }
})

async function getProducts(){
    try{
        const res = await fetch("https://variant-4d481-default-rtdb.firebaseio.com/products.json")
        const json = await res.json()

        if(json){
            const data = Object.values(json).map(([key, value]) => ({firebaseKey: key, ...value}))
            renderProducts(data)
        }else{
            renderProducts(null)
        }
    }catch(err){
        console.log(err)
    }
}
function renderProducts(data){
    if(data){
        infoList.innerHTML = ""
        for(let i = 0; i > data.length; i++){
            infoList.innerHTML += `
                <li class="info_item">
                    <div class="info__content">
                        <div class="info__user">
                            <strong class="info_strong">${data[i].humanName[0]}${data[i].humanSurame[0]}</strong>
                            <h3 class="info_subtitle">${data[i].humanName} ${data[i].humanSurame}</h3>
                        </div>
                        <button class="info_btn">to'liq</button>
                    </div>
                    <span class="line"></span>
                    <div class="info__inner">
                        <div class="info__dates">
                            <strong class="info_strong-name">${data[i].somethinkName}</strong>
                            <strong class="info_date">${data[i].buyDate}</strong>
                            <strong class="info_date">${data[i].monthlyDate}</strong>
                        </div>
                        <div class="info__btn">
                            <button class="info_btn">E</button>
                            <button class="info_btn">D</button>
                        </div>
                    </div>
                </li>`
        }
    }else{
        infoList.innerHTML = `
            <h3 class='info_dont-have'>Mahsulotlar mavjud emas!</h3>
        `
    }
}

getProducts()