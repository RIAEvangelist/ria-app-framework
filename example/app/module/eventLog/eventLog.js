(
    function(){
        var moduleName='eventLog';
        
        function render(el){
            var eventLog=document.getElementById('eventLog');
            //not using console.log incase it doesn't work in some browser. *TLDT (Too lazy didn't test)*
            eventLog.log=_log_;
            eventLog.log(moduleName,'READY!');
        }
        
        function _log_ (){
            var events=Array.prototype.slice.call(arguments),
                newEvent=document.createElement('li');
            
            newEvent.innerHTML=events.join(' ');
            this.appendChild(newEvent);
        }
        
        function logHandler(){
            document.getElementById('eventLog').log(
                Array.prototype.slice.call(arguments)    
            );
        }
        
        
        app.on('log',logHandler);
        exports(moduleName,render);    
    }
)();