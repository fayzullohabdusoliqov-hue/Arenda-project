const headerBtn = document.querySelector(".header_btn")
const sidebar = document.querySelector(".site__sidebar")
const detailImage = document.querySelector(".detail_img")
const detailSomethinkName = document.querySelector(".detail__name")
const detailOwener = document.querySelector(".detail__owner")
const detailBuyDate = document.querySelector("#buyDate")
const detailSellDate = document.querySelector("#sellDate")
const detailBuyPrice = document.querySelector("#buyPrice")
const detailMonthlyPrice = document.querySelector("#monthlyPrice")
const detailPhone = document.querySelector("#phone")
const detailComment = document.querySelector("#comment")
const detailDateList = document.querySelector(".detail__list")
const detailPluse = document.querySelector("#momentPluse")
const detailMinuse = document.querySelector("#momentMinuse")
const detailPhoneDiv = document.querySelector("#phone-div")
const detailCommentDiv = document.querySelector("#comment-div")
firebaseKey = new URLSearchParams(window.location.search).get("key")

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

async function getProduct(){
    try{
        const res = await fetch(`https://variant-4d481-default-rtdb.firebaseio.com/products/${firebaseKey}.json`)
        const data = await res.json()
        const trues = how(data.monthlyStatus)
        const falses = months(data) - trues + 1
        watchData(data.monthlyStatus)

        if(data.image){
            detailImage.style.display = "block"
            detailImage.src = `${data.image}`
        }else{
            detailImage.style.display = "none"
        }
        detailOwener.textContent = `${data.humanName}`
        detailSomethinkName.textContent = `${data.somethinkName}`
        detailPhone.textContent = `${data.phone}`
        detailBuyDate.textContent = `${data.buyDate}`
        detailSellDate.textContent = `${data.sellDate}`
        detailBuyPrice.textContent = `${data.buyPrice}$`
        detailMonthlyPrice.textContent = `${data.monthlyPrice}$`
        detailComment.textContent = `${data.comment}`
        detailMinuse.textContent = `${data.monthlyPrice * falses}$`
        detailPluse.textContent = `${data.monthlyPrice * trues}$`

        if (!data.phone?.trim()) {      
            detailPhoneDiv.style.display = "none"
        }
        if (!data.comment?.trim()) {
            detailCommentDiv.style.display = "none"
        }
    }catch(err){
        console.log(err)
    }
}
function watchData(object){
    const filter_0 = Object.entries(object).map(([key, value]) => ({date: key, isTrue: value}))
    const index_0 = filter_0[0]
    const dates = filter_0.filter((el) => el.date != index_0.date)

    detailDateList.innerHTML = ""
    for(let i = 0; i < dates.length; i++){
        detailDateList.innerHTML += `
            <li class="data_item">
                <h4 class="data_subtitle">${dates[i].date}</h4>
                <button onclick='editDate(${JSON.stringify(dates[i])})' class="data_btn ${dates[i].isTrue? "green" : "red"}">${dates[i].isTrue? "To'langan" : "To'lanmagan"}</button>
            </li>        
        `
    }
}
async function editDate(value){
    try{
        const res = await fetch(`https://variant-4d481-default-rtdb.firebaseio.com/products/${firebaseKey}.json`)
        let data = await res.json()

        data.monthlyStatus[value.date] = !data.monthlyStatus[value.date]
        const resUpdate = await fetch(`https://variant-4d481-default-rtdb.firebaseio.com/products/${firebaseKey}.json`, {
            method: "PATCH",
            body: JSON.stringify(data)
        })
    }catch(err){
        console.log(err.message)
    }finally{
        getProduct()
    }
}
function how(object){
    const array = Object.entries(object).map(([key, value]) => (value))
    let trues = 0

    for(let i = 0; i < array.length; i++){
        if(array[i]){
            trues += 1
        }
    }

    return trues
}
function months(data){
    const start = new Date(data.buyDate)
    const end = new Date(data.sellDate)
    
    const months = (end.getMonth() - start.getMonth()) + ((end.getFullYear() - start.getFullYear()) * 12)
    return months
}

getProduct()