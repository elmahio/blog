var indexJson = [];
var latestPosts;
$(document).ready(function(){
    
    console.log("dfdsfs");
    $.getJSON('/mkdocs/search_index.json',function(data){
        var docs = data.docs.filter(function(a){
            return a.location.indexOf('#') === -1;
        })
        indexJson = docs;
        latestPosts = $('#latestPosts');
        showDocs();
    });
});
var showDocs = function(searchstring){
    latestPosts.html('');
    var postsResultLength = 0;
    var docs = indexJson.forEach(function(a){
        if (postsResultLength < 5){
            var text = a.text;
            text = text.replace(a.title, '');
            if (text.indexOf('2015')){
                text = extractDateInfo(text, '2015');
            }else if (text.indexOf('2016')){
                text = extractDateInfo(text, '2016');
            }else if (text.indexOf('2017')){
                text = extractDateInfo(text, '2017');
            }
            latestPosts.append('<h3><a href="'+a.location+'">'+a.title.replace(searchstring,'<strong>'+searchstring+'</strong>')+'</a></h3>');
            latestPosts.append('<em>'+text.date+'</em>');
            latestPosts.append('<div>'+text.body+' ...</div>');
            console.log(a.text);
            postsResultLength++
        }
    });
}

var extractDateInfo = function(text, year){
    var dateText = text.substr(0, text.indexOf(year) + 4);
    var bodyText = text.substr(text.indexOf(year) + 4, 400);
    
    return {
        date: dateText,
        body: bodyText
    }
}