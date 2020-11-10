import { UI } from '../ui';

export let modal = {
    buttonClass : '.do-toggle-modal',
    activeClass : 'modal--active',
    autoplayVideo : false,
    currentViewportPosition : null,

    /**
     * @param {string} buttonClass
     */
    bind : function(buttonClass = this.buttonClass) {

        let buttons = document.querySelectorAll(buttonClass);

        for(let i = 0; i < buttons.length; i++) {
            let modalTargetName = buttons[i].dataset.modalTarget;

            buttons[i].addEventListener('click', (event) => {										
                event.preventDefault();
                this.toggle(modalTargetName);
            });			
        };

    },

    /**
     * @param {string} modalName
     */
    toggle : function(modalName) {

        let modalTarget = document.querySelector('[data-modal="'+modalName+'"]');

        if(modalTarget == null) return;
        
        modalTarget.classList.contains(this.activeClass) ? this.close(modalName) : this.open(modalName);

    },

    /**
     * @param {string} modalName
     * @param {boolean} toggle
     */
    open : function(modalName) {

        let modalTarget = document.querySelector('[data-modal="'+modalName+'"]');

        //if modal is already opened, don't do anything
        if( modalTarget.classList.contains(this.activeClass) ) return;
    
        //save scroll position
        this.currentViewportPosition = window.pageYOffset;

        //jump to the top of the page
        scroll(0, 0);

        //toggle active classes for modal element and body
        document.body.classList.add(this.activeClass);
        modalTarget.classList.add(this.activeClass);

        //if modal has has video, autoplay it
        let video = modalTarget.querySelector('[data-video-id]');
        
        if(video != null && this.autoplayVideo) {
            let videoId = parseInt(video.dataset.videoId);
            UI.vimeo.play(videoId);
        }		


    },

    /**
     * @param {string} modalName
     */
    close : function(modalName) {

        let modalTarget = document.querySelector('[data-modal="'+modalName+'"]');

        UI.vimeo.stop();
        
        //remove modal related classes from modal and body
        modalTarget.classList.remove(this.activeClass);
        document.body.classList.remove(this.activeClass);

        //set previous scroll position
        scroll(0, this.currentViewportPosition);			

    },

    render : function(modalName, content) {

        let modalTarget = document.querySelector('[data-modal="'+modalName+'"]');
        let modalContent = modalTarget.querySelector('.modal__content');

        modalContent.innerHTML = content;

    }
}