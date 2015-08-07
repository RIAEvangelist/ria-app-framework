function XHR2(url, type, responseType, timeout){
    Object.defineProperties(
        this,
        {
            on:{
                value:bindEvent,
                enumerable:true
            },
            fetch:{
                value:fetch,
                enumerable:true
            }
        }
    );

    if(!url || typeof url !== 'string'){
        throw('XHR2 class requires url as first paramater')
    }

    if(typeof responseType=='number'){
        timeout=responseType;
        responseType=null;
    }

    if(typeof type == 'number'){
        timeout=type;
        type=null;
    }

    if(!type){
        type='GET';
    }

    if(!responseType){
        responseType='json';
    }

    this.xhr = new XMLHttpRequest();
    this.xhr.open(type, url, true);
    this.xhr.responseType = responseType;

    function fetch(){
        this.xhr.send();
    }

    function bindEvent(type,callback){
        this.xhr.addEventListener(type,callback);
    }
}
