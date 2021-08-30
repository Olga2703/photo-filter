

const filters = document.querySelector('.filters'),
    output = document.querySelectorAll('output'),
    input = document.querySelectorAll('input'),
    btns = document.querySelectorAll('.btn'),
    btnReset = document.querySelector('.btn-reset'),
    btnNext = document.querySelector('.btn-next'),
    btnLoad = document.querySelector('.btn-load--input'),
    btnSave = document.querySelector('.btn-save'),
    btnFullscreen = document.querySelector('.fullscreen'),
    canvas = document.querySelector('canvas'),
    img = document.querySelector('.img-edit'),
    base = 'https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/',
    images = ['01.jpg', '02.jpg', '03.jpg', '05.jpg', '06.jpg', '07.jpg',
        '08.jpg', '09.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg',
        '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg'];
let i = 0,
    timesOfDay = '';

function addFullScreen(e) {
    if (e.target && e.target.classList.contains('fullscreen')) {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            document.documentElement.requestFullscreen();
        }
    }
}

function apdateValueOutput(e) {
    output.forEach(item => {
        if (item.parentElement == e.target.parentElement) {
            item.value = e.target.value;
        }
    });
}

function addFilter(e) {
    const suffix = e.target.dataset.sizing || '';
    document.documentElement.style.setProperty(`--${e.target.name}`, e.target.value + suffix);
}

function resetFilter(e) {
    if (e.target && e.target.classList.contains('btn-reset')) {
        addActivClass(e);
        input.forEach(item => {
            item.value = item.defaultValue;

            document.documentElement.style.setProperty(`--${item.name}`, item.value + item.dataset.sizing);

            output.forEach(elem => {
                if (elem.parentElement == item.parentElement) {
                    elem.value = item.defaultValue;
                }
            });
        });
    }
}

function findTimesOfDay() {
    const now = new Date(),
        hours = now.getHours();


    if (hours < 6 && hours >= 0) {
        timesOfDay = 'night/';
    }
    if (hours < 12 && hours >= 6) {
        timesOfDay = 'morning/';
    }
    if (hours < 18 && hours >= 12) {
        timesOfDay = 'day/';
    }
    if (hours < 24 && hours >= 18) {
        timesOfDay = 'evening/';
    }

    return timesOfDay;
}

function createLink() {
    const index = i % images.length;
    let imageSrc = '';
    findTimesOfDay();
    imageSrc = base + timesOfDay + images[index];
    i++;
    return imageSrc;
}

function nextImage(e) {
    addActivClass(e);
    const newImg = new Image(),
        newLink = createLink();

    newImg.src = newLink;
    newImg.onload = () => {
        img.src = newLink;
    };

}


function filterToCanvas(item) {
    const filtersCanvas = ['blur', 'invert', 'sepia', 'saturate', 'hue-rotate'];
    let filterStr = '';

    filtersCanvas.forEach(filter => {
        let value;

        if (filter === 'hue-rotate') {
            value = window.getComputedStyle(item).getPropertyValue(`--hue`).replace(' ', '');
        } else if (filter === 'blur') {
            value = parseInt(window.getComputedStyle(item).getPropertyValue(`--blur`)) * 3 + 'px';
        } else {
            value = window.getComputedStyle(item).getPropertyValue(`--${filter}`).replace(' ', '');
        }
        filterStr += `${filter}(${value}) `;
    });

    return filterStr;
}

function addFilterCanvas(e) {
    addActivClass(e);
    const newImg = new Image();
    newImg.setAttribute('crossOrigin', 'anonymous');
    newImg.src = img.src;
    newImg.onload = function () {
        canvas.width = newImg.width;
        canvas.height = newImg.height;
        const ctx = canvas.getContext("2d");
        ctx.filter = filterToCanvas(img);
        ctx.drawImage(newImg, 0, 0);
        downloadImg();
    };
}

function downloadImg() {
    const link = document.createElement('a');
    link.download = 'download.png';
    link.href = document.querySelector('.canvas').toDataURL();
    link.click();
    link.delete;
}

function loadImg(e) {
    addActivClass(e);
    const file = btnLoad.files[0],
        reader = new FileReader();
    reader.addEventListener('loadend', (e) => {
        img.src = reader.result;
    });
    if (file) {
        reader.readAsDataURL(file);
        e.target.value = '';
    }
}

function addActivClass(e) {
    btns.forEach(item => item.classList.remove('btn-active'));
    if (e.tagName === 'INPUT') {
        e.parentElement.classList.add('btn-active');
    } else {
        e.target.classList.add('btn-active');
    }
}

filters.addEventListener('input', apdateValueOutput);

filters.addEventListener('input', addFilter);

btnReset.addEventListener('click', resetFilter);

btnNext.addEventListener('click', nextImage);

btnLoad.addEventListener('change', loadImg);

btnFullscreen.addEventListener('click', addFullScreen);

btnSave.addEventListener('click', addFilterCanvas);