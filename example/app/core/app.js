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
                HTML:{}
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
                                    js.setAttribute('async', true);
                                    js.setAttribute('src', module+'.js');
                                    document.head.appendChild(js);
                                    
                                    if(el.getAttribute('data-css')!='true')
                                        return;
                                    
                                    var css = document.createElement('link');
                                    css.rel='stylesheet'; 
                                    css.type='text/css'; 
                                    css.setAttribute('href', module+'.css');
                                    document.head.appendChild(css);
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
            
            history.pushState(
                stateObject,
                screen,
                '#'+screen
            );
        }
        
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
                        break;
                    case 'js':
                        lib = document.createElement('script');
                        lib.setAttribute('async', true);
                        lib.setAttribute('src', layout.lib[i].path);
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
         * @param {string} id
         * @param {object} values should contain the key value pairs for all template Data
         * @returns {DocumentFragment} Filled out Template Element
         */
        function fillTemplate(id, values){
            var template=document.getElementById(id).innerHTML;
            var completeTemplate = document.createDocumentFragment();
            
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
            
            completeTemplate.innerHTML=template;
            
            return completeTemplate;
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
        document.onreadystatechange=initModules;
        
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
            exists          : checkModuleExists,
            data            : dataStore
        }

    }
)();