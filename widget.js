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
        this.moduleRenderer = new ModuleRenderer(this);
    }
    WidgetManager.prototype.loadConfig = function() {
        //TODO call platform
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
    WidgetManager.prototype.changeState = function(state) {
        this.playerManager.state = state;
        if (this.isReady()) {
            this.playerManager.adapter.player = q(" .player .video-player", this.container)[0];
            console.log("player ready");
        }
    };
    WidgetManager.prototype.isReady = function() {
        return 1 === this.playerManager.state;
    };
    WidgetManager.prototype.loadVideo = function(id) {
        var player = q('#' + this.containerId + " .player .video-player")[0];
        this.playerManager.adapter.loadVideo(id, player);
        return this;
    };

    WidgetManager.prototype.getPlayer = function() {
        return this.playerManager.adapter.getPlayer();
    };
    WidgetManager.prototype.render = function(containerId) {
        this.container = q('#' + containerId)[0];
        
        for (var i = 0; i < this.modules.length; i++) {
            this.container.innerHTML += this.moduleRenderer.render(this.modules[i]);
        }

        var self = this;
        var videoLinks = q('.collection-browser a', this.container);
        videoLinks.forEach(function(videoLink) {
            videoLink.onclick = function() {
                videoLinks.forEach(function(videoLink) {
                    if (videoLink.className.match(/(?:^|\s)active(?!\S)/)) {
                        videoLink.className = videoLink.className.replace(/(?:^|\s)active(?!\S)/g, '');
                    }
                });
                videoLink.className += " active";
                self.loadVideo(videoLink.getAttribute("rel"));
                return false;
            };
        });

        return this;
    };

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
    };

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
    };
    HTML5Adapter.prototype.getPlayer = function() {
        return 'TODO';
    };

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
        initObject = {
            video_id: this.videoId
        };
        this.player.loadVideoById(initObject);
    };
    FlashAdapter.prototype.getPlayer = function() {
        return '<object class="video-player" id="video-player" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" data="http://vds.rightster.com/v/01z0z6ghx2qwzu" width="100%" height="100%">\
                <param name="movie" value="http://vds.rightster.com/v/' + this.videoId + '" />\
                <param name="wmode" value="window" />\
                <param name="allowFullScreen" value="true" />\
                <param name="allowScriptAccess" value="always" />\
                <param name="allowNetworkAccess" value="always" />\
                <param name="FlashVars" value="jsApi=1" />\
                </object>';
    };

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
    // Modules
    //------------------------------------
    function ModuleRenderer(widgetManager) {
        this.widgetManager = widgetManager;
    };
    ModuleRenderer.prototype.render = function(moduleName) {
        if ("Banner" === moduleName) {
            var module = new BannerModule();
            return module.render();
        }
        
        if ("Player" === moduleName) {
            var module = new PlayerModule();
            return module.render(this.widgetManager);
        }
        
        if ("CollectionBrowser" === moduleName) {
            var module = new CollectionBrowserModule();
            return module.render();
        }
    };
    
    function BannerModule() {}
    BannerModule.prototype.render = function() {
        return '<div class="banner">Banner</div>';
    };
    
    function PlayerModule() {}
    PlayerModule.prototype.render = function(widgetManager) {
        return '<div class="player">' + widgetManager.getPlayer() + '</div>';
    };
    
    function CollectionBrowserModule() {}
    CollectionBrowserModule.prototype.render = function() {
        return '<div class="collection-browser">\
                <ul>\
                <li><a href="#" rel="01z0z6ghx2qwzu" class="active">Video 1</a></li>\
                <li><a href="#" rel="01z117ksx2qwzu">Video 2</a></li>\
                </ul>\
                </div>';
    };

    //------------------------------------
    // Assign objects we want visible outside current scope
    //------------------------------------
    w.WidgetManager = WidgetManager;
})(window, document, qwery);