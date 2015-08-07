function NWJSInit(devMode){
    if(typeof require === 'undefined'){
        return false;
    }

    Object.defineProperty(
        this,
        'gui',
        {
            value:require('nw.gui'),
            enumerable:true
        }
    );

    Object.defineProperties(
        this,
        {
            win:{
               value:this.gui.Window.get(),
               enumerable:true
            },
            allowF12Dev:{
                value:allowDev,
                enumerable:true
            },
            isDevAllowed:{
                value:false,
                enumerable:true,
                writable:true
            }
        }
    );

    if(devMode){
        this.allowF12Dev();
    }

    function allowDev(){
        if(this.isDevAllowed){
            return true;
        }

        window.addEventListener(
            'keyup',
            function(e){
                if(e.keyCode!=123){
                    return;
                }
                this.win.showDevTools();
            }.bind(this)
        );

        return this.isDevAllowed=true;
    }
}
