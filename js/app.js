const fieldWidth = document.querySelector(".field").offsetWidth;
const fieldHeight = document.querySelector(".field").offsetHeight;
const parcel = 6;

const team1 = document.querySelector("#team1");
const team2 = document.querySelector("#team2");

const downloadButton = document.querySelector(".download");

function lineUp(team) {
    const formation = team.querySelector(".formation").value.split(",");
    const players = team.querySelectorAll(".player");

    for (let i = 0; i < players.length; i++) {
        players[i].style.left = ((fieldWidth / (parcel + 1)) * formations[formation[0]].formations[formation[1]].lineup[i][1]) - (players[i].offsetWidth / 2) +"px";
        players[i].style.bottom = ((fieldHeight / (parcel + 1)) * formations[formation[0]].formations[formation[1]].lineup[i][0]) - (players[i].offsetHeight / 2) +"px";
    }

}

function buildTeam(team) {
    const playersElement = team.querySelector(".players");
    const formation = team.querySelector(".formation").value.split(",");

    playersElement.innerHTML = "";

    for (let i = 0; i < formations[formation[0]].formations[formation[1]].lineup.length; i++) {
        playersElement.innerHTML += `
        <div data-id="${i}" class="player">
            <img class="player-avatar" src="./img/avatar.png">
            <div class="player-details">
                <span class="player-number" spellcheck="false" onkeydown="if (event.key === 'Backspace') {return;} else if(isNaN(event.key) || this.innerText.length > 1){event.preventDefault();}" contenteditable="true">${i + 1}</span>
                <span class="player-name" spellcheck="false" contenteditable="true">Oyuncu</span>
            </div>
        </div>
        `
    }
    lineUp(team);
}

function createFormations() {
    const teams = document.querySelectorAll(".field");

    teams.forEach(function(team) {
        const selectElement = team.querySelector(".formation");
        
        for (let i = 0; i < formations.length; i++) {
            const optElement = document.createElement("optgroup");

            optElement.label = formations[i].name;
            optElement.setAttribute("value", i)

            for (let j = 0; j < formations[i].formations.length; j++) {
                const optionElement = document.createElement("option");

                optionElement.value = `${i},${j}`;
                optionElement.innerHTML = formations[i].formations[j].name;

                optElement.append(optionElement);
            }

            selectElement.append(optElement);
        }
    });
}

document.addEventListener('focusout', function(e) {
    if (e.target && e.target.className == "player-name" && e.target.innerText == "") {
        e.target.innerText = "Oyuncu";
    }
    else if (e.target && e.target.className == "player-number" && e.target.innerText == "") {
        e.target.innerText = "-";
    }
    lineUp(team1);
    lineUp(team2);
});

document.addEventListener('focusin', function(e) {
    if (e.target && e.target.className == "player-name" && e.target.innerText == "Oyuncu") {
        e.target.innerText = "";
        e.target.focus();
    }
    else if (e.target && e.target.className == "player-number" && e.target.innerText === "-") {
        e.target.innerText = "";
    }
});

document.addEventListener('input', function(e) {
    if (e.target && e.target.className == "player-name" || e.target.className == "player-number") {
        lineUp(team1);
        lineUp(team2);
    }
});

document.addEventListener('change', function(e) {
    if(e.target && e.target.className == 'formation'){
        const team = e.target.parentNode.parentNode.getAttribute('id');
        buildTeam(document.getElementById(team));
    }
    else if(e.target && e.target.className == 'checkbox'){
        if (e.target.id === "hide1") {
            team1.classList.toggle("hide");
        }
        else if (e.target.id === "hide2") {
            team2.classList.toggle("hide");
        }
        lineUp(team1);
        lineUp(team2);

        if (team2.classList.contains("hide")) {
            document.querySelector('#hide1').parentNode.style.display = "none";
            document.querySelector('#hide2').parentNode.style.display = "block";
        } 
        else if (team1.classList.contains("hide")) {    
            document.querySelector('#hide2').parentNode.style.display = "none";
            document.querySelector('#hide1').parentNode.style.display = "block";
        } else {
            document.querySelector('#hide2').parentNode.style.display = "block";
            document.querySelector('#hide1').parentNode.style.display = "block";
        }
    }
});

document.addEventListener('click', function(e) {
    if(e.target && e.target.tagName === "IMG"){
        let input = document.createElement("input");
        input.type = "file";
        input.setAttribute("accept", "image/*");
        input.onchange = _ => {
                  let files =   Array.from(input.files);
                  e.target.src = URL.createObjectURL(files[0]);
                  input.remove();
        };
        input.click();      
    }
});

downloadButton.addEventListener('click', function() {
    const teams = document.querySelector('.teams');
    html2canvas(document.querySelector('.teams'), {width: teams.offsetWidth, height: teams.offsetHeight}).then((canvas) => {
        window.open().document.write('<img src="' + canvas.toDataURL() + '" />');
    });
});

document.addEventListener('DOMContentLoaded', function() {
    createFormations();
    buildTeam(team1);
    buildTeam(team2);
});