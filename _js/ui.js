/*
 *	simple object with UI related logic 
 */

import { grid } from './partials/grid';
import { project } from './partials/project';
import { postsList } from './partials/postsList';
import { modal } from './partials/modal';
import { searchForm } from './partials/searchForm';
import { vimeo } from './partials/vimeo';

export let UI = {

    mobile : /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent),
    windowWidth : window.innerWidth,
    windowHeight : window.innerHeight,
    debug : false,

    //calculate and store viewport dimensions
    init : function() {

        this.recalc();
        

    },

    //updates viewport-related values on window resize
    //this method will be bound to window resize event so try not to overload it
    recalc : function() {

        if(this.debug) console.log( 'Window width: '+this.windowWidth+ ', Window height: '+this.windowHeight );

        //update values
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;		

    },

    grid,
    project,
    postsList,
    modal,
    searchForm,
    vimeo,


}
