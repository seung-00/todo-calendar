const body = document.querySelector('body');

const paintImage = () => {
    const img = new Image();
    img.src = `./img/1.jpg`;
    img.classList.add('bgImage');
    body.prepend(img);
    return true;
}

const bgInit = () => {
    paintImage()
}

bgInit();