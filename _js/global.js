//we are importing stylesheets related files here, because putting non-js files as webpack entries generate js as well, see: https://github.com/webpack-contrib/extract-text-webpack-plugin/issues/518 
import '../_scss/global.scss';

import { UI } from './ui'; 


document.addEventListener("DOMContentLoaded", () => { 
   
    UI.init();
    
    UI.grid.mapRows('.list--ui');

    UI.grid.hoverToTouch('.list--ui');

    UI.grid.fadeOutOnScroll('.list--ui');

    UI.postsList.fadeOutOnScroll();

    UI.project.init();

    UI.searchForm.bind();

    UI.modal.bind();

    UI.vimeo.init();

} );


window.addEventListener('resize', () => { 

    UI.recalc();

    UI.grid.mapRows('.list--ui');

});


