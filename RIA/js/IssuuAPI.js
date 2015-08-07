'use strict';

requires.js('XHR2','Template');

function IssuuAPI(user){
    Object.defineProperties(
        this,
        {
            getInfo: {
                value:fetchInfo,
                enumerable:true
            },
            getIssues:{
                value:fetchIssues,
                enumerable:true
            },
            getPage:{
                value:fetchPage,
                enumerable:true
            },
            _infoURL:{
                value: 'http://api.issuu.com/query?profileUsername='+user+'&format=json&action=issuu.user.get_anonymous'
            },
            _issuesURL:{
                value: 'http://api.issuu.com/call/stream/api/profile/2/0/initial?ownerUsername='+user+'&seed=0&action=&format=json&pageSize=${count}'
            },
            _thumbURL:{
                value: 'http://image.issuu.com/${revision}-${issue}/jpg/page_${page}_thumb_${size}.jpg'
            },
            _pageURL:{
                value: 'http://image.issuu.com/${revision}-${issue}/jpg/page_${page}.jpg'
            },
            _URL:{
                value:new Template()
            }
        }
    );

    function fetchInfo(callback){
        console.log(this._infoURL);
        var info=new XHR2(this._infoURL);
        info.on(
            'load',
            callback
        );

        info.fetch();
    }

    function fetchIssues(count,callback){
        var data={
            count:count
        };

        var issues=new XHR2(
            this._URL.fill(this._issuesURL,data)
        );
        issues.on(
            'load',
            callback
        );

        issues.fetch();
    }

    function fetchPage(issueID,revisionID,page,callback,size){
        var data={
            issue:issueID,
            revision:revisionID,
            page:page,
            size:size
        };

        var page;

        if(!size){
            page=new XHR2(
                this._URL.fill(this._pageURL,data),
                'GET',
                'blob',
                'small'
            );
        }else{
            page=new XHR2(
                this._URL.fill(this._thumbURL,data),
                'GET',
                'blob'
            );
        }

        page.issue=issueID;
        page.revision=revisionID;

        page.on(
            'load',
            function(e){
                var blob = e.target.response;
                this.image=window.URL.createObjectURL(blob);
                callback(this);
            }.bind(data)
        );
        page.fetch();
    }
}
