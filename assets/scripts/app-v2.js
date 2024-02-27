const imageSrc = "./assets/images/";

class Modal {

    constructor(title, element, noCancel = false) {
        this.createModal(title, element, noCancel);
        this.setEvents(element);
    }

    createModal(title, element, noCancel) {
        this.modal = document.createElement('div');
        this.modalElement = document.createElement('div');
        this.modalHeaderElement = document.createElement('div');
        this.modalTitleElement = document.createElement('h1');
        this.modalCloseHeaderElement = document.createElement('button');
        this.modalContentElement = document.createElement('div');
        this.modalFooterElement = document.createElement('div');
        this.modalSubmitFooterElement = document.createElement('button');
        this.modalCloseFooterElement = document.createElement('button');

        this.modal.append(this.modalElement);
        this.modalElement.append(this.modalHeaderElement);
        this.modalHeaderElement.append(this.modalTitleElement);
        this.modalHeaderElement.append(this.modalCloseHeaderElement);
        this.modalElement.append(this.modalContentElement);
        this.modalContentElement.append(element);
        this.modalElement.append(this.modalFooterElement);
        this.modalFooterElement.append(this.modalSubmitFooterElement);

        document.body.append(this.modal);

        if (!noCancel) {
            this.modalFooterElement.append(this.modalCloseFooterElement);
        }

        this.modal.classList.add('modal-container');
        this.modalElement.classList.add('modal');
        this.modalHeaderElement.classList.add('modal-header');
        this.modalTitleElement.classList.add('modal-title');
        this.modalCloseHeaderElement.classList.add('modal-button', 'modal-circle-button', 'modal-close');
        this.modalContentElement.classList.add('modal-content');
        this.modalFooterElement.classList.add('modal-footer');
        this.modalCloseFooterElement.classList.add('modal-button', 'modal-close');
        this.modalSubmitFooterElement.classList.add('modal-button');

        document.body.classList.add('page-modal');

        this.modalCloseHeaderElement.innerHTML = "&times;";
        this.modalCloseFooterElement.innerText = "İptal";
        this.modalSubmitFooterElement.innerText = "Tamam";

        this.setTitle(title);
    }

    setTitle(title) {
        this.modalTitleElement.innerText = title;
    }

    setEvents(element) {
        this.modalCloseFooterElement.onclick = this.closeModal.bind(this);
        this.modalCloseHeaderElement.onclick = this.closeModal.bind(this);
        this.modalSubmitFooterElement.onclick = this.submitModal.bind(this, element);
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

    getModal() {
        return this.modal;
    }

}

class Input {

    text(text, value) {
        this.element = document.createElement('label');
        this.input = document.createElement('input');

        const namePlaceholder = document.createElement('span');

        this.element.append(namePlaceholder);
        this.element.append(this.input);

        this.input.setAttribute('type', 'text');

        namePlaceholder.innerText = text;
        this.input.value = value
    }

    number(text, value, min, max) {
        this.element = document.createElement('label');
        this.input = document.createElement('input');

        const namePlaceholder = document.createElement('span');

        this.element.append(namePlaceholder);
        this.element.append(this.input);

        this.input.setAttribute('type', 'number');
        this.input.setAttribute('min', min);
        this.input.setAttribute('max', max);

        namePlaceholder.innerText = text;
        this.input.value = value
    }

    checkBox(text, bool = false, disabled = false) {
        this.element = document.createElement('label');
        this.input = document.createElement('input');
        const slider = document.createElement('span');
        const namePlaceholder = document.createElement('span');

        this.element.append(this.input);
        this.element.append(slider);
        this.element.append(namePlaceholder);

        this.element.classList.add('switch');
        slider.classList.add('switch-slider');
        namePlaceholder.classList.add('switch-label');
        
        this.input.setAttribute('type', 'checkbox');

        if (bool) {
            this.input.setAttribute('checked', '');
        }

        if (disabled) {
            this.input.setAttribute('disabled', '');
        }

        namePlaceholder.innerText = text;
    }

    image(text) {
        this.element = document.createElement('label');
        this.input = document.createElement('input');
        this.preview = document.createElement('div');

        const imageTitle = document.createElement('p');
        const imagePlaceholder = document.createElement('span');

        this.element.append(imageTitle);
        this.element.append(imagePlaceholder);
        this.element.append("veya");
        this.element.append(this.input);
        this.element.append(this.preview);

        this.element.classList.add('drop-container');
        this.preview.classList.add('drop-preview');
        imagePlaceholder.classList.add('drop-title');

        this.input.setAttribute('type', 'file');
        this.input.setAttribute('accept', 'image/*');

        imageTitle.innerText = text;
        imagePlaceholder.innerText = "Sürükle bırak, yapıştır";

        this.input.onchange = this.setPreviewImage.bind(this);
        this.element.ondragover = this.imageOnDragOver.bind(this);
        this.element.ondrop = this.imageOnDrop.bind(this);
    }

    imageOnDragOver(e) {
        e.preventDefault();
    }

    imageOnDrop(e) {
        e.preventDefault();
        this.input.files = e.dataTransfer.files;
        this.setPreviewImage()
    }

    setPreviewImage() {
        this.preview.innerHTML = "";

        const image = this.createImageByFile();

        if (image) {
            const imageElement = document.createElement('img');
            imageElement.src = image;
    
            this.preview.append(imageElement);
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

    createImageByFile() {
        if (this.input.files.length == 1) {
            const image = Array.from(this.input.files)[0];
            return URL.createObjectURL(image);
        }
    }

    getElement() {
        return this.element;
    }

    getInput() {
        return this.input;
    }

}

class Player {

    defPlayerName = "Oyuncu";
    defPlayerImage = imageSrc + "avatar.png";

    constructor(number) {
        this.createPlayer(number);
        this.setEvents();
    }

    createPlayer(number) {
        this.player = document.createElement('div');
        this.avatarElement = document.createElement('div');
        this.imageElement = document.createElement('img');
        this.detailsElement = document.createElement('div');
        this.numberElement = document.createElement('p');
        this.nameElement = document.createElement('p');

        this.player.append(this.avatarElement);
        this.player.append(this.detailsElement);
        this.avatarElement.append(this.imageElement);
        this.detailsElement.append(this.numberElement);
        this.detailsElement.append(this.nameElement);

        this.player.classList.add('player');
        this.avatarElement.classList.add('player-avatar');
        this.imageElement.classList.add('avatar');
        this.detailsElement.classList.add('player-details');
        this.numberElement.classList.add('player-number');
        this.nameElement.classList.add('player-name');

        this.player.setAttribute('draggable', 'true');

        this.setName(this.defPlayerName);
        this.setImage(this.defPlayerImage);
        this.setNumber(number);
    }

    setName(name) {
        this.nameElement.innerText = name;
    }

    getName() {
        return this.nameElement.innerText;
    }

    setNumber(number) {
        this.numberElement.innerText = number;
    }

    getNumber() {
        return this.numberElement.innerText;
    }

    setImage(image) {
        this.imageElement.setAttribute('src', image);
    }

    getImage() {
        return this.imageElement.getAttribute('src');
    }q

    getPlayer() {
        return this.player;
    }

    setEvents() {
        this.player.onclick = this.editPlayer.bind(this);
    }

    setPosition(top, left) {
        this.player.style.top = top + "px";
        this.player.style.left = left + "px";
    }

    editPlayer() {
        const editForm = document.createElement('form');

        this.editForm = editForm;

        const nameInput = new Input();
        const numberInput = new Input();
        const imageInput = new Input();

        nameInput.text("Oyuncu Adı", this.getName());
        numberInput.number("Oyuncu Numarası", this.getNumber(), 1, 99);
        imageInput.image("Oyuncu Resmi");

        editForm.append(nameInput.getElement());
        editForm.append(numberInput.getElement());
        editForm.append(imageInput.getElement());

        new Modal(this.getName(), editForm);

        editForm.onsubmit = this.setPlayer.bind(this, nameInput, numberInput, imageInput);
        document.body.onpaste = this.pasteImage.bind(this, imageInput);
    }

    setPlayer(nameInput, numberInput, imageInput, e) {
        e.preventDefault();

        this.setName(nameInput.getInput().value);
        this.setNumber(numberInput.getInput().value);

        const image = imageInput.createImageByFile(imageInput.getInput());

        if (image) {
            this.setImage(image);
        }

        // this.teams.map(function(team) {
        //     team.players.map(function(p) {
        //         if (p === player) {
        //             this.lineUpTeam(team);
        //         }
        //     }.bind(this));
        // }.bind(this));
    }

    pasteImage(imageInput, e) {
        imageInput.getInput().files = imageInput.getImageFromClipboard(e);
        imageInput.setPreviewImage(imageInput);
    }

}

class Team {

    defTeamImage = imageSrc + "team.png";

    formation = [0, 0];
    players = [];

    parcel = 6;

    constructor(name, reverse, formations, width, height) {
        this.width = width;
        this.height = height;
        this.reverse = reverse;

        this.createTeam(name);
        this.createFormations(formations);
        this.createPlayers();
        this.lineUpPlayers();
        this.buildPlayers();
        this.setEvents();
    }

    createTeam(name) {
        this.team = document.createElement('div');
        this.detailsElement = document.createElement('div');
        this.infoElement = document.createElement('div');
        this.imageElement = document.createElement('img');
        this.nameElement = document.createElement('p');
        this.playersElement = document.createElement('div');

        this.team.append(this.detailsElement);
        this.team.append(this.playersElement);
        this.detailsElement.append(this.infoElement);
        this.infoElement.append(this.imageElement);
        this.infoElement.append(this.nameElement);

        this.team.classList.add('team');
        this.detailsElement.classList.add('team-details');
        this.infoElement.classList.add('team-info');
        this.imageElement.classList.add('team-logo');
        this.nameElement.classList.add('team-name');
        this.playersElement.classList.add('players');

        if (this.reverse) {
            this.team.classList.add('team-reverse');
        }
        
        this.setName(name);
        this.setImage(this.defTeamImage);

    }

    setImage(image) {
        this.imageElement.setAttribute('src', image);
    }

    getImage() {
        return this.imageElement.getAttribute('src');
    }

    setName(name) {
        this.nameElement.innerText = name;
    }

    getName() {
        return this.nameElement.innerText;
    }

    getTeam() {
        return this.team;
    }

    createPlayers() {
        const formation = this.formations[this.formation[0]].lineups[this.formation[1]].lineup;

        if (!this.rememberPlayers) {
            this.players = [];
        }

        const players = [];

        for (let i = 1; i < formation.length+1; i++) {

            if (this.rememberPlayers && this.players[i]) {
                players.push(this.players[i]);
                continue;
            }

            const player = new Player(i);
            players.push(player);
        }

        this.players = players;

        this.setPlayerEvents();
    }

    buildPlayers() {
        this.playersElement.innerHTML = "";
        
        for (let i = 0; i < this.players.length; i++) {
            this.playersElement.append(this.players[i].getPlayer());
        }
    }

    hideTeam() {
        this.team.classList.add('hide-team');
        this.hide = true;
    }

    showTeam() {
        this.team.classList.remove('hide-team');
        this.hide = false;
    }

    lineUpPlayers() {
        const formation = this.formations[this.formation[0]].lineups[this.formation[1]].lineup;

        setTimeout(function(){

            for (let i = 0; i < formation.length; i++) {
                const height = (this.fullSize && this.anyHide) ? this.height : this.height / 2;
                const width = this.width;
    
                const positionWidthIndex = this.formations[this.formation[0]].lineups[this.formation[1]].lineup[i][0];
                const positionWidth = (this.reverse) ? this.parcel + 1 - positionWidthIndex  :  positionWidthIndex;
    
                const positionHeight = this.formations[this.formation[0]].lineups[this.formation[1]].lineup[i][1];
    
                const reverseHeight = ((this.fullSize && this.anyHide) || (!this.fullSize && this.reverse && this.anyHide)) ? 0 : (this.reverse) ? (this.height / 2) : 0;
    
                const offsetHeight = this.players[i].getPlayer().offsetHeight;
                const offsetWidth = this.players[i].getPlayer().offsetWidth;
    
                const top = (((height) / (this.parcel + 1)) * positionWidth) - (offsetHeight / 2) + reverseHeight;
                const left = ((width / (this.parcel + 1)) * positionHeight) - (offsetWidth / 2);
    
                this.players[i].setPosition(top, left);
            }

        }.bind(this), 0);
        
    }

    setEvents() {
        this.select.onchange = this.changeFormation.bind(this);
        this.infoElement.onclick = this.editTeam.bind(this);
    }

    setPlayerEvents() {
        for (let i = 0; i < this.players.length; i++) {
            this.players[i].getPlayer().ondragstart = this.onDragStart.bind(this, this.players[i]);
            this.players[i].getPlayer().ondragover = this.onDragOver.bind(this, this.players[i]);
            this.players[i].getPlayer().ondragleave = this.onDragLeave.bind(this, this.players[i]);
            this.players[i].getPlayer().ondrop = this.onDrop.bind(this, this.players[i]);
        }
    }

    changeFormation(e) {
        e.preventDefault();

        const formation = e.target.value.split(',');
        this.formation = [Number(formation[0]), Number(formation[1])];

        this.createPlayers();
        this.buildPlayers();
        this.lineUpPlayers();
    }

    createFormations(formations) {
        this.formations = formations;

        const selectDiv = document.createElement('div');
        const selectElement = document.createElement('select');

        this.select = selectElement;

        selectDiv.classList.add('select');

        selectDiv.append(selectElement);

        for (let i = 0; i < this.formations.length; i++) {
            const optElement = document.createElement("optgroup");

            optElement.label = this.formations[i].name;
            optElement.setAttribute("value", i)

            for (let j = 0; j < this.formations[i].lineups.length; j++) {
                const optionElement = document.createElement("option");

                optionElement.value = i + "," + j;
                optionElement.innerHTML = this.formations[i].lineups[j].name;

                if (this.formation[0] == i && this.formation[1] == j) {
                    optionElement.setAttribute('selected', '');
                }

                optElement.append(optionElement);
            }

            selectElement.append(optElement);
        }

        this.detailsElement.append(selectDiv);
    }

    editTeam() {
        const editForm = document.createElement('form');
        
        const nameInput = new Input();
        const imageInput = new Input();

        nameInput.text("Takım Adı", this.getName());
        imageInput.image("Takım Logosu");

        editForm.append(nameInput.getElement());
        editForm.append(imageInput.getElement());

        new Modal(this.getName(), editForm);

        editForm.onsubmit = this.setTeam.bind(this, nameInput, imageInput);
        document.body.onpaste = this.pasteImage.bind(this, imageInput);
    }

    setTeam(nameInput, imageInput, e) {
        e.preventDefault();

        this.setName(nameInput.getInput().value);

        const image = imageInput.createImageByFile(imageInput.getInput());

        if (image) {
            this.setImage(image);
        }
    }

    pasteImage(imageInput, e) {
        imageInput.getInput().files = imageInput.getImageFromClipboard(e);
        imageInput.setPreviewImage(imageInput);
    }

    onDragStart(player, e) {
        e.dataTransfer.setData('text/html', e.target.innerHTML);
        this.drag = e.target;
    }

    onDragOver(player, e) {
        e.preventDefault();
        player.getPlayer().classList.add('player-drag');
    }

    onDragLeave(player, e) {
        e.preventDefault();
        player.getPlayer().classList.remove('player-drag');
    }

    onDrop(player, e) {
        e.preventDefault();

        player.getPlayer().classList.remove('player-drag');
        
        if (this.drag !== e.currentTarget) {
            const tempPlayer = document.createElement('div');
            tempPlayer.innerHTML = e.dataTransfer.getData('text/html');

            const drag = this.findPlayer(this.drag) || this.otherTeam.findPlayer(this.otherTeam.drag);
            const current = this.findPlayer(e.currentTarget);

            drag.setName(current.getName());
            drag.setNumber(current.getNumber());
            drag.setImage(current.getImage());

            current.setName(tempPlayer.querySelector('.player-name').innerText);
            current.setNumber(tempPlayer.querySelector('.player-number').innerText);
            current.setImage(tempPlayer.querySelector('.avatar').getAttribute('src'));

            tempPlayer.remove();

            this.lineUpPlayers();
        }
    }

    findPlayer(player) {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].getPlayer() === player) {
                return this.players[i];
            }
        }
    }

}

class App {
    
    teams= [
        {
            name: "Takım 1",
            reverse: false,
        },
        {
            name: "Takım 2",
            reverse: true,
        }
    ];

    constructor(element, formations) {
        this.app = element;
        this.formations = formations;
    }

    createPitch() {
        this.pitch = document.createElement('div');

        this.app.append(this.pitch);

        this.pitch.classList.add('pitch');

        this.width = this.pitch.offsetWidth;
        this.height = this.pitch.offsetHeight;  

        this.setEvents();
        this.buildFabs();
    }

    buildTeams() {
        const teams = [];

        for (let i = 0; i < this.teams.length; i++) {
            const team = new Team(this.teams[i].name, this.teams[i].reverse, this.formations, this.width, this.height);

            teams.push(team);

            this.pitch.append(team.getTeam());
        }

        this.teams = teams;

        this.teams[0].otherTeam = this.teams[1];
        this.teams[1].otherTeam = this.teams[0];
    }

    buildFabs() {
        const fabContainer = document.createElement('div');
        const downloadFab = document.createElement('button');
        const settingsFab = document.createElement('button');

        fabContainer.append(downloadFab);
        fabContainer.append(settingsFab);
        document.body.append(fabContainer);


        fabContainer.classList.add('floating-action-container');
        downloadFab.classList.add('floating-action');
        settingsFab.classList.add('floating-action');


        downloadFab.setAttribute('tooltip', 'Kadroyu İndir');
        settingsFab.setAttribute('tooltip', 'Ayarlar');

        downloadFab.innerHTML = "&#8681;";
        settingsFab.innerHTML = "&#x26ED;";

        downloadFab.onclick = this.downloadImage.bind(this);        
        settingsFab.onclick = this.settings.bind(this);
    }

    downloadImage() {
        document.body.classList.add('no-animation');

        html2canvas(this.pitch, {width: this.pitch.offsetWidth, height: this.pitch.offsetHeight}).then(function(canvas) {

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

    settings() {
        const editForm = document.createElement('form');

        const checkboxFirstTeam = new Input();
        const checkboxSecondTeam = new Input();
        const checkboxFullSize = new Input();
        const checkboxRememberPlayers = new Input();

        checkboxFirstTeam.checkBox("1. Takımı gizle", this.teams[0].hide, this.teams[1].hide);
        checkboxSecondTeam.checkBox("2. Takımı gizle", this.teams[1].hide, this.teams[0].hide);
        checkboxFullSize.checkBox("Diğer takım gizlenince takımı tüm sahaya diz", this.fullSize);
        checkboxRememberPlayers.checkBox("Oyuncu adlarını hatırla", this.rememberPlayers);

        editForm.append(checkboxFirstTeam.getElement());
        editForm.append(checkboxSecondTeam.getElement());
        editForm.append(checkboxFullSize.getElement());
        editForm.append(checkboxRememberPlayers.getElement());

        new Modal("Ayarlar", editForm, true)

        checkboxFirstTeam.element.onchange = this.checkboxFirstTeam.bind(this, checkboxSecondTeam);
        checkboxSecondTeam.element.onchange = this.checkboxSecondTeam.bind(this, checkboxFirstTeam);
        checkboxFullSize.element.onchange = this.checkboxFullSize.bind(this);
        checkboxRememberPlayers.element.onchange = this.checkboxRememberPlayers.bind(this);
        editForm.onsubmit = this.onSubmit.bind(this);
    }

    onSubmit(e) {
        e.preventDefault();
    }

    checkboxFirstTeam(checkboxSecondTeam, e) {
        e.preventDefault();

        const status = e.target.checked;

        if (status) {
            checkboxSecondTeam.input.disabled = true;

            this.hideTeam(0);

            this.pitch.style.height = this.height / 2 + "px";
            this.teams[1].getTeam().style.marginbottom = "500px";
        } else {
            checkboxSecondTeam.input.disabled = false;
            this.showTeam(0);
        }

        this.buildTeamsPlayer();
        this.setTeamStatus();
    }

    checkboxSecondTeam(checkboxFirstTeam, e) {
        e.preventDefault();

        const status = e.target.checked;

        if (status) {
            checkboxFirstTeam.input.disabled = true;
            this.hideTeam(1);
        } else {
            checkboxFirstTeam.input.disabled = false;
            this.showTeam(0);
        }

        this.setTeamStatus();
        this.buildTeamsPlayer();
    }

    checkboxFullSize(e) {
        e.preventDefault();

        this.fullSize = e.target.checked;
        
        this.setTeamStatus();
        this.buildTeamsPlayer();
    }

    checkboxRememberPlayers(e) {
        e.preventDefault();

        this.rememberPlayers = e.target.checked;
        for (let i = 0; i < this.teams.length; i++) {
            this.teams[i].rememberPlayers = this.rememberPlayers;
        }
    }

    buildTeamsPlayer() {
        for (let i = 0; i < this.teams.length; i++) {
            this.teams[i].buildPlayers();
            this.teams[i].lineUpPlayers();
        }
    }

    setEvents() {
        window.onresize = this.resizePitch.bind(this);
    }

    resizePitch() {
        this.width = this.pitch.offsetWidth;
        this.height = this.pitch.offsetHeight;  

        document.body.classList.add('no-animation');

        setTimeout(function(){
            for (let i = 0; i < this.teams.length; i++) {
                this.teams[i].width = this.width;
                this.teams[i].height = this.height;
    
                this.teams[i].lineUpPlayers();
            }

            document.body.classList.remove('no-animation');
        }.bind(this), 500);

    }

    hideTeam(team) {
        this.teams[team].hideTeam();
        for (let i = 0; i < this.teams.length; i++) {
            this.anyHide = true;
            this.teams[i].anyHide = this.anyHide;
        }
    }

    showTeam(team) {
        this.teams[team].showTeam();
        for (let i = 0; i < this.teams.length; i++) {
            this.anyHide = false;
            this.teams[i].anyHide = this.anyHide;
        }
    }

    setTeamStatus() {        
        if (!this.fullSize) {
            if (this.anyHide) {
                this.pitch.style.height = this.height / 2 + "px";
                if (this.teams[0].hide) {
                    this.pitch.classList.add('hide-first-team');
                } else {
                    this.pitch.classList.remove('hide-first-team');
                }
            }
        } else {
            this.pitch.style.height = this.width;
        }
    }

    createApp() {
        this.createPitch();
        this.buildTeams();
    }

}