'use strict';

requires.js('Template','XHR2');

function HTMLTemplates(){
    Object.defineProperty(
        this,
        '_template',
        {
            value:new Template()
        }
    );

    Object.defineProperties(
        this,
        {
            find:{
                value:findTemplates,
                enumerable:true
            },
            getString:{
                value:this._template.fill,
                enumerable:true
            },
            getHTML:{
                value:fillAsHTML,
                enumerable:true
            },
            createFromHTML:{
                value:createTemplateHTML,
                enumerable:true
            },
            createFromString:{
                value:createTemplateString,
                enumerable:true
            },
            fetch:{
                value:getExternal,
                enumerable:true
            },
            data:{
                value:{},
                enumerable:true,
                writable:true
            }
        }
    );

    function fillAsHTML(template, data){

        //TODO: flesh out this fill and return HTML
        var content=this._template.fill(template, data);
    }

    function getExternal(templateID,type,callback){

        //TODO: finish implementing fetching templates
        if(!type){
            type='GET';
        }
        var templateData=new XHR2(requires._config.path+'RIA/templates/'+templateID+'.js',type);
        templateData.on(
            'load',
            function(response){
                //TODO: use template data
            }
        );
        templateData.on(
            'error',
            function(response){
                //TODO: handle network error
            }
        );
        //templateData.fetch();
    }

    function createTemplateString(string,templateID){
        var template,
            src;
        if(!string){
            return false;
        }

        template=document.createElement('template');
        template.id=templateID+'-template';
        template.innerHTML=string;

        this.data.templateID=string;

        return template;
    }

    function createTemplateHTML(selector,templateID){
        var template,
            src;
        if(!selector){
            return false;
        }

        src=document.querySelector(selector);
        if(!src){
            return false;
        }

        template=document.createElement('template');
        template.id=templateID+'-template';
        template.appendChild(src);

        this.data.templateID=template.innerHTML;

        return template;
    }

    function findTemplates(selector){
        var templates;
        if(!selector){
            selector='body';
        }
        selector+=' template';

        templates=document.querySelectorAll(selector);

        console.log(selector,templates);

        if(!templates){
            return false;
        }

        for(var i=0; i<templates.length; i++){
            var template=templates[i];
            this.data[template.id.replace('-template','')]=template.innerHTML;
        }

        return this.data;
    }
}
