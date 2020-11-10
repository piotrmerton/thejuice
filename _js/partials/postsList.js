import { UI } from '../ui';

export let postsList = {

    containerSelector : '.posts__list',

    fadeOutOnScroll : function(gridSelector = this.containerSelector) {

        if( document.querySelector(gridSelector) === null ) 
        return;	

        let grid = document.querySelector(gridSelector);
        let items = grid.childNodes;

        items.forEach( (item) => {

            UI.grid.fadeOutOnScroll(item);


        });			

    }


}