(
    function(){
        var moduleName='footer';
        
        function render(el){
            el.addEventListener(
                'click',
                handleClicks
            );
            
            app.trigger('log',moduleName,'READY!');
        }
        
        function handleClicks(e){
            switch(e.target.id){
                case 'footerButton':
                    app.trigger('log','Footer Button Clicked');
                    break;
            }
        }
        
        exports(moduleName,render);    
    }
)();