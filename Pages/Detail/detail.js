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
    }catch(err){
        console.log(err)
    }
}

getProduct()