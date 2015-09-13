var searchJson = [];
var searchInitialized = false;
var searchResult, searchResultHeader;
var initSearchFunctionality = function(){
    if (!searchInitialized){
        $.getJSON('/mkdocs/search_index.json',function(data){
            var docs = data.docs.filter(function(a){
                return a.location.indexOf('#') === -1;
            })
            searchJson = docs;
            searchInitialized = true;
            searchResult = $('#searchResult');
            searchResultHeader = $('#searchResultHeader');
            $('#search').on('keyup', function(){
                searchDocs(this.value.toLowerCase());
            }).show().focus();
        });
    }
}
var searchDocs = function(searchstring){
    searchResult.html('');
    searchResultHeader.hide();
    var searchResultLength = 0;
    if (searchstring.trim().length > 0){
        var docs = searchJson.forEach(function(a){
            if (a.text.toLowerCase().indexOf(searchstring)>-1){
                searchResultLength++;
                searchResult.append('<li><a href="'+a.location+'">'+a.title.replace(searchstring,'<strong>'+searchstring+'</strong>')+'</a></li>');
            }
        });
        if (searchResultLength > 0){
            searchResultHeader.show();
        }
    }
}