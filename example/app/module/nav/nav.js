(
    function(){
        var moduleName='nav';
        
        function render(el){
            el.addEventListener(
                'click',
                handleClicks
            );
            
            app.trigger('log',moduleName,'READY!');
        }
        
        function handleClicks(e){
            if(e.target.tagName!='LI')
                return;
                
            app.trigger('log','Header Item',e.target.getAttribute('data-item'),'Clicked');
        }
        
        exports(moduleName,render);    
    }
)();