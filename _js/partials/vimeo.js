export let vimeo = {

    playerSelector : '.vimeo-player',
    players : [],

    
    init : function(players = this.playerSelector) {

        if( document.querySelector(players) === null ) return;

        let videos = document.querySelectorAll(players);

        this.render(videos);

    },

    /** 
     *	render video players via Vimeo SDK https://developer.vimeo.com/player/sdk/basics 
     * @param {videos} array of {HTML} objects
     */
    
    render : function(videos) {

        let playerSettings = {
            width: 1920,
            height: 1080,
            transparent: true,
            title: false
        };

        videos.forEach( (item) => {

            let videoId = item.dataset.videoId;
            let playerExists = false;

            this.players.forEach( (player) => {

                if( player.videoId == videoId) {
                    
                    playerExists = true;
                    player.player = new Vimeo.Player(
                        item,
                        {
                            id: videoId,
                            ...playerSettings
                        }
                    );

                    return;
                }

            });

            if( !playerExists ) 

            this.players.push({
                videoId,
                player : new Vimeo.Player(
                    item,
                    {
                        id: videoId,
                        ...playerSettings
                    }
                )
            });

        });


    },

    play : function(videoId) {

        let video = this.players.find(player => parseInt(player.videoId) === videoId);
        
        video.player.play();

    },

    stop : function(videoId) {



        if(!this.players.length) return;


        if( videoId ) {
            //stop single video by ID
            let video = this.players.find(player => parseInt(player.videoId) === videoId);
            video.player.pause();			
        } else {
            //stop all

            this.players.forEach( (video) => {

                video.player.pause();

            });

        }

    }



}