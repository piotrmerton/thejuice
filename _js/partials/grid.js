import { UI } from '../ui';

export let grid = {
    
    /*
        this is prototype only, been testing and comparing different methods to achieve fading out on scroll on leaving/entering browser viewport, 
        items entering viewport from the bottom is difficult to implement regarding to controlling threshold, offset, and differentiating these values for entering/leaving top and bottom of the viewport.

        - intersection Observer (performance-friendly but experimental API that wasn't fully supported couple months ago, direction agnostic)
        - scroll event with getBoundingClientRect (worse for performance due to occupying main thread)

        plugins:

        - scrollout - best choice but didn't work as expected for multiple targets and offset property (all targets were affected simultaneously when offset was set)
        - scrollreveal - more of an animation library with built in css animations
        - waypoints - not longer maintained, does not support es6 modules 


        @param gridSelector can be either string with valid CSS selector or DOM object
        
    */
    fadeOutOnScroll : function(gridSelector, options) {

        let items;

        if( typeof gridSelector == 'object' ) {

            items = gridSelector.childNodes;

        } else {

            if( document.querySelector(gridSelector) === null ) 
            return;	

            let grid = document.querySelector(gridSelector);
            
            items = grid.childNodes;

        }


        /*	Intersection Observer (experimental API, compatibility with iOS only as of late 2018) 
         *	https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
         *	intersection observer is direction agnostic by design, there are ways to compute scroll direction, but I had hard time making it work, start from here: https://stackoverflow.com/a/51976805 or https://benfrain.com/determining-the-direction-of-intersectionobserver-events/
         but keep in mind that those examples are written with one target in mind
         */

        //by default, offset is based on header height
        let header = document.querySelector('.header-top');
        let headerWithoutFilters = document.querySelector('.header__layout');
        let offsetDesktop = header.offsetHeight;
        let offsetMobile = headerWithoutFilters.offsetHeight;

        let offset = UI.mobile ? offsetMobile : offsetDesktop;

        offset = -offset + 'px 0px 0px 0px'; //TO DO: offset bottom dynamic as well?

        let observerOptions = {
            rootMargin: offset,
            threshold: [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
        }

        //we are observing multiple, row-based items so lets store positions in index-based array
        //this is the most important part to computing scroll direction for multiple targets - observer will
        //be triggered simultaneously and it is essential to have clear reference on which specific item has what position and what was its previous position - simple variable (https://stackoverflow.com/a/51976805) or array (https://benfrain.com/determining-the-direction-of-intersectionobserver-events/) messes everything up
        let triggerElementPositions = [];

        let observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {

                const itemId = entry.target.dataset.itemIndex;

                const currentRatio = entry.intersectionRatio;
                const currentY = entry.boundingClientRect.top;
                const isIntersecting = entry.isIntersecting;
                const isAbove = currentY < entry.rootBounds.y;

                let previousY = triggerElementPositions[itemId] ? triggerElementPositions[itemId].y : 0;
                let previousRatio = triggerElementPositions[itemId] ? triggerElementPositions[itemId].ratio : 0;
                
                let direction = currentY > previousY ? 'up' : 'down';

                if( currentY == previousY) return;

                triggerElementPositions[itemId] = {
                    y : currentY,
                    ratio : currentRatio
                };
                
            
                // Scrolling down/up
                if (currentY < previousY) {

                    if (currentRatio > previousRatio ) {
                        if( UI.debug ) entry.target.dataset.state = "Scrolling down enter";
                        
                        if (currentRatio == 1) entry.target.classList.add('item--scrolled-down');


                    } else if (currentRatio < previousRatio)  {
                        if( UI.debug ) entry.target.dataset.state = "Scrolling down leave";
                        if (UI.mobile) {
                            // for mobile add some additional threshold
                            if( currentRatio < .5 )
                            entry.target.classList.add('item--faded');
                        } else {
                            entry.target.classList.add('item--faded');
                        }
                        

                    }

                } else if (currentY > previousY) {

                    if (currentRatio < previousRatio) {
                        if( UI.debug ) entry.target.dataset.state = "Scrolling up leave";
                        entry.target.classList.remove('item--scrolled-down');

                    } else if (currentRatio > previousRatio) {
                        if( UI.debug ) entry.target.dataset.state = "Scrolling up enter"
                        if (currentRatio > .75) entry.target.classList.remove('item--faded');

                    }

                }

                //if there wasn't user-initiated scroll but page loaded at offset
                if( previousY == 0 && window.pageYOffset != 0) {					
                    if( UI.debug ) entry.target.dataset.isAbove = isAbove;
                    if (isAbove) entry.target.classList.add('item--faded');
                                        
                }

                if( UI.debug ) entry.target.dataset.intersection = currentRatio;




              });
        }, observerOptions);


        //wait for everything to load (fonts, images) before starting observing for viewport intersections
        window.addEventListener('load', () =>{
            items.forEach(item => {
                observer.observe(item);
            });
        });



    },

    /*	
     *	This function will add row-related classes (based on last, next to last and second to last rows) to list items on projects__list
     *	will be bound to resize window event, so it may slightly hit performance (desktop only)
     *	reason: on Sketch, items on project and talents lists on have different opacity on last rows
     */
    mapRows : function(gridSelector) {

        if( UI.mobile || document.querySelector(gridSelector) === null ) 
        return;

        let grid = document.querySelector(gridSelector);
        
        //let items = grid.querySelectorAll('.list__item');

        //get only direct children
        let items = Array.prototype.filter.call(grid.children, function (child) {
            return child.matches('.list__item');
        });
    

        let gridWidth = grid.offsetWidth;
        let globalWidth = 0;
        let currentRowWidth = 0;
        let currentRow = 1;
        let totalRows;

        //we need to run two similar loops, so this code is a little bit WET (you know, as opposed to DRY...)

        //first - we calculate how many rows are needed for grid...
        items.forEach( (item, index) => {
            index++;
            let itemWidth = item.offsetWidth;
            
            currentRowWidth += itemWidth;

            if( currentRowWidth > gridWidth ) {
                currentRowWidth = itemWidth;
                currentRow++;
            }

            //if bound to resize event, clean up previously assigned classes
            item.classList.remove('item--last-row');
            item.classList.remove('item--next-to-last-row');
            item.classList.remove('item--second-to-last-row');

            //we can't do anything here since we don't know the totalRows count yet

            if( UI.debug ) console.log( 'element '+index+' is in row '+currentRow );			
        });

        totalRows = currentRow;

        if( totalRows < 4) return;

        //...and second - now we know the totalRows count, we can map proper classes accordingly
        currentRowWidth = 0;
        currentRow = 1;

        items.forEach( (item, index) => {
            let itemWidth = item.offsetWidth;
            
            currentRowWidth += itemWidth;

            if( currentRowWidth > gridWidth ) {
                currentRowWidth = itemWidth;
                currentRow++;
            }

            if(currentRow == totalRows)
            item.classList.add('item--last-row');

            if(currentRow == totalRows - 1)
            item.classList.add('item--next-to-last-row');	

            if(currentRow == totalRows - 2)
            item.classList.add('item--second-to-last-row');					
        
        });	

    },

    /*	
     *	since Sketch project relies on revealing content on :hover on projects and talents lists, we need to adapt for mobile devices as well (especially legacy ones that don't support 3D touch)
     *	if CSS toggle display on :hover, iOS automatically used to require double tap (first to reveal, second to fire event, see: https://css-tricks.com/annoying-mobile-double-tap-link-issue/),
     *	but as of 07-2019 it seems that it doesn't work that way anymore so we need JS to transition hover to touch on mobile devices (JS-based solution is necessary for Android as well)
     *
     *	it would be probably for the best to not rely on hover to reveal anything in the first place and not to mess with default logic, since "double-tapping" on mobile can be perceived as an issue or a bug 
     */
    hoverToTouch : function(gridSelector) {

        if(!UI.mobile || document.querySelector(gridSelector) === null) return;

        let grid = document.querySelector(gridSelector);
        let items = grid.querySelectorAll('.list__item');
        let touchClass = 'item--active';		

        items.forEach( function( item, index ) {

            item.addEventListener('click', (event) => {


                //remove touched helper class from siblings
                let siblings = 	Array.prototype.filter.call(item.parentNode.children, (child) => {
                    return child !== item;
                });

                siblings.forEach( (sibling) => {
                    sibling.classList.remove(touchClass);
                });				
                

                if( !item.classList.contains(touchClass) ) {
                    
                    item.classList.add(touchClass);
                    event.preventDefault();
                }

                
            });

        });	


    },	

}