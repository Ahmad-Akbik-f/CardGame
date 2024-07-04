let splashScreen = document.querySelector('.splash')
let splashBtn = document.querySelector('.splash button')
let cards = document.querySelectorAll('.cards .card-box')
let header = document.querySelector('header')
let Name = document.querySelector('header .name')
let score = document.querySelector('header .score')
let dashBord = document.querySelector('.dash-bord')
let success = new Audio("./Sounds/short-success-sound-glockenspiel-treasure-video-game-6346.mp3")
let wrong = new Audio("./Sounds/wrong-answer-126515.mp3")
let fail = new Audio("./Sounds/fail-144746.mp3")
let winAudio = new Audio("./Sounds/success-fanfare-trumpets-6185.mp3")
let scoreCnt = 0;
let chosen = [];
let ranking = [];
let names = [];
let timerM = 1;
let timerS = 0;
let local = JSON.parse(localStorage.getItem("MemoryGame")) || []
let activeLocal;
//
cards.forEach(el =>{
    el.children[1].style.backgroundColor = el.dataset.color
    el.style.order = parseInt(Math.random() * 16)
})
//
if(local.length > 0){
    local.forEach((el,i)=>{
        if(el.score != 0){
            ranking.push(el.score)
            names.push(el.name)
        }
        if(el.score > ranking[i - 1]){
            let swap = ranking[i - 1]
            ranking[i - 1] = el.score
            ranking[i] = swap
            let swap2 = names[i - 1]
            names[i - 1] = el.name
            names[i] = swap2
        }
    })
    console.log(ranking)
    console.log(names)
    names.forEach((el , i)=>{
        let rank = document.createElement('p')
        rank.classList.add('rank')
        if(names.length > 9){
            dashBord.classList.add('extend')
        }
        rank.textContent =  `${i + 1} - ${names[i]} ${ranking[i]}`
        dashBord.append(rank)
    })
}else{
    dashBord.children[0].remove()
}
//
splashBtn.onclick = ()=>{
    local = JSON.parse(localStorage.getItem("MemoryGame")) || []
    splashScreen.remove()
    dashBord.remove()
    let nameProm = (prompt("Input Your Name")) || "Guest"
    Name.textContent = nameProm
    local.push({"name":nameProm,"score":scoreCnt})
    score.textContent = local[local.length - 1].score

    if(nameProm != "Guest"){

        local.forEach((el,i) =>{
            localStorage.setItem("MemoryGame",JSON.stringify(local))
            
            if(nameProm.toLowerCase() == el.name.toLowerCase() && i != local.length - 1){
                activeLocal = i
                local.pop()
                localStorage.setItem("MemoryGame",JSON.stringify(local))
            }

        })

    }

    cards.forEach(el =>{
        el.classList.add('active')
        setTimeout(()=>{
            el.classList.remove('active')
        },1500)
    })

    let time = document.createElement('p')
    time.textContent = `${timerM}:${timerS}`
    time.style.order = 3
    header.append(time)
    timer(time)
}
//
cards.forEach(el =>{
    el.onclick = () =>{
        if(chosen.length < 2 && !(el.classList.contains('active'))){
            el.classList.add('active')
            chosen.push(el)
            if(chosen.length == 2){
                if(chosen[0].dataset.color == chosen[1].dataset.color){
                    success.play()
                    if(Name.textContent != "Guest"){
                        local = JSON.parse(localStorage.getItem("MemoryGame")) || []
                        if(activeLocal != -1 && activeLocal != undefined){
                            local[activeLocal].score += 10
                        }else{
                            local[local.length - 1].score += 10
                        }
                        localStorage.setItem("MemoryGame",JSON.stringify(local))
                    }
                    scoreCnt += 10
                    score.textContent = scoreCnt
                    chosen.pop()
                    chosen.pop()
                    Win()
                }else{
                    wrong.play()
                    var flip = setTimeout(()=>{
                        chosen.forEach(ele =>{
                            ele.classList.remove('active')
                        })
                        chosen.pop()
                        chosen.pop()
                    },1000)
                }
            }
        }
    }
})

//Functions
function timer(el){
    let inter = setInterval(()=>{
        if(timerS > 0){
            timerS--;
            console.log(timerS)
            el.textContent = `${timerM}:${timerS}`
        }else{
            if(timerM > 0){
                timerS = 59;
                timerM--;
                el.textContent = `${timerM}:${timerS}`
                console.log(timerM)
            }
            if(timerM == 0 && timerS == 0 && scoreCnt < 90){
                let failed = document.createElement('div')
                failed.classList.add("win-fail")
                failed.textContent = "I'm Sorry But Your Brain Stincks 😞"
                document.body.appendChild(failed)
                clearInterval(inter)
                let refreshBtn = document.createElement('button')
                refreshBtn.classList.add('btn')
                refreshBtn.textContent = "Restart"
                failed.appendChild(refreshBtn)
                refreshBtn.onclick = ()=>{window.location.reload()}
                fail.play()
            }
        }
    },1000)
}


function Win(){
    if (scoreCnt >= 90) {
        let winText = document.createElement('div')
        winText.classList.add("win-fail")
        winText.textContent = "You Win The Game Congtatz 🎉🎊🎉"
        let refreshBtn = document.createElement('button')
        refreshBtn.classList.add('btn')
        refreshBtn.textContent = "Restart"
        winText.appendChild(refreshBtn)
        setTimeout(()=>{
            document.body.append(winText)
        },300)
        winAudio.play()
        refreshBtn.onclick = ()=>{window.location.reload()}
    }
}