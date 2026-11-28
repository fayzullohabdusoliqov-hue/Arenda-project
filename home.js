const sidebar = document.querySelector(".site__sidebar")
const footer = document.querySelector(".site__footer")
const headerBtn = document.querySelector(".header_btn")
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
const dashboardProfitHave = document.querySelector("#profitHave")
const dashboardProfitGive = document.querySelector("#profitGive")
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

async function getHistory(){
    try{
        const res = await fetch("https://variant-4d481-default-rtdb.firebaseio.com/history.json")
        const json = await res.json()

        if(json){
            const data = Object.entries(json).map(([key,value]) => ({firebaseKey: key, ...value}))
            renderHistory(data)
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
    }
}
function renderHistory(data){
    if(data){
        historyList.innerHTML = ""
        data.forEach((el, index) => {
            historyList.innerHTML += `
                    <li class="history_item">
                        <div class="history__inner">
                            <strong class="history_strong">${index + 1}</strong>
                            <h4 class="history_subtitle">${el.name}</h4>
                        </div>
                        <div class="history__btns">
                            <span class="history_number">${el.phone}</span>
                            <span class="history_number">${el.somethink}</span>
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


function getMonthCount(startDate, endDate) {
    const [startYear, startMonth] = startDate.split("-").map(Number)
    const [endYear, endMonth] = endDate.split("-").map(Number)

    return (endYear - startYear) * 12 + (endMonth - startMonth) + 1
}
function calculateProfit(startDate, endDate, monthlyPayment) {
    const months = getMonthCount(startDate, endDate)

    return months * monthlyPayment
}
function canculateFalses(startDate, endDate, trueCount) {
    const months = getMonthCount(startDate, endDate)

    return Math.max(0, months - trueCount)
}
async function getProducts() {
    try {
        const res = await fetch(
            "https://variant-4d481-default-rtdb.firebaseio.com/products.json"
        )

        if (!res.ok) throw new Error("Ma'lumotlarni olishda xatolik")

        const json = await res.json()

        let spentTotal = 0
        let profitTotal = 0
        let profitHave = 0
        let profitGive = 0

        if (json) {
            const data = Object.values(json)

            for (const product of data) {
                const monthlyPrice = Number(product.monthlyPrice) || 0
                const buyPrice = Number(product.buyPrice) || 0

                spentTotal += buyPrice

                const totalMonths = getMonthCount(
                    product.buyDate,
                    product.sellDate
                )

                profitTotal += calculateProfit(
                    product.buyDate,
                    product.sellDate,
                    monthlyPrice
                )

                const monthlyStatus = product.monthlyStatus || {}

                let trueCount = 0

                const [startYear, startMonth] =
                    product.buyDate.split("-").map(Number)

                for (let i = 0; i < totalMonths; i++) {
                    const date = new Date(startYear, startMonth - 1 + i)

                    const year = date.getFullYear()
                    const month = String(date.getMonth() + 1).padStart(2, "0")

                    const key = `${year}-${month}`

                    if (monthlyStatus[key] === true) {
                        trueCount++
                    }
                }

                profitHave += trueCount * monthlyPrice

                profitGive += canculateFalses(
                    product.buyDate,
                    product.sellDate,
                    trueCount
                ) * monthlyPrice
            }

            dashboardSomethinks.textContent = `${data.length} ta`
            dashboardProfit.textContent = `${profitTotal - spentTotal}$`
            dashboardProfitHave.textContent = `${profitHave}$`
            dashboardProfitGive.textContent = `${profitGive}$`
            dashboardSpent.textContent = `${spentTotal}$`

        } else {
            dashboardSomethinks.textContent = "0 ta"
            dashboardProfit.textContent = "0$"
            dashboardProfitHave.textContent = "0$"
            dashboardProfitGive.textContent = "0$"
            dashboardSpent.textContent = "0$"
        }

    } catch (err) {
        console.log(err)
    }
}

getHistory()
getProducts()