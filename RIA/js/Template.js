'use strict';

function Template(){
    Object.defineProperties(
        this,
        {
            fill:{
                value:fillTemplate,
                enumerable:true
            }
        }
    );

    function fillTemplate(string,data){
        for(var i=0, keys=Object.keys(data);
           i<keys.length;
           i++
        ){
            var reg=new RegExp('\\$\\{'+keys[i]+'\\}','g');

            string=string.replace(
                reg,
                data[
                    keys[i]
                ]
            );
        }
        return string;
    }
}
