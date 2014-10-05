RIA App framework
=================

***v 2.0.0 app.js is not completely backwards compatible. In order to get v1.x.x to work with v 2.x you need to change the names of the files in the modules folders to module.css, module.js, and module.html. once you do this v2.x will work fone with v1.x modules.*** 

Bare bones and extremely light weight HTML5/JavaScript RIA Framework. Designed for maintainability, simplicity, and rapid development.

This framework implements a dynamic MV* structure for app development, and does not implement any UI or UX styles, it is only meant to make your 
development faster, more maintainable, and more **reuseable** via a modular approach.

This framework is stable and ready for production use.  

## Command-line tool
#### Installation
The RIA Command-line tool makes initializing app directories and creating new modules simple. It can easily be installed by running :

` npm install ria -g `

#### Initializing an app
Once installed you will need to re-open your terminal to have access to the ria tool. Navigate to a directory you wish to initialize as an RIA app.
Run the ` ria ` command to launch the tool and then once in the tool run the ` init ` command. It should look something like this :

    brandon@digiNowU1:~$ cd git
    brandon@digiNowU1:~/git$ mkdir test
    brandon@digiNowU1:~/git$ cd test
    brandon@digiNowU1:~/git/test$ ria
    
    
    # Welcome to the RIA App tool.
    
    >init
    >### Writing /home/brandon/git/test/app/core/app.data.js
    ### Writing /home/brandon/git/test/app/core/app.layout.js
    ### Writing /home/brandon/git/test/app/core/app.css
    ### Writing /home/brandon/git/test/app/core/app.js
    
    >
    
Once you have run this command the directory structure and core files will be created and installed in the correct locations.

#### Creating modules
Once initialized you can create new modules from the root dir of the app as shown below :

    brandon@digiNowU1:~/git/test$ cd ~/git/test
    brandon@digiNowU1:~/git/test$ ria
    
    
    # Welcome to the RIA App tool.
    
    >create module header
    creating module for app in /home/brandon/git/test/app/module>### Writing /home/brandon/git/test/app/module/header/module.css
    ### Writing /home/brandon/git/test/app/module/header/module.html
    ### Writing /home/brandon/git/test/app/module/header/module.js
    ### Writing /home/brandon/git/test/app/module/header/_example.html
    
    >create module footer
    creating module for app in /home/brandon/git/test/app/module>### Writing /home/brandon/git/test/app/module/footer/module.html
    ### Writing /home/brandon/git/test/app/module/footer/module.js
    ### Writing /home/brandon/git/test/app/module/footer/_example.html
    ### Writing /home/brandon/git/test/app/module/footer/module.css

This will create, properly name, structure and configure new empty app modules for development.

You can force a module to have no html or css by adding either or both of the appropriate parameters to the create command.

    >create module api no-css no-html


## Basic usage :
#### Setup

    <!DOCTYPE html>
    <html>
        <head>
            <script src='app/core/app.js'></script>
            <script src='app/core/app.layout.js'></script>
        </head>
        <body>
            
        </body>
    </html>

All that needs be done to get the core architecture working is to include the app.js, and app.layout.js.

#### Loading Modules
***can also be done in app.layout.js*** documentation coming soon.


After creating a module via the command-line tool, you can load it into the app by placing it into the html using the _example.html file located in the 
module's  folder, i.e. ` app/modules/{module name}/_example.html `. Once included the app html might look something like this :

    <!DOCTYPE html>
    <html>
        <head>
            <script src='app/core/app.js'></script>
            <script src='app/core/app.layout.js'></script>
        </head>
        <body>
            <header class='appModule header-module' 
                id='footer-module'
                data-moduletype='header'
                data-css='true' 
                data-html='true'></header>
            
            <footer class='appModule footer-module'
                id='footer-module'
                data-moduletype='footer' 
                data-css='true' 
                data-html='true'></footer>
        </body>
    </html>

The class of appModule denotes to app.js that the element is a dynamicly loaded module. 

| data attribute | what it does |
|----------------|--------------|
| data-moduletype| is the name of the module. This name will be the name of the  folder and files for the module. It will also be the name of the module in the javascript. All of these strict naming conventions are takencare of by the command-line tool. |
| data-css       | denotes weather the module has css that should be loaded or not. This can be set manually in the html or through the command-line tool via the paramater ` no-css ` when creating the module. The default is to include css |
| data-html      | denotes weather the module has html that should be loaded or not. This can be set manually in the html or through the command-line tool via the paramater ` no-html ` when creating the module. The default is to include html |

Feel free to edit the html element tag, class and other data but make sure the above required data points are always there.

## App events and cross module communication
You can trigger events globally in the App scope so that any interested modules can react and use the data passed as needed.

#### binding event listeners

``app.on`` is the binding function. It takes 2 paramaters.

1. The event name
2. Refrence to the callback

With an anonymous callback, it is important to note that anonymous callbacks are re created every time they are executed so are more memory intensive than callback refrences 
if used for events triggered a lot. They are less memory intensive than refrence callbacks if the event is rarely triggered.


    app.on(
        'myEvent',
        function(myName,myAge){
            console.log(myName,myAge);
        }
    );
    
With a callback function refrence, it is important to note that refrenced callbacks are always in memory so they use more memory than anonymous callbacks for events that are rarely triggered, 
but save memory on events that are triggered a lot.
    
    app.on(
        'myEvent',
        handleMe
    );
    
    function handleMe(myName,myAge){
        console.log(myName,myAge);
    }
    
#### triggering events

``app.trigger`` is the event dispatching function. It takes a minimum of one argument and an unlimited maximum number of arguments.

The first argument is the event name, and every argument after that is sent as an argument to the callback.

    app.trigger(
        'myEvent',
        'Brandon',
        29
    );
    
    
