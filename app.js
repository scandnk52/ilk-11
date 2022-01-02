const formations = [
    "1-4-2-3-1",
    "1-4-4-2",
    "1-4-4-1-1",
    "1-4-3-3",
    "1-4-1-4-1",
    "1-4-1-2-1-2",
    "1-4-1-3-2",
    "1-4-1-2-3",
    "1-4-2-2-2",
    "1-4-3-1-2",
    "1-4-5-1",
    "1-3-4-3",
    "1-3-1-4-2",
    "1-3-4-2-1",
    "1-3-4-1-2",
    "1-3-5-2",
    "1-3-5-1-1",
    "1-3-2-3-2",
    "1-3-3-2-2",
    "1-3-3-3-1",
    "1-5-3-2",
    "1-5-4-1",
    "1-5-2-3"
];

const settings = {
    teams: [
        {
            id: "#team1",
            formation: formations[0],
            players: [
                {
                    number: 1,
                    name: "Oyuncu"
                },
                {
                    number: 2,
                    name: "Oyuncu"
                },
                {
                    number: 4,
                    name: "Oyuncu"
                },
                {
                    number: 5,
                    name: "Oyuncu"
                },
                {
                    number: 3,
                    name: "Oyuncu"
                },
                {
                    number: 6,
                    name: "Oyuncu"
                },
                {
                    number: 8,
                    name: "Oyuncu"
                },
                {
                    number: 7,
                    name: "Oyuncu"
                },
                {
                    number: 10,
                    name: "Oyuncu"
                },
                {
                    number: 11,
                    name: "Oyuncu"
                },
                {
                    number: 9,
                    name: "Oyuncu"
                },
            ],
        },
        {
            id: "#team2",
            formation: formations[0],
            players: [
                {
                    number: 1,
                    name: "Oyuncu"
                },
                {
                    number: 3,
                    name: "Oyuncu"
                },
                {
                    number: 4,
                    name: "Oyuncu"
                },
                {
                    number: 5,
                    name: "Oyuncu"
                },
                {
                    number: 2,
                    name: "Oyuncu"
                },
                {
                    number: 8,
                    name: "Oyuncu"
                },
                {
                    number: 6,
                    name: "Oyuncu"
                },
                {
                    number: 11,
                    name: "Oyuncu"
                },
                {
                    number: 10,
                    name: "Oyuncu"
                },
                {
                    number: 7,
                    name: "Oyuncu"
                },
                {
                    number: 9,
                    name: "Oyuncu"
                },
            ],
        }
    ]
};

function createFormations() {

    const formation = document.createElement('select');
    formation.classList.add('team-formation');
    formation.setAttribute('name', 'team-formation');

    for (let i = 0; i < formations.length; i++) {
        formation.innerHTML += `<option value="${i}">${formations[i].substring(2)}</option>`;
    }

    document.querySelectorAll('.head-team').forEach(team => {
        team.appendChild(formation.cloneNode(true));
    })

}

function lineUpTeam(team) {
    const formation = team.formation.match(/[0-9]/g);
    let player = 0;

    document.querySelector(team.id + " .team-lineup").innerHTML = " ";

    for (let i = 0; i < formation.length; i++) {
        
        const row = document.createElement('div');
        row.classList.add("lineup-row");

        for (let j = 0; j < formation[i]; j++) {
            row.innerHTML += `
            <div data-playerid="${player}" data-team="${team.id}" class="player">
                <span class="player-number" spellcheck="false" contenteditable="true">${team.players[player].number}</span>
                <p class="player-name" spellcheck="false" contenteditable="true">${team.players[player].name}</p>
            </div>
            `;
            player++;
        }

        document.querySelector(team.id + " .team-lineup").append(row);

    }
}

document.addEventListener('change', function(e) {
    if(e.target && e.target.name == 'team-formation'){
        const team = e.target.parentNode.parentNode.getAttribute('data-team');
        settings.teams[team].formation = formations[e.target.value];
        lineUpTeam(settings.teams[team]);
    }
});

document.addEventListener('focusout', function(e) {
    if (e.target && e.target.className == "player-name") {

        const name = e.target.innerText;
        const team = e.target.parentNode.parentNode.parentNode.parentNode.getAttribute('data-team');
        const id = e.target.parentNode.getAttribute('data-playerid');
        
        if (name.trim() !== "") {
            settings.teams[team].players[id].name = name;
        } else {
            e.target.innerText = settings.teams[team].players[id].name;
        }

    } else if (e.target && e.target.className == "player-number") {

        const number = e.target.innerText.substring(0,2);
        const team = e.target.parentNode.parentNode.parentNode.parentNode.getAttribute('data-team');
        const id = e.target.parentNode.getAttribute('data-playerid');

        settings.teams[team].players[id].number = number;
        e.target.innerText = settings.teams[team].players[id].number;

    }
});

document.addEventListener('focusin', function(e) {
    if (e.target && e.target.className == "player-name") {
        e.target.innerText = "";
    }
});

document.querySelector('.download-lineup').addEventListener('click', function(e) {
    html2canvas(document.querySelector('.teams'), {width: 741, height: 1045}).then((canvas) => {
        window.open().document.write('<img src="' + canvas.toDataURL() + '" />');
    });
});

lineUpTeam(settings.teams[0]);
lineUpTeam(settings.teams[1]);
createFormations();