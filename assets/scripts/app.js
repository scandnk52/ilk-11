class App {

    appName = "İLK 11";
    version = "v3.0";
    images = "./assets/images/";

    avatar = this.images+"avatar.png";
    name = "Oyuncu";

    parcel = 6;

    teams = [
        {
            name: "Takım 1",
            logo: this.images+"team.png",
            formation: [0, 0],
            reverse: false,
            players: []
        },
        {
            name: "Takım 2",
            logo: this.images+"team.png",
            formation: [0, 0],
            reverse: true,
            players: []
        }
    ];

    constructor(app, formations) {
        this.app = app;
        this.formations = formations;
    }

    build() {   
        this.pitch = document.createElement('div');
        this.pitch.classList.add("pitch");

        this.app.append(this.pitch);

        this.width = this.pitch.offsetWidth;
        this.height = this.pitch.offsetHeight;

        window.onresize = this.resizePitch.bind(this);

        this.buildTeams();
        this.buildFabs();
    }

    buildFabs() {
        const fabContainer = document.createElement('div');
        fabContainer.classList.add('floating-action-container');

        const downloadFab = document.createElement('button');
        downloadFab.classList.add('floating-action');
        downloadFab.setAttribute('tooltip', 'Kadroyu İndir');
        downloadFab.innerHTML = "&#8681;";

        fabContainer.append(downloadFab);

        downloadFab.onclick = this.downloadImage.bind(this);

        const settingsFab = document.createElement('button');
        settingsFab.classList.add('floating-action');
        settingsFab.setAttribute('tooltip', 'Ayarlar');
        settingsFab.innerHTML = "&#x26ED;";

        fabContainer.append(settingsFab);
        
        settingsFab.onclick = this.settings.bind(this);

        document.body.append(fabContainer);
    }

    settings() {
        const editForm = document.createElement('form');

        const checkboxFirstTeam = this.checkBoxInput("1. Takımı gizle", this.teams[0].hide, this.teams[1].hide);
        const checkboxSecondTeam = this.checkBoxInput("2. Takımı gizle", this.teams[1].hide, this.teams[0].hide);
        const checkboxFullSize = this.checkBoxInput("Diğer takım gizlenince takımı tüm sahaya diz", this.fullSize);
        const checkboxRememberPlayers = this.checkBoxInput("Oyuncu adlarını hatırla", this.rememberPlayers);

        const appName = document.createElement('p');
        appName.classList.add('app-name')
        appName.innerText = this.appName + " " + this.version;

        editForm.append(appName);

        editForm.append(checkboxFirstTeam.element);
        editForm.append(checkboxSecondTeam.element);
        editForm.append(checkboxFullSize.element);
        editForm.append(checkboxRememberPlayers.element);


        checkboxFirstTeam.element.onchange = function(e) {
            e.preventDefault();
            const status = e.target.checked;

            if (status) {
                checkboxSecondTeam.input.disabled = true;
                this.teams[0].hide = true;

                this.pitch.style.height = this.height / 2 + "px";
                this.teams[1].element.style.marginbottom = "500px";
            } else {
                checkboxSecondTeam.input.disabled = false;
                this.teams[0].hide = false;
            }

            this.buildPlayers(this.teams[0]);
            this.buildPlayers(this.teams[1]);
        }.bind(this);

        this.createModal("Ayarlar", editForm, true);

        checkboxSecondTeam.element.onchange = function(e) {
            e.preventDefault();
            const status = e.target.checked;

            if (status) {
                checkboxFirstTeam.input.disabled = true;
                this.teams[1].hide = true;
            } else {
                checkboxFirstTeam.input.disabled = false;
                this.teams[1].hide = false;
            }

            this.buildPlayers(this.teams[0]);
            this.buildPlayers(this.teams[1]);
        }.bind(this);

        checkboxFullSize.element.onchange = function(e) {

            e.preventDefault();
            this.fullSize = e.target.checked;
            
            (this.teams[0].hide) ? this.buildPlayers(this.teams[1]) : '';
            (this.teams[1].hide) ? this.buildPlayers(this.teams[0]) : '';

        }.bind(this);

        checkboxRememberPlayers.element.onchange = function(e) {
            e.preventDefault();
            this.rememberPlayers = e.target.checked;
        }.bind(this);

        editForm.onsubmit = function(e) {
            e.preventDefault();
        }.bind(this);

        editForm.onsubmit = function(e) {
            e.preventDefault();
        }.bind(this);
    }

    downloadImage() {
        document.body.classList.add('no-animation');

        html2canvas(this.pitch, {width: this.width, height: this.pitch.offsetHeight}).then(function(canvas) {

            const image = canvas.toDataURL();
            
            const link = document.createElement('a');

            link.href = image;
            link.download = 'kadro';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }).finally(function () {
            document.body.classList.remove('no-animation');
        });
    }

    buildTeams() {
        for (let i = 0; i < this.teams.length; i++) {
            
            const teamElement = document.createElement('div');
            teamElement.classList.add('team');
            (this.teams[i].reverse) ? teamElement.classList.add('team-reverse') : '';

            teamElement.formation = this.teams[i].formation;

            const teamDetailsElement = document.createElement('div');
            teamDetailsElement.classList.add('team-details');

            teamElement.append(teamDetailsElement);

            const teamInfoElement = document.createElement('div');
            teamInfoElement.classList.add('team-info');

            teamDetailsElement.append(teamInfoElement);

            teamInfoElement.onclick = this.editTeam.bind(this, this.teams[i]);

            const teamLogoElement = document.createElement('img');
            teamLogoElement.classList.add('team-logo');
            teamLogoElement.setAttribute('src', this.teams[i].logo);

            teamInfoElement.append(teamLogoElement);

            const teamNameElement = document.createElement('p');
            teamNameElement.classList.add('team-name');
            teamNameElement.innerText = this.teams[i].name;

            teamInfoElement.append(teamNameElement);

            const playersElement = document.createElement('div');
            playersElement.classList.add('players');

            teamElement.append(playersElement);

            this.pitch.append(teamElement);

            this.teams[i].element = teamElement;

            this.buildFormations(this.teams[i]);
            this.buildPlayers(this.teams[i]);
            this.lineUpTeam(this.teams[i]);
        }
    }

    editTeam(team) {
        const editForm = document.createElement('form');
        
        const teamName = team.element.querySelector('.team-name');

        const textInput = this.textInput("Takım Adı", team.name);

        editForm.append(textInput.element);

        const imageInput = this.imageInput("Takım Logosu");

        editForm.append(imageInput.element);

        this.createModal(team.name, editForm);

        editForm.onsubmit = function(e) {
            e.preventDefault();

            team.name = textInput.input.value;
            teamName.innerText = team.name;

            const image = this.createImageByFile(imageInput.input);

            if (image) {
                team.logo = image;
                team.element.querySelectorAll('.team-logo')[0].src = team.logo;
            }

        }.bind(this);

        this.modal.onpaste = function(e) {
            imageInput.input.files = this.getImageFromClipboard(e);
            this.setPreviewImage(imageInput);
        }.bind(this);
    }
    
    resizePitch() {

        document.body.classList.add('no-animation');

        setTimeout(function(){
            this.width = this.pitch.offsetWidth;

            this.lineUpTeam(this.teams[0]);
            this.lineUpTeam(this.teams[1]);

        }.bind(this), 500);

        document.body.classList.remove('no-animation');

    }

    buildFormations(team) {
        const selectDiv = document.createElement('div');
        selectDiv.classList.add('select');

        const selectElement = document.createElement('select');

        selectDiv.append(selectElement);

        for (let i = 0; i < this.formations.length; i++) {
            const optElement = document.createElement("optgroup");

            optElement.label = this.formations[i].name;
            optElement.setAttribute("value", i)

            for (let j = 0; j < this.formations[i].lineups.length; j++) {
                const optionElement = document.createElement("option");

                optionElement.value = `${i},${j}`;
                optionElement.innerHTML = this.formations[i].lineups[j].name;

                (team.formation[0] == i && team.formation[1] == j) ? optionElement.setAttribute('selected', '') : '';

                optElement.append(optionElement);
            }

            selectElement.append(optElement);
        }

        selectElement.onchange = this.changeFormation.bind(this, team);

        const teamDetailsElement = team.element.getElementsByClassName('team-details')[0];
        teamDetailsElement.append(selectDiv);
    }

    changeFormation(team, e) {
        const formation = e.target.value.split(',');
        team.formation = [Number(formation[0]), Number(formation[1])];

        this.buildPlayers(team);
        this.lineUpTeam(team);
    }

    buildPlayers(team) {

        const playersElement = team.element.querySelectorAll('.players')[0];
        playersElement.innerHTML = "";

        if (!this.rememberPlayers) team.players = [];

        let hasHide = false;

        if (!this.fullSize) {
            this.teams.map(function (otherTeam) {
                if (otherTeam.hide) {
                    hasHide = true;
                    this.pitch.style.height = this.height / 2 + "px";
                    if (!otherTeam.reverse) {
                        this.pitch.classList.add('hide-first-team');
                    } else {
                        this.pitch.classList.remove('hide-first-team');
                    }
                    return;
                }
            }.bind(this));
        } else {
            this.pitch.style.height = this.width;
        }

        if (!hasHide) {
            this.pitch.style.height = this.height + "px";
            this.pitch.classList.remove('hide-first-team');
        }

        for (let i = 0; i < this.formations[team.formation[0]].lineups[team.formation[1]].lineup.length; i++) {

            if (this.rememberPlayers && team.players[i]) {
                const player = team.players[i];
                playersElement.append(player);
                continue;
            }

            const playerElement = document.createElement('div');
            playerElement.classList.add('player')

            team.players.push(playerElement);

            this.swapPlayers(playerElement);

            playerElement.setAttribute('draggable', 'true');

            playerElement.onclick = this.editPlayer.bind(this, team.players[i]);

            const avatarDiv = document.createElement('div');
            avatarDiv.classList.add('player-avatar');

            playerElement.append(avatarDiv);

            const avatarElement = document.createElement('img');
            avatarElement.classList.add('avatar');
            avatarElement.setAttribute('src', this.avatar);

            avatarDiv.append(avatarElement);

            const playerDetailsElement = document.createElement('div');
            playerDetailsElement.classList.add('player-details');

            playerElement.append(playerDetailsElement);

            const numberElement = document.createElement('p');
            numberElement.classList.add('player-number');
            numberElement.innerText = i+1;

            playerDetailsElement.append(numberElement);

            const nameElement = document.createElement('p');
            nameElement.classList.add('player-name');
            nameElement.innerText = this.name;

            playerDetailsElement.append(nameElement);

           playersElement.append(playerElement);
        }

        if (team.hide) {
            team.element.classList.add('hide-team');
        } else {
            team.element.classList.remove('hide-team');
            this.lineUpTeam(team);
        }

    }

    swapPlayers(player) {

        player.ondragstart = function(e) {
            e.dataTransfer.setData('text/html', e.target.innerHTML);
            this.drag = e.target;
        }.bind(this);

        player.ondragover = function(e) {
            e.preventDefault();
        }.bind(this);

        player.ondragover = function(e) {
            e.preventDefault();
            player.classList.add('player-drag');
        }.bind(this);

        player.ondragleave = function(e) {
            e.preventDefault();
            player.classList.remove('player-drag');
        }.bind(this);

        player.ondrop = function(e) {
            e.preventDefault();

            player.classList.remove('player-drag');

            if(this.drag !== e.currentTarget) {
                this.drag.innerHTML = e.currentTarget.innerHTML;
                e.currentTarget.innerHTML = e.dataTransfer.getData('text/html');

                this.lineUpTeam(this.teams[0]);
                this.lineUpTeam(this.teams[1]);
            }

        }.bind(this);

        player.ontouchstart = function(e) {            
            this.drag = e.currentTarget;
        }.bind(this);

        player.ontouchmove = function(e) {
            e.preventDefault();

            player.classList.add('player-touch');
            player.style.top = (e.touches[0].pageY - (player.offsetHeight / 2) ) + "px";
            player.style.left = (e.touches[0].pageX - (player.offsetWidth / 2)) + "px";
        }.bind(this);

        player.ontouchend = function(e) {

            const X = e.changedTouches[0].clientX;
            const Y = e.changedTouches[0].clientY;

            const players = document.querySelectorAll('.player');

            for (let i = 0; i < players.length; i++) {
                const rect = players[i].getBoundingClientRect();

                const left = rect.x;
                const offsetWidth = players[i].offsetWidth;

                const top = rect.y;
                const offsetHeight = players[i].offsetHeight;

                if ((X > left && X < left + offsetWidth) && (Y > top && Y < top + offsetHeight)) {
                    if (players[i] !== player) {

                        const temp = this.drag.innerHTML;

                        this.drag.innerHTML = players[i].innerHTML;
                        players[i].innerHTML = temp;

                    }
                }
                
            }

            player.classList.remove('player-touch');

            this.lineUpTeam(this.teams[0]);
            this.lineUpTeam(this.teams[1]);
        }.bind(this);

        player.ontouchcancel = function(e) {
            player.classList.remove('player-touch');
            this.lineUpTeam(this.teams[0]);
            this.lineUpTeam(this.teams[1]);
        }.bind(this);
        
    }

    editPlayer(player) {
        const editForm = document.createElement('form');

        const name = player.querySelector('.player-name');
        const number = player.querySelector('.player-number');
        const imageElement = player.querySelector('.avatar');

        const textInput = this.textInput("Oyuncu Adı", name.innerText);

        editForm.append(textInput.element);

        const numberInput = this.numberInput("Oyuncu Numarası", number.innerText, 1, 99);

        editForm.append(numberInput.element);

        const imageInput = this.imageInput("Oyuncu Resmi");

        editForm.append(imageInput.element);

        this.createModal(name.innerText, editForm);

        editForm.onsubmit = function(e) {
            e.preventDefault();

            name.innerText = textInput.input.value;
            number.innerText = numberInput.input.value;

            const image = this.createImageByFile(imageInput.input);

            if (image) {
                imageElement.src = image;
            }

            this.teams.map(function(team) {
                team.players.map(function(p) {
                    if (p === player) {
                        this.lineUpTeam(team);
                    }
                }.bind(this));
            }.bind(this));

        }.bind(this);

        this.modal.onpaste = function(e) {
            imageInput.input.files = this.getImageFromClipboard(e);
            this.setPreviewImage(imageInput);
        }.bind(this);
    }

    lineUpTeam(team) {
        const formation = team.formation;
        const players = team.element.querySelectorAll(".player");

        let hasHide = false;

        this.teams.map(function (otherTeam) {
            if (otherTeam.hide) {
                hasHide = true;
                return;
            }
        });

        for (let i = 0; i < players.length; i++) {

            const reverseHeight = (this.fullSize && (this.teams[0].hide || this.teams[1].hide)) ? 0 : (!this.fullSize && team.reverse && hasHide) ? 0 :(team.reverse) ? (this.height / 2) : 0;
            const position = (team.reverse) ? this.parcel + 1 - this.formations[formation[0]].lineups[formation[1]].lineup[i][0] : this.formations[formation[0]].lineups[formation[1]].lineup[i][0];
            const height = (this.fullSize && (this.teams[0].hide || this.teams[1].hide)) ? this.height : this.height / 2;

            players[i].style.top = (((height) / (this.parcel + 1)) * position) - (players[i].offsetHeight / 2) + reverseHeight +"px";
            players[i].style.left = ((this.width / (this.parcel + 1)) * this.formations[formation[0]].lineups[formation[1]].lineup[i][1]) - (players[i].offsetWidth / 2) +"px";
        }
    }

    textInput(text, value) {
        const nameLabel = document.createElement('label');
        
        const namePlaceholder = document.createElement('span');
        namePlaceholder.innerText = text;

        nameLabel.append(namePlaceholder);

        const nameInput = document.createElement('input');
        nameInput.setAttribute('type', 'text');
        nameInput.value = value

        nameLabel.append(nameInput);

        return {element: nameLabel, input: nameInput};
    }

    numberInput(text, value, min, max) {
        const nameLabel = document.createElement('label');
        
        const namePlaceholder = document.createElement('span');
        namePlaceholder.innerText = text;

        nameLabel.append(namePlaceholder);

        const nameInput = document.createElement('input');
        nameInput.setAttribute('type', 'number');
        nameInput.setAttribute('min', min);
        nameInput.setAttribute('max', max);
        nameInput.value = value

        nameLabel.append(nameInput);

        return {element: nameLabel, input: nameInput};
    }

    checkBoxInput(text, bool = false, disabled = false) {
        const nameLabel = document.createElement('label');
        nameLabel.classList.add('switch');
        
        const nameInput = document.createElement('input');
        nameInput.setAttribute('type', 'checkbox');
        if (bool) nameInput.setAttribute('checked', '');
        if (disabled) nameInput.setAttribute('disabled', '');

        nameLabel.append(nameInput);

        const slider = document.createElement('span');
        slider.classList.add('switch-slider');

        nameLabel.append(slider);

        const namePlaceholder = document.createElement('span');
        namePlaceholder.classList.add('switch-label');
        namePlaceholder.innerText = text;

        nameLabel.append(namePlaceholder);

        return {element: nameLabel, input: nameInput};
    }

    imageInput(text) {
        const imageLabel = document.createElement('label');
        imageLabel.classList.add('drop-container');

        const imageTitle = document.createElement('p');
        imageTitle.innerText = text;

        imageLabel.append(imageTitle);

        const imagePlaceholder = document.createElement('span');
        imagePlaceholder.classList.add('drop-title');
        imagePlaceholder.innerText = "Sürükle bırak, yapıştır";

        imageLabel.append(imagePlaceholder);

        imageLabel.append("veya");

        const imageInput = document.createElement('input');
        imageInput.setAttribute('type', 'file');
        imageInput.setAttribute('accept', 'image/*');

        imageLabel.append(imageInput);

        const previewElement = document.createElement('div');
        previewElement.classList.add('drop-preview');

        imageLabel.append(previewElement);

        imageInput.onchange = function(e) {
            this.setPreviewImage(input);
        }.bind(this);

        imageLabel.ondragover = function(e) {
            e.preventDefault();
        }.bind(this);

        imageLabel.ondrop = function(e) {
            e.preventDefault();
            imageInput.files = e.dataTransfer.files;
            this.setPreviewImage(input)
        }.bind(this);

        const input = {element: imageLabel, input: imageInput};

        return input;
    }

    setPreviewImage(imageInput) {
        const previewDiv = imageInput.element.querySelectorAll('.drop-preview')[0];
        previewDiv.innerHTML = "";

        const image = this.createImageByFile(imageInput.input);

        if (image) {
            const imageElement = document.createElement('img');
        
            imageElement.src = image;
    
            previewDiv.append(imageElement);
        }
    }

    getImageFromClipboard(e) {
        const images = (e.clipboardData || e.originalEvent.clipboardData).items;

        for (let i = 0; i < images.length; i++) {
            const item = images[i];
            if (item.kind === 'file') {
                const blob = item.getAsFile();
                if (blob.type.indexOf('image') !== -1) {
                    const list = new DataTransfer();

                    const file = new File([blob], 'pasted_image.png', {type: blob.type});

                    list.items.add(file);
                    
                    return list.files;
                }
            }
        }
    }

    createImageByFile(input) {
        if (input.files.length == 1) {
            const image = Array.from(input.files)[0];
            return URL.createObjectURL(image);
        }
    }

    createModal(title, element, noCancel) {
        this.modal = document.createElement('div');
        this.modal.classList.add('modal-container');

        const modalElement = document.createElement('div');
        modalElement.classList.add('modal');

        this.modal.append(modalElement);

        const modalHeaderElement = document.createElement('div');
        modalHeaderElement.classList.add('modal-header');

        modalElement.append(modalHeaderElement);

        const modalTitleElement = document.createElement('h1');
        modalTitleElement.classList.add('modal-title');
        modalTitleElement.innerText = title;

        modalHeaderElement.append(modalTitleElement);

        const modalCloseHeaderElement = document.createElement('button');
        modalCloseHeaderElement.classList.add('modal-button', 'modal-circle-button', 'modal-close');
        modalCloseHeaderElement.innerHTML = "&times;";

        modalCloseHeaderElement.onclick = this.closeModal.bind(this);

        modalHeaderElement.append(modalCloseHeaderElement);

        const modalContentElement = document.createElement('div');
        modalContentElement.classList.add('modal-content');

        modalElement.append(modalContentElement);

        modalContentElement.append(element);

        const modalFooterElement = document.createElement('div');
        modalFooterElement.classList.add('modal-footer');

        modalElement.append(modalFooterElement);

        if (!noCancel) {
            const modalCloseFooterElement = document.createElement('button');
            modalCloseFooterElement.classList.add('modal-button', 'modal-close');
            modalCloseFooterElement.innerText = "İptal";

            modalFooterElement.append(modalCloseFooterElement);

            modalCloseFooterElement.onclick = this.closeModal.bind(this);
        }

        const modalSubmitFooterElement = document.createElement('button');
        modalSubmitFooterElement.classList.add('modal-button');
        modalSubmitFooterElement.innerText = "Tamam";

        modalFooterElement.append(modalSubmitFooterElement);

        modalSubmitFooterElement.onclick = this.submitModal.bind(this, element);

        document.body.classList.add('page-modal');
        document.body.append(this.modal);
    }

    closeModal() {
        if (this.modal) {
            this.modal.remove();
        }
        document.body.classList.remove('page-modal');
    }

    submitModal(element, e) {
        e.preventDefault();

        if (typeof element.submit === 'function') {
            element.requestSubmit();
        }

        this.closeModal();
    }

    createApp() {
        this.build();
    }

}