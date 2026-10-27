const headerBtn = document.querySelector(".header_btn")
const sidebar = document.querySelector(".site__sidebar")
const footer = document.querySelector(".site__footer")
const infoList = document.querySelector(".info__list")
const infoModal = document.querySelector(".info__form")
const infoFormTitle = document.querySelector(".form_title")
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
let isAddOrEdit = true
let editFirebaseKey = ""

let isOpenSidebar = false
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
    if(file){
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
    }else{
        return ""
    }
}

infoBtn.addEventListener("click", (evt) => {
    evt.preventDefault()
    footer.style.display = "flex"
    infoModal.style.display = "block"
    infoFormTitle.textContent = "Mahsulot qo'shish"
    infoSubmitBtn.textContent = "qo'shish"
    isAddOrEdit = false
    getSomethinks()
})
infoCloseBtn.addEventListener("click", (evt) => {
    evt.preventDefault()
    footer.style.display = "none"
    infoModal.style.display = "none"
})
infoSubmitBtn.addEventListener("click", async(evt) => {
    evt.preventDefault()
    const image = await stringImage(infoImage.files[0])

    if(!isAddOrEdit){
        try{
            const res = await fetch("https://variant-4d481-default-rtdb.firebaseio.com/products.json",{
                method: "POST",
                body: JSON.stringify({
                    humanName: infoHumanName.value,
                    humanSurame: infoHumanSurame.value,
                    phone: infoHumanPhone.value,
                    image: image,
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
                footer.style.display = "none"
                infoModal.style.display = "none"
            }
        }catch(err){
            console.log(err)
            alert(err)
        }
    }else{
        try{
            const res = await fetch(`https://variant-4d481-default-rtdb.firebaseio.com/products/${editFirebaseKey}.json`,{
                method: "PATCH",
                body: JSON.stringify({
                    humanName: infoHumanName.value,
                    humanSurame: infoHumanSurame.value,
                    phone: infoHumanPhone.value,
                    image: image,
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
                footer.style.display = "none"
                infoModal.style.display = "none"
            }
        }catch(err){
            console.log(err)
            alert(err)
        }
    }
})

async function getSomethinks(){
    try{
        const res = await fetch("https://variant-4d481-default-rtdb.firebaseio.com/somethinks.json")
        const json = await res.json()

        if(json){
            const data = Object.values(json)
            renderSomethinks(data)
        }else{
            renderSomethinks(null)
        }
    }catch(err){
        console.log(err)
    }
}
function renderSomethinks(data){
    if(data){
        infoSomethinkName.innerHTML = ""
        data.forEach(element => {
            infoSomethinkName.innerHTML += `
                <option value="${element.name}">${element.name}</option>
            `
        })
    }else{
        infoSomethinkName.innerHTML = `
            <option value="no">Mavjud emas!</option>
        `
    }
}

async function getProducts(){
    try{
        const res = await fetch("https://variant-4d481-default-rtdb.firebaseio.com/products.json")
        const json = await res.json()

        if(json){
            const data = Object.entries(json).map(([key, value]) => ({firebaseKey: key, ...value}))
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
        for(let i = 0; i < data.length; i++){
            infoList.innerHTML += `
                <li class="info_item">
                    <div class="info__content">
                        <div class="info__user">
                            <strong class="info_strong">${data[i].humanName[0]}${data[i].humanSurame[0]}</strong>
                            <h3 class="info_subtitle">${data[i].humanName} ${data[i].humanSurame}</h3>
                        </div>
                        <a href="/Pages/Detail/detail.html?key=${data[i].firebaseKey}" class="info_btn">to'liq</a>
                    </div>
                    <span class="line"></span>
                    <div class="info__inner">
                        <div class="info__dates">
                            <strong class="info_strong-name">${data[i].somethinkName}</strong>
                            <strong class="info_date">${data[i].buyDate}</strong>
                            <strong class="info_date">${data[i].sellDate}</strong>
                        </div>
                        <div class="info__btn">
                            <button class="info_btn" onclick="editProduct('${data[i].firebaseKey}')">E</button>
                            <button class="info_btn" onclick="deleteProduct('${data[i].firebaseKey}')">D</button>
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
async function deleteProduct(firebaseKey){
    try{
        postProductHistory(firebaseKey)
        const deleteRes = await fetch(`https://variant-4d481-default-rtdb.firebaseio.com/products/${firebaseKey}.json`,{
            method: "DELETE"
        }) 
        getProducts()
    }catch(err){
        console.log(err)
    }
}
async function postProductHistory(firebaseKey){
    try{
        const productRes = await fetch(`https://variant-4d481-default-rtdb.firebaseio.com/products/${firebaseKey}.json`)
        const productData = await productRes.json()

        const res = await fetch("https://variant-4d481-default-rtdb.firebaseio.com/history.json",{
            method: "POST",
            body: JSON.stringify({
                name: productData.humanName,
                surname: productData.humanSurame,
                somethink: productData.somethinkName,
                phone: productData.phone
            })
        })
        
    }catch(err){
        console.log(err)
    }
}
async function editProduct(firebaseKey){
    getSomethinks()
    footer.style.display = "flex"
    infoModal.style.display = "block"
    infoFormTitle.textContent = "Mahsulotni o'zgartirish"
    infoSubmitBtn.textContent = "o'zgartirish"

    try{
        const res = await fetch(`https://variant-4d481-default-rtdb.firebaseio.com/products/${firebaseKey}.json`)
        const data = await res.json()

        infoHumanName.value = data.humanName
        infoHumanSurame.value = data.humanSurame
        infoHumanPhone.value = data.phone
        infoBuyDate.value = data.buyDate
        infoSellDate.value = data.sellDate
        infoBuyPrice.value = data.buyPrice
        infoMonthlyPrice.value = data.monthlyPrice
        infoComment.value = data.comment
        isAddOrEdit = true
        editFirebaseKey = firebaseKey
    }catch(err){
        console.log(err)
    }
}

getProducts()