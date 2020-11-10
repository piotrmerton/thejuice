export let searchForm = {

    formSelector : '.search-form',
    inputSelector : '.query--input',
    autocompleteSelector : '.form__autocomplete',


    /**
     *	bind listeners related to form's input
     */
    bind : function() {

        if( document.querySelector(this.formSelector) === null ) return;

        let form = document.querySelector(this.formSelector);
        let input = form.querySelector(this.inputSelector);
        let autocomplete = form.querySelector(this.autocompleteSelector);

        this.typeWatch(input);

        //	1. stretch input width to value/placeholder's width, but first wait for fonts to load
        window.addEventListener('load', () =>{
            this.resize(input);
            this.swapCarets(form, input, autocomplete);
            this.setCaretAtEnd(input);
        });

        //	TO DO: listen to window resize as well?			

        //2. listen to focus event
        input.addEventListener( 'focus', (event) => {
            form.classList.add('form--focused');
            //if we have focus, maybe it would be good idea to remove keypress event listener?
        });

        //	3. listen to loose of focus
        input.addEventListener( 'blur', (event) => {

            form.classList.remove('form--focused');

            // force focus or...
            //input.focus();

            //	...watch for keypresses instead?

            this.typeWatch(input);

        });


        //	4. update input width on keypress...a
        document.documentElement.addEventListener('input', (event) => {			
            this.resize(event.target);
            this.swapCarets(form, input, autocomplete);
        });

        // ...Firefox fires a change event instead of an input event
        document.documentElement.addEventListener('change', (event) => {
            this.resize(event.target);
            this.swapCarets(form, input, autocomplete);
        });

        //	5. submit
        form.addEventListener('submit', (event) => {
            
            this.submit(form);

            event.preventDefault();
        });

    },

    /**
     *	automatically focus on input on typing letters, numbers or backspace (8)
     *	@param input {HTML object}
     */
    typeWatch : function(input) {

        document.addEventListener('keydown', (event) => {

            let keyboardInput  = String.fromCharCode(event.keyCode);

            if (/[a-zA-Z0-9-_ ]/.test(keyboardInput) || event.keyCode == 8)

            input.focus();

        })

    },

    /**
     *	watches for value change of input and replaces stylized caret with native one
      *
     *	reason: caret isn't something that can be easily changead via CSS or JS, mainly due it being system, not browser-controlled element and it would required writing custom text input system that would handle key presses, printing, handling shortcuts, copying, backspacing, selecting etc which is fair bit of work and probably for the best is to not mess with default inputs. So instead, we are displaying stylized caret before user starts typing - then we will use native one. Compromise may be to hide native one and have stylized one always visible but without backtracing (always at the end of value, which is highly unintuitive). The challenge is not only technical, but visual, because how would letters behave with caret that is couple pixes wide with custom webfont that don't have normalized letter-width?
     *	
     */
    swapCarets : function(form, input, autocomplete) {

        if( input.value != '') {
            form.classList.add('form--not-empty')
            setTimeout( () => {

                //need to test if after timeout value is still empty
                if (input.value != '')
                input.classList.add('input--show-native-caret')
            }, 250);

        } else {
            input.classList.remove('input--show-native-caret')
            form.classList.remove('form--not-empty')				
        }

        if( autocomplete != null && autocomplete.childNodes.length ) {
            form.classList.add('form--autocomplete');
        } else {
            form.classList.remove('form--autocomplete');
        }

    },

    setCaretAtEnd : function(input) {
        
        let elemLen = input.value.length;
        
        // For IE Only
        if (document.selection) {
            // Set focus
            input.focus();
            // Use IE Ranges
            let oSel = document.selection.createRange();
            // Reset position to 0 & then set at end
            oSel.moveStart('character', -elemLen);
            oSel.moveStart('character', elemLen);
            oSel.moveEnd('character', 0);
            oSel.select();
        }

        else if (input.selectionStart || input.selectionStart == '0') {
            // Firefox/Chrome
            input.selectionStart = elemLen;
            input.selectionEnd = elemLen;
            input.focus();
        }

    },


    /**	
     *	fits <input> width to content width,
     *	based on https://github.com/LeaVerou/stretchy
     *
     *	@param input {HTML object}
     *	
     */
    resize : function(input) {

        let offset = 0;
        let empty

        if (!input.value && input.placeholder) {
            input.value = input.placeholder;
            empty = true;
        }	

        // First test that it is actually visible, otherwise all measurements are off
        input.style.width = "1000px";					

        if (input.offsetWidth) {
            input.style.width = "0";

            offset = input.offsetWidth;

            let width = Math.max(offset, input.scrollWidth - input.clientWidth);

            input.style.width = width + "px";

            // To bulletproof, we will set scrollLeft to a
            // huge number, and read that back to see what it was clipped to
            // and increment width by that much, iteratively

            for (let i=0; i<10; i++) { // max iterations
                input.scrollLeft = 1e+10;

                if (input.scrollLeft == 0) {
                    break;
                }

                width += input.scrollLeft;

                input.style.width = width + "px";
            }

        } else {
            // Element is invisible, just set to something reasonable
            input.style.width = input.value.length + 1 + "ch";
        }			

        if (empty) input.value = "";

    },


    submit : function(form) {

        alert('Search form submitted, see submit() @ _js/ui/searchForm.js');

    }

}