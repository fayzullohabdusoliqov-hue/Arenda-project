const headerBtn = document.querySelector(".header_btn")
const sidebar = document.querySelector(".site__sidebar")
const wrapper = document.querySelector(".profit__wrapper")
const profitSection = document.querySelector(".profit")
monthly = 0
profit = 0

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

async function getProducts(){
    try{
        const res = await fetch("https://variant-4d481-default-rtdb.firebaseio.com/products.json")
        const json = await res.json()

        if(json){
            const data = Object.values(json)
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
        data.forEach((el) => {
            conculateMonthly(el.buyDate, el.sellDate)
            conculateProfit(monthly, el.monthlyPrice, el.buyPrice)
            wrapper.innerHTML += `
                <div class="product-details">
                    <div class="product-header">
                        <div>
                            <h2>${el.humanName}</h2>
                            <p>${el.monthlyPrice}$</p>
                        </div>
                        <span class="product-status">${el.somethinkName}</span>
                    </div>
                    <div class="product-info">
                        <div class="info-item">
                            <span class="info-label">Sotib olingan sana</span>
                            <h3>${el.buyDate}</h3>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Arenda tugaydigan sana</span>
                            <h3>${el.sellDate}</h3>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Sotib olingan narxi</span>
                            <h3>${el.buyPrice}$</h3>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Arenda muddati</span>
                            <h3>${monthly} oy</h3>
                        </div>
                        <div class="info-item profit-item">
                            <span class="info-label">Kutilayotgan foyda</span>
                            <h3>${profit}$</h3>
                        </div>
                    </div>
                </div>
            `
        })
    }else{
        profitSection.innerHTML = `
            <h3 class='profit_dont-have'>Mahsulotlar mavjud emas!</h3>
        `
    }
}

function conculateMonthly(startDate, endDate){
    const start = new Date(startDate)
    const end = new Date(endDate)
    monthly = 
        (end.getFullYear() - start.getFullYear()) * 12 +
        (end.getMonth() - start.getMonth())
}
function conculateProfit(monthly, monthlyPrice, buyPrice){
    let total = monthly * monthlyPrice
    profit = total - buyPrice
}

getProducts()