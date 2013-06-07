(function(w, d, q) {
    //------------------------------------
    // Extending array prototype
    //------------------------------------
    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function(fn, scope) {
            for (var i = 0, len = this.length; i < len; ++i) {
                fn.call(scope, this[i], i, this);
            }
        };
    }
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(needle) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] === needle) {
                    return i;
                }
            }
            return -1;
        };
    }

    //------------------------------------
    // Widget Manager
    //------------------------------------
    function WidgetManager(placementId) {
        this.placementId = placementId;
        var adapterFactory = new AdapterFactory();
        this.playerManager = new PlayerManager(adapterFactory.manufacture());
        this.modules = new Array();
    }
    WidgetManager.prototype.loadConfig = function() {
        return this;
    };
    WidgetManager.prototype.loadModules = function(modules) {
        modules.forEach(function(element, index, array) {
            if (["Banner", "Player", "CollectionBrowser"].indexOf(element) < 0) {
                array.splice(index, 1);
            }
        });
        this.modules = modules;
        return this;
    };
    WidgetManager.prototype.render = function(containerId) {
        var container = q('#' + containerId);
        
        for (var i = 0; i < this.modules.length; i++) {
            if ("Banner" === this.modules[i]) {
                container[0].innerHTML += '<div class="banner">Banner</div>';
            } else if ("Player" === this.modules[i]) {
                container[0].innerHTML += '<div class="player">' + this.getPlayer() + '</div>';
            } else if ("CollectionBrowser" === this.modules[i]) {
                container[0].innerHTML += '<div class="collection-browser">\
                                           <ul>\
                                           <li>Video 1</li>\
                                           <li>Video 2</li>\
                                           <li>Video 3</li>\
                                           </ul>\
                                           </div>';
            }
        }
        
        return this;
    }
    WidgetManager.prototype.loadVideo = function(id) {
        this.playerManager.adapter.loadVideo(id);
        return this;
    };
    WidgetManager.prototype.changeState = function(state) {
        this.playerManager.state = state;
        if (this.isReady()) {
            console.log("player is ready yay");
        }
    };
    WidgetManager.prototype.isReady = function() {
        return 1 === this.playerManager.state;
    }
    WidgetManager.prototype.getPlayer = function() {
        return this.playerManager.adapter.getPlayer();
    }

    //------------------------------------
    // Player Manager
    //------------------------------------
    function PlayerManager(adapter) {
        this.adapter = adapter;
        this.status = 0;
    }

    // Abstract adapter class
    function PlayerAdapter(config) {
        this.config = config;
        if ("initialVideoId" in this.config) {
            this.videoId = this.config["initialVideoId"];
        }
    }
    PlayerAdapter.prototype.loadVideo = function(videoId) {
        this.videoId = videoId;
    }

    // HTML5 adapter
    function HTML5Adapter(config) {
        // call parent constructor
        PlayerAdapter.call(this, config);
    }
    // inherit all parent methods
    HTML5Adapter.prototype = Object.create(PlayerAdapter.prototype);
    HTML5Adapter.prototype.loadVideo = function(videoId) {
        PlayerAdapter.prototype.loadVideo.call(this, videoId);
        //TODO
    }
    HTML5Adapter.prototype.getPlayer = function() {
        return 'TODO';
    }

    // Flash adapter
    function FlashAdapter(config) {
        // call parent constructor
        PlayerAdapter.call(this, config);
    }
    // inherit all parent methods
    FlashAdapter.prototype = Object.create(PlayerAdapter.prototype);
    FlashAdapter.prototype.constructor = FlashAdapter;
    FlashAdapter.prototype.loadVideo = function(videoId) {
        PlayerAdapter.prototype.loadVideo.call(this, videoId);
        //TODO
    }
    FlashAdapter.prototype.getPlayer = function() {
        return '<object class="video-player" id="video-player" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" data="http://vds.rightster.com/v/01z0z6ghx2qwzu" width="100%" height="100%">\
                <param name="movie" value="http://vds.rightster.com/v/' + this.videoId + '" />\
                <param name="wmode" value="window" />\
                <param name="allowFullScreen" value="true" />\
                <param name="allowScriptAccess" value="always" />\
                <param name="allowNetworkAccess" value="always" />\
                <param name="FlashVars" value="jsApi=1" />\
                </object>';
    }

    // Adapter factory, will contain some logic to choose correct
    // adapter based on device, browser etc
    function AdapterFactory() {
    }
    AdapterFactory.prototype.manufacture = function() {
        // some logic here
        return new FlashAdapter({"initialVideoId": "01z0z6ghx2qwzu"});
        //return new HTML5Adapter({"initialVideoId": "01z0z6ghx2qwzu"});
    };

    //------------------------------------
    // Assign objects we want visible outside current scope
    //------------------------------------
    w.WidgetManager = WidgetManager;
})(window, document, qwery);