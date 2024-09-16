document.addEventListener('DOMContentLoaded', () => {
    // modal
    class Modal {
        constructor(options) {
            let defaultOptions = {
                isOpen: () => {},
                isClose: () => {},
            }
            this.options = Object.assign(defaultOptions, options);
            this.modal = document.querySelector('.modal');
            this.speed = false;
            this.animation = false;
            this.isOpen = false;
            this.modalContainer = false;
            this.previousActiveElement = false;
            this.fixBlocks = document.querySelectorAll('.fix-block');
            this.focusElements = [
                'a[href]',
                'input',
                'button',
                'select',
                'textarea',
                '[tabindex]'
            ];
            this.events();
        }

        events() {
        if (this.modal) {
            document.addEventListener('click', function(e){
            const clickedElement = e.target.closest('[data-modal]');
            if (clickedElement) {
                let target = clickedElement.dataset.modal;
                let animation = clickedElement.dataset.animation;
                let speed = clickedElement.dataset.speed;
                this.animation = animation ? animation : 'side';
                this.speed = speed ? parseInt(speed) : 300;
                this.modalContainer = document.querySelector(`[data-target="${target}"]`);
                this.open();
                return;
            }

            if (e.target.closest('.modal-close')) {
                this.close();
                return;
            }
            }.bind(this));

            window.addEventListener('keydown', function(e) {
            if (e.keyCode === 27) {
                if (this.isOpen) {
                this.close();
                }
            }

            if (e.keyCode === 9 && this.isOpen) {
                this.focusCatch(e);
                return;
            }

            }.bind(this));

            this.modal.addEventListener('click', function(e) {
            if (!e.target.classList.contains('modal__container') && !e.target.closest('.modal__container') && this.isOpen) {
                this.close();
            }
            }.bind(this));
        }
        }

        open() {
        this.previousActiveElement = document.activeElement;

        this.modal.style.setProperty('--transition-time', `${this.speed / 1000}s`);
        this.modal.classList.add('is-open');
        this.disableScroll();

        this.modalContainer.classList.add('modal-open');
        this.modalContainer.classList.add(this.animation);

        setTimeout(() => {
            this.options.isOpen(this);
            this.modalContainer.classList.add('animate-open');
            this.isOpen = true;
            this.focusTrap();
        }, this.speed);
        }

        close() {
        if (this.modalContainer) {
            this.modalContainer.classList.remove('animate-open');
            this.modalContainer.classList.remove(this.animation);
            this.modal.classList.remove('is-open');
            this.modalContainer.classList.remove('modal-open');

            this.enableScroll();
            this.options.isClose(this);
            this.isOpen = false;
            this.focusTrap();
        }
        }

        focusCatch(e) {
        const focusable = this.modalContainer.querySelectorAll(this.focusElements);
        const focusArray = Array.prototype.slice.call(focusable);
        const focusedIndex = focusArray.indexOf(document.activeElement);

        if (e.shiftKey && focusedIndex === 0) {
            focusArray[focusArray.length - 1].focus();
            e.preventDefault();
        }

        if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
            focusArray[0].focus();
            e.preventDefault();
        }
        }

        focusTrap() {
        const focusable = this.modalContainer.querySelectorAll(this.focusElements);
        if (this.isOpen) {
            focusable[0].focus();
        } else {
            this.previousActiveElement.focus();
        }
        }

        disableScroll() {
        let pagePosition = window.scrollY;
        this.lockPadding();
        document.body.classList.add('disable-scroll');
        document.body.dataset.position = pagePosition;
        document.body.style.top = -pagePosition + 'px';
        }

        enableScroll() {
        let pagePosition = parseInt(document.body.dataset.position, 10);
        this.unlockPadding();
        document.body.style.top = 'auto';
        document.body.classList.remove('disable-scroll');
        window.scroll({ top: pagePosition, left: 0 });
        document.body.removeAttribute('data-position');
        }

        lockPadding() {
        let paddingOffset = window.innerWidth - document.body.offsetWidth + 'px';
        this.fixBlocks.forEach((el) => {
            el.style.paddingRight = paddingOffset;
        });
        document.body.style.paddingRight = paddingOffset;
        }

        unlockPadding() {
        this.fixBlocks.forEach((el) => {
            el.style.paddingRight = '0px';
        });
        document.body.style.paddingRight = '0px';
        }
    }

    const modal = new Modal({
        isOpen: (modal) => {
        console.log(modal);
        console.log('opened');
        },
        isClose: () => {
        console.log('closed');
        },
    });

    //form
    let selector = document.querySelector("input[type='tel']");
    let im = new Inputmask("+7 (999)-999-99-99");
    im.mask(selector);

    let inputName = document.querySelector('.form-name');
    new JustValidate('.modal-form', {
        rules: {
        name: {
            required: true,
            minLength: 2,
            maxLength: 30,
            function: (name, value) => {
            return /^[a-zA-Zа-яА-Я\u00C0-\u00ff]+$/.test(inputName.value);
            }
        },
        tel: {
            required: true,
            function: (name, value) => {
            const phone = selector.inputmask.unmaskedvalue()
            return Number(phone) && phone.length === 10
            },
        },
        agree: {
            required: true,
        },
        },
        colorWrong: '#D11616FF',
        messages: {
        name: {
            required: 'Вы не ввели имя',
            minLength: 'Имя не может быть меньше двух символов',
            maxLength: 'Имя не может превышать 30 символов',
            function: 'Недопустимый формат',
        },
        tel: {
            function: 'Введите телефон полностью',
            required: 'Вы не ввели телефон'
        },
        agree: {
            required: 'Подтвердите согласие'
        },
        },
        submitHandler: function() {
            document.querySelector(".modal-form").classList.toggle("hide")
            document.querySelector(".modal-succes").classList.toggle("hide")
        }
    });
})

