function CustomFrame(){
    Object.defineProperties(
        this,
        {
            set:{
                value:{
                    fullscreen:{
                        value:setFullscreen,
                        enumerable:true
                    },
                    close:{
                        value:setClose,
                        enumerable:true
                    },
                    maximize:{
                        value:setMaximize,
                        enumerable:true
                    },
                    unMaximize:{
                        value:setUnMaximize,
                        enumerable:true
                    },
                    minimize:{
                        value:setMinimize,
                        enumerable:true
                    }
                },
                enumerable:true
            }
        }
    );

    function setFullscreen(){
        var action=window.toggleFullscreen;

    }

    function setClose(){
        var action=window.close;

    }

    function setMaximize(){
        var action=window.maximize;

    }

    function setUnMaximize(){
        var action=window.unmaximize;

    }

    function setMinimize(){
        var action=window.minimize;

    }
}
