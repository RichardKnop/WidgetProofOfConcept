(function(w) {
    //------------------------------------
    // Widget Manager
    //------------------------------------
    function WidgetManager(placementId) {
        this.placementId = placementId;
        var adapterFactory = new AdapterFactory();
        this.playerManager = new PlayerManager(adapterFactory.manufacture());
    }
    WidgetManager.prototype.loadConfig = function() {
        return this;
    };
    WidgetManager.prototype.loadModules = function(modules) {
        this.modules = modules;
        return this;
    };
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
    }
    PlayerAdapter.prototype.loadVideo = function(id) {
        return id;
    };

    // HTML5 adapter
    function HTML5Adapter(config) {
        // call parent constructor
        PlayerAdapter.call(this, config);
    }
    // inherit all parent methods
    HTML5Adapter.prototype = new PlayerAdapter();

    // Flash adapter
    function FlashAdapter(config) {
        // call parent constructor
        PlayerAdapter.call(this, config);
    }
    // inherit all parent methods
    FlashAdapter.prototype = new PlayerAdapter();

    // Adapter factory, will contain some logic to choose correct
    // adapter based on device, browser etc
    function AdapterFactory() {
    }
    AdapterFactory.prototype.manufacture = function() {
        // some logic here
        return new FlashAdapter({"foo": "bar"});
    };

    //------------------------------------
    // Assign objects we want visible outside current scope
    //------------------------------------
    w.WidgetManager = WidgetManager;
})(window);