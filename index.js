const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'Frlix_Player';

const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const prevBtn = $('.btn-prev');
const nextBtn = $('.btn-next');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    randomSongPlayed: [],
    isRepeat: false,
    config: {},
    setConfig: function(key,value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },
    songs: [
        {
            name: 'Pandemonium',
            singer: 'Mondays feat. Hanna Stone, Dag Lundberg',
            path: './asserts/song/Pandemonium.mp3',
            image: './asserts/img/second.jpg'
        },
        {
            name: 'Faster Car',
            singer: 'Caliber & Anders Lystell',
            path: './asserts/song/FasterCar.mp3',
            image: './asserts/img/third.jpg'
        },
        {
            name: 'Stressed Out',
            singer: 'Twenty One Pilots',
            path: './asserts/song/StressedOut.mp3',
            image: './asserts/img/seventh.jpg'
        },
        {
            name: 'Save Your Tears',
            singer: 'The Weeknd & Ariana Grande',
            path: './asserts/song/SaveYourTears.mp3',
            image: './asserts/img/first.jpg'
        },
        {
            name: 'Whatcha Say',
            singer: 'Jason Derulo',
            path: './asserts/song/WhatchaSay.mp3',
            image: './asserts/img/forth.jpg'
        },
        {
            name: 'Seasons',
            singer: 'Rival & Cadmium feat. Harley Bird',
            path: './asserts/song/Seasons.mp3',
            image: './asserts/img/fifth.jpg'
        },
        {
            name: 'WhateverItTakes',
            singer: 'Imagine Dragons',
            path: './asserts/song/WhateverItTakes.mp3',
            image: './asserts/img/sixth.jpg'
        },
        {
            name: 'Demons',
            singer: 'Imagine Dragons',
            path: './asserts/song/Demons.mp3',
            image: './asserts/img/eighth.jpg'
        },
        {
            name: 'Pastlives',
            singer: 'Sapientdream',
            path: './asserts/song/Pastlives.mp3',
            image: './asserts/img/ninth.jpg'
        },
        {
            name: 'If We Have Each Other',
            singer: 'Alec Benjamin',
            path: './asserts/song/IfWeHaveEachOther.mp3',
            image: './asserts/img/tenth.jpg'
        }
    ],
    render: function() {
        const _this = this;
        const htmls = this.songs.map(function(song, index) {
            return `
                <div class="song ${index === _this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb" style="background-image: url(${song.image})">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `;
        });
        $('.playlist').innerHTML = htmls.join('');
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        });
    },
    handelEvents: function() {
        const _this = this;
        // 
        const cdWidth = cd.offsetWidth;

        document.onscroll = function() {
            const scrollTop = window.screenY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }
        // 
        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }

        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }

        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }
        //
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }
        //
        progress.oninput = function(event) {
            const seekTime = event.target.value * audio.duration / 100;
            audio.currentTime = seekTime
        }
        //
        cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            iterations: Infinity
        });
        cdThumbAnimate.pause();
        //
        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.randomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.scrollToView();
        }
        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.randomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.scrollToView();
        }
        //
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);
            if (_this.isRepeat == true) {
                _this.isRepeat = false;
                repeatBtn.classList.toggle('active', _this.isRepeat);
            }
        }
        //
        audio.onended = function() {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        }
        //
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);
            if (_this.isRandom == true) {
                _this.isRandom = false;
                randomBtn.classList.toggle('active', _this.isRandom);
            }
        }
        //
        playlist.onclick = function(event) {
            const songNode = event.target.closest('.song:not(.active)');
            if (songNode && !event.target.closest('.option')) {
                _this.currentIndex = Number(songNode.dataset.index);
                _this.loadCurrentSong();
                audio.play();
            }
            if (event.target.closest('.option')) {
                console.log('Lyrics');
            }
        }
    },
    loadCurrentSong: function() {
        const _this = this;
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
        audio.src = this.currentSong.path;

        if ($('.song.active')) {
            $('.song.active').classList.remove('active');
        }

        const listOfSong = $$('.song');
        listOfSong.forEach(function(song) {
            if (song.dataset.index == _this.currentIndex) {
                song.classList.add('active');
            }
        });
    },
    scrollToView: function() {
        setTimeout(function() {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }, 200);
    },
    nextSong: function() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    randomSong: function() {
        this.randomSongPlayed.push(this.currentIndex);
        if (this.randomSongPlayed.length === this.songs.length) {
            this.randomSongPlayed = [];
        }
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * this.songs.length);
        } while (this.randomSongPlayed.includes(randomIndex));
        this.currentIndex = randomIndex;
        this.loadCurrentSong();
    },
    start: function() {
        this.loadConfig();
        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);

        this.defineProperties();
        this.handelEvents();

        this.loadCurrentSong();
        this.render();
    }
}

app.start();