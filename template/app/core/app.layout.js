app.data.layout={
    /* 
     * this is the screen from app.data.layout.modules.ui 
     * where the app will first load
     * 
     * @startAt String
     * 
     */
    "startAt":"home",
    /*
     * 
     * This is where all external libraries can be refrenced,
     * 
     * @path String
     * is where the lib should be fetched from
     * 
     * @type String
     * is the type of lib, css or js
     * 
     */
    "lib" : [
        {
            "path":"app/core/app.css",
            "type":"css"
        },
        {
            "path":"app/core/app.data.js",
            "type":"js"
        },
        {
            "path":"app/core/app.layout.js",
            "type":"js"
        }
    ],
    /*
     * 
     * This is where all of the modules to be fetched
     * are refrenced
     * 
     * @logic Array
     * where all of the js only module names go
     * 
     * @ui Object
     * Where all ui screens are defined. 
     * Each screen is an object containing, 
     * module objects included in the screen.
     * 
     * Each module is an object, we may extend 
     * the framework to allow screen/module 
     * related data to be passed here.
     * 
     * Although a module may be in multiple screens,
     * it will only be loaded on the page once.
     * 
     */
    "modules":{
        "logic":[],
        "ui" : {
            "home" : {
                //this is the list of ui module objects contained in the home screen
                //"header"    : {}
            }
        }
    }
}

/*
 * 
 * as soon as the DOM has finished loading all of the HTML
 * we will fetch and render the modules 
 * 
 */
window.addEventListener(
    'DOMContentLoaded',
    function(){
        /*
         * app.layout 
         * will accept any object in the above form
         * and inject all of the appropriate libs or modules 
         * @param layout Object 
         * 
         */
        app.layout(app.data.layout);
        
        /*
         * 
         * give some time for the render to occur 
         *  
         */
        setTimeout(
            function(){
                
                /*
                 * 
                 * app.navigate
                 * will show the modules for a given screen and hide all of the rest.
                 * 
                 * @param screen String
                 * 
                 */
                app.navigate(
                    app.data.layout.startAt
                );
            },
            500
        )
    }
);