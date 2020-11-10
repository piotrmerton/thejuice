import { UI } from '../ui';
import { tns } from '../../node_modules/tiny-slider/src/tiny-slider.module';

export let project = {

    slider : null,
    sliderSelector : '.slider__list',
    sliderNavSelector : '.slider__nav',
    buttonSelector : '.do-toggle-project-gallery',

    init : function() {

        this.bind();
        this.initSlider();
        

    },

    bind : function() {

        if( document.querySelector(this.buttonSelector) === null ) return;

        let buttons = document.querySelectorAll(this.buttonSelector);


        buttons.forEach( (item) => {

            item.addEventListener('click', (event) => {

                let slideId = item.dataset.slide;

                this.slider.goTo(slideId);

                UI.modal.open('slider');

                event.preventDefault();

            });

        });

    },

    initSlider : function() {

        if( document.querySelector(this.sliderSelector) === null ) return;

        let settings = {
            container: this.sliderSelector,
            controlsContainer: this.sliderNavSelector,
            mode: 'gallery',
            speed: 400,
            items: 1,
            slideBy: 1,
            autoplay: false,
            controls: true,
            nav: false,
            loop: false,	
        }

        //TO DO: Should you need to initialize multiple sliders with the same class use querySelectorAll and forEach, see: https://github.com/ganlanyuan/tiny-slider/issues/103

        this.slider = tns( settings );
        this.slider.events.on('transitionStart', () => {
            UI.vimeo.stop();
        });

    },



}