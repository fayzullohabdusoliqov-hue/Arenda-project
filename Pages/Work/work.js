const headerBtn = document.querySelector(".header_btn")
const sidebar = document.querySelector(".site__sidebar")

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