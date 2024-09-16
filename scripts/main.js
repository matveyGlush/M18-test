document.addEventListener('DOMContentLoaded', () => {
    // modal
    let button = document.querySelector('.modal-btn');
    let modal = document.querySelector('.modal');
    let menuClose = document.querySelector('.close-modal');

    button.addEventListener('click', function (){
        document.body.classList.add('stop-scroll');
        modal.classList.add('modal-active');
    });
    menuClose.addEventListener('click', function (){
        modal.classList.remove('modal-active');
        document.body.classList.remove('stop-scroll');
    });
})

