var app=(
    function(){

/************\
    Scope
\************/
        var config={
            modulesPath : 'app/module/'
        }

        var modules,
            constructors={},
            moduleQueue = {},
            events=[],
            dataStore={
                hasWebkitSpeech:(document.createElement("input").hasOwnProperty('webkitSpeech')),
                hasSpeech:(document.createElement("input").hasOwnProperty('speech')),
                HTML:{},
                JS:{},
                CSS:{}
            }

        if(history){
          history={
            pushState:function(stateObject,screen){
              history.state=stateObject;
            },
            state:{}
          }
        }

        function setConfig(userConfig){
            for(var property in userConfig){
                if(!userConfig.hasOwnProperty('property'))
                    return;

                config[property] = userConfig[property];
            }
        }

/************\
    Modules
\************/
        function getModules(){
            modules=document.getElementsByClassName('appModule');
        }

        function buildModules(elements){
            if(!elements){
                elements=modules;
                if(!elements)
                    elements=[];
            }

            if( !elements[0])
                elements=[elements];

            if( !elements[0].getAttribute)
                return;

            var moduleCount=elements.length;

            for(var i=0; i<moduleCount; i++){
                var el=elements[i];
                var moduleType=el.getAttribute('data-moduletype');

                if(!constructors[moduleType]){
                    (
                        function(config,moduleType,moduleQueue,el){
                            setTimeout(
                                function(){
                                    if(moduleQueue[moduleType])
                                        return;

                                    var module=config.modulesPath+moduleType+'/module';
                                    moduleQueue[moduleType]=true;

                                    var js = document.createElement('script');
                                    js.async=true;
                                    js.setAttribute('src', module+'.js');
                                    document.head.appendChild(js);
                                    dataStore.JS[moduleType]=js.outerHTML;

                                    if(el.getAttribute('data-css')!='true')
                                        return;

                                    var css = document.createElement('link');
                                    css.rel='stylesheet';
                                    css.type='text/css';
                                    css.setAttribute('href', module+'.css');
                                    document.head.appendChild(css);
                                    dataStore.CSS[moduleType]=css.outerHTML;
                                },
                                0
                            );
                        }
                    )(config,moduleType,moduleQueue,el);

                    if(el.getAttribute('data-html')=='true')
                        fetchModuleHTML(moduleType);

                    continue;
                }

                if(app.data.HTML[moduleType])
                    HTMLLoaded(el,moduleType);

                if(
                    (el.innerHTML!='' && el.getAttribute('data-html')=='true') ||
                    el.getAttribute('data-html')!='true')
                {
                    constructors[moduleType](el);
                    continue;
                }else{
                    (
                        function(){
                            setTimeout(
                                function(){
                                    //console.log(el);
                                    buildModules(el);
                                },
                                50
                            )
                        }
                    )(el)
                }
            }
        }

        function fetchModuleHTML(moduleType){
            var xmlhttp;
                xmlhttp=new XMLHttpRequest();

            (
                function(){
                    xmlhttp.onreadystatechange=function(){
                        if (xmlhttp.readyState==4 && xmlhttp.status==200){
                            dataStore.HTML[moduleType]=xmlhttp.responseText;
                            HTMLLoaded(
                                document.querySelectorAll('[data-moduletype="'+moduleType+'"]'),
                                moduleType
                            );
                        }
                    }
                }
            )(moduleType);

            xmlhttp.open('GET',config.modulesPath+moduleType+'/module.html',true);
            xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
            xmlhttp.send();
        }

        function HTMLLoaded(modules,moduleType){
            if(!modules.length)
                modules=[modules];
            var totalModules=modules.length;
            for(var i=0; i<totalModules; i++){
                var module=modules[i];
                module.innerHTML=dataStore.HTML[moduleType];
                findAndInitDynamicModules(module);
            }
        }

        function deferredLoad(type){
            buildModules(document.querySelectorAll('[data-moduletype="'+type+'"]'));
        }

        function renderCompiledApp(){
            var modules=Object.keys(constructors);
            for(var i=0; i<modules.length; i++){
                constructors[modules[i]](
                    document.getElementById(modules[i]+'-module')
                )
            }
        }

        function appendDOMNode(el){
            (
                function(){
                    setTimeout(
                        function(){
                            document.querySelector(
                                el.getAttribute('data-dompath')
                            ).appendChild(el);
                        }
                        ,0
                    );
                }
            )(el);
        }

        /*
         *
         * @param {string} screen : the name of the screen or group of modules
         * from the app.data.layout object you wish to see
         *
         * @param {object} stateObject : defaults to {screen:the passed screen name}
         * @returns {undefined}
         */
        function showModuleGroup(screen,stateObject){
            if(!app.data.layout)
                return;
            if(!screen)
                screen=app.data.layout.startAt;
            if(!stateObject)
                stateObject={
                    screen:screen
                };
            if(!stateObject.screen)
                stateObject.screen=screen;

            var modules=document.getElementsByClassName('appModule');
            var screenContains=Object.keys(
                app.data.layout.modules.ui[screen]
            );

            for(var i=0; i<modules.length; i++){
                var type=modules[i].getAttribute(
                    'data-moduletype'
                );
                //console.log(type)
                if(screenContains.indexOf(type)>-1){
                    modules[i].classList.remove('hidden');
                    continue;
                }

                modules[i].classList.add('hidden');
            }

            triggerEvent(
                'app.navigated.'+screen,
                stateObject
            )

            history.pushState(
                stateObject,
                screen,
                '#'+screen
            );
        }

        registerEvent(
            'app.navigate',
            showModuleGroup
        )

        window.addEventListener(
            'popstate',
            function(e){
                var state=e.state;
                if(!state)
                    state={};

                if(!state.screen)
                    state.screen=document.location.hash.slice(1);

                showModuleGroup(
                    state.screen,
                    state
                );
            }
        );

        function layoutApp(layout){
            if(!layout.lib)
                layout.lib=[];
            if(!layout.modules)
                layout.modules={};

            for(var i=0; i<layout.lib.length; i++){
                var lib;
                switch(layout.lib[i].type){
                    case 'css' :
                        lib = document.createElement('link');
                        lib.setAttribute('href', layout.lib[i].path);
                        lib.setAttribute('rel', 'stylesheet');
                        dataStore.CSS[layout.lib[i].path]=lib.outerHTML;
                        break;
                    case 'js':
                        lib = document.createElement('script');
                        lib.setAttribute('async', true);
                        lib.setAttribute('src', layout.lib[i].path);
                        dataStore.JS[layout.lib[i].path]=lib.outerHTML;
                        break;
                }

                document.head.appendChild(lib);
            }

            for(var i=0; i<layout.modules.logic.length; i++){
                var newModule=createModuleElement(layout.modules.logic[i],'false','false');

                appendDOMNode(newModule);
            }

            var modulesToUse=Object.keys(layout.modules.ui);
            for(var i=0; i<modulesToUse.length; i++){
                var modulesInGroup=Object.keys(layout.modules.ui[modulesToUse[i]]);
                for(var j=0; j<modulesInGroup.length; j++){
                    var name=modulesInGroup[j];
                    //console.log(name);
                }
            }

            var fullList={};
            var screenList=Object.keys(layout.modules.ui);
            for(var i=0; i<screenList.length; i++){
                var screenModules=Object.keys(
                    layout.modules.ui[screenList[i]]
                );
                //console.log('screenMuduleList',screenModules);
                for(var j=0; j<screenModules.length; j++){
                    //console.log('screenMudule',screenModules[j]);
                    fullList[screenModules[j]]=true;
                }
            }
            //console.log(fullList)
            if(dataStore.compiled)
              return;

            var layoutModules=Object.keys(fullList);
            for(var i=0; i<layoutModules.length; i++){
                //console.log('screenMudule',layoutModules[i]);
                name=layoutModules[i];

                var newModule=createModuleElement(name);

                appendDOMNode(newModule);
            }

        }

        function createModuleElement(name,html,css){
            var newModule=document.createElement("div");
            //console.log(name)
            if(!html)
                html='true';
            if(!css)
                css='true';

            newModule.id=name+'-module';
            newModule.classList.add(
                'appModule',
                'hidden',
                name+'-module'
            );

            newModule.setAttribute(
                'data-dompath',
                'body'
            );
            newModule.setAttribute(
                'data-moduletype',
                name
            );
            newModule.setAttribute(
                'data-html',
                html
            );
            newModule.setAttribute(
                'data-css',
                css
            );

            return newModule;
        }

        function checkModuleExists(moduleType){
            return !!!constructors[moduleType];
        }

        function findAndInitDynamicModules(parent){
            buildModules(parent.querySelectorAll('[data-moduletype]'));
        }

        function addConstructor(type, moduleInit){
            if(constructors[type])
                return;
            constructors[type] = moduleInit;
            if(document.readyState == 'complete')
                deferredLoad(type);
        }

        function initModules(){
            switch(document.readyState){
                case 'interactive' :
                    //dom not yet ready
                    break;
                case 'complete' :
                    getModules();
                    buildModules();
                    break;
            }
        }

/************\
    Utils
\************/

        /*
         *
         * @param {string} id id of element to fetch innerHTML as contents for template
         *                  or raw string to be used as template if rawString set to true
         * @param {object} values should contain the key value pairs for all template Data
         * @param {bool} rawString use id as a raw string
         * @param {bool} asString return as string
         * @returns {DomElement} if asString is false or not specified will return Filled out Template Element
         * @returns {string} if asString is true will return a filled out template string
         */
        function fillTemplate(id, values, rawString, asString){
            var template=id;

            if(!id)
                throw new AppError('Templates must specify either id or a string+rawString flag','app.template');

            if(!rawString)
                template=document.getElementById(id).innerHTML;

            var keys=Object.keys(values);
            for(var i=0; i<keys.length; i++){
                var regEx=new RegExp(
                    '\\$\\{'+keys[i]+'\\}',
                    'g'
                );

                template=template.replace(
                    regEx,values[keys[i]]
                )
            }

            var completeTemplate=template;

            if(!asString){
                completeTemplate = document.createElement('div');
                completeTemplate.innerHTML=template;
                completeTemplate=completeTemplate.querySelector('*');
            }

            return completeTemplate;
        }

        /*
         *
         * @param {string} type
         * @returns {string} compiledApp
         */
        function getCurrentCompiledState(type){
            var html='<html class="compiled-app"><head>${head}</head><body>${body}</body></html>';
            var defaults='<script src="app/core/app.js"></script>'
                    +'<script src="app/core/app.layout.js"></script>';

            if(type=='test'){
                defaults+='<link rel="stylesheet" type="text/css" href="jasmine/lib/jasmine-2.0.2/jasmine.css">'
                    +'<script type="text/javascript" src="jasmine/lib/jasmine-2.0.2/jasmine.js"></script>'
                    +'<script type="text/javascript" src="jasmine/lib/jasmine-2.0.2/jasmine-html.js"></script>'
                    +'<script type="text/javascript" src="jasmine/lib/jasmine-2.0.2/boot.js"></script>'
                    +'<script src="app/core/app.test.js"></script>';
            }

            this.body='';
            this.head='';
            var list=[
                'HTML',
                'CSS',
                'JS'
            ];

            function compileModule(name,content){
                var module=createModuleElement(
                    name
                );

                module.innerHTML=content;

                this.body+=module.outerHTML;
            }

            for(var j=0; j<list.length; j++){
                var keys=Object.keys(dataStore[list[j]]);
                for(var i=0; i<keys.length;i++){
                    if(list[j]!="HTML"){
                        console.log(list[j],keys[i]);
                        this.head+=dataStore[
                            list[j]
                        ][
                            keys[i]
                        ];
                        continue;
                    }

                    console.log(list[j],keys[i]);
                    compileModule.call(
                        this,
                        keys[i],
                        dataStore[
                            list[j]
                        ][
                            keys[i]
                        ]
                    );
                }
            }


            return fillTemplate(
                html,
                {
                    head:defaults+this.head,
                    body:this.body
                },
                true,
                true
            ).replace(
                /\s+/g,
                ' '
            );
        }

/************\
    Error
\************/

        /**
        * custom application error
        *
        * @param {string} message
        * @param {string} type
        * @returns {AppError}
        */
        function AppError(message, type) {
           this.name = "AppError";
           this.message = message || "Application Error Message";
           this.type = type || "Generic Application Error"; // possible error types are User, Api, etc...
        }
        AppError.prototype = new Error();
        AppError.prototype.constructor = AppError;
        window.AppError = AppError;


/************\
    Events
\************/
        function registerEvent(eventName,handler){
            if(!events[eventName])
                events[eventName]=[];

            events[eventName].push(handler);
        }

        function removeEvent(eventName){
            delete events[eventName]
        }

        function triggerEvent(eventName){
            if(!events[eventName])
                return;

            var totalEvents=events[eventName].length,
                args=Array.prototype.slice.call(arguments,1);

            for(var i=0; i<totalEvents; i++){
                (
                    function(event){
                        setTimeout(
                            function(){
                                event.apply(null,args);
                            }
                            ,0
                        );
                    }
                )(events[eventName][i],args);
            }
        }

        window.exports=addConstructor;
        document.addEventListener(
            'readystatechange',
            function(){
                dataStore.compiled=document.querySelector('html').classList.contains('compiled-app');
                if(!dataStore.compiled){
                    initModules();
                    return;
                }

                renderCompiledApp();
            }
        );

        return {
            register        : addConstructor,
            layout          : layoutApp,
            navigate        : showModuleGroup,
            createModule    : createModuleElement,
            build           : buildModules,
            inject          : appendDOMNode,
            config          : setConfig,
            on              : registerEvent,
            off             : removeEvent,
            template        : fillTemplate,
            trigger         : triggerEvent,
            error           : AppError,
            compile         : getCurrentCompiledState,
            exists          : checkModuleExists,
            data            : dataStore
        }

    }
)();