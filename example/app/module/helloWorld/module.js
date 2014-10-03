(
    function(){
        var moduleName='helloWorld';
        
        function render(el){
            el.addEventListener(
                'click',
                handleClicks
            );
        }
        
        function handleClicks(e){
            if(!e.target.id)
                return;
            
            switch(e.target.id){
                case 'findCheech' :
                    app.navigate('davesNotHereMan');
                    break;
            }
        }
        
        exports(moduleName,render);    
    }
)();