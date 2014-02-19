(
    function(){
        var moduleName='header';
        
        function render(el){
            el.querySelector('.logo').addEventListener(
                'click',
                function(){
                    app.trigger('log','header logo clicked');
                }
            );
            app.trigger('log',moduleName,'READY!');
        }
        
        exports(moduleName,render);    
    }
)();