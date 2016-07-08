
/* Highlight */
$( document ).ready(function() {
    hljs.initHighlightingOnLoad();
    $('table').addClass('table table-striped table-hover');
});


$('body').scrollspy({
    target: '.bs-sidebar',
});


/* Prevent disabled links from causing a page reload */
$("li.disabled a").click(function() {
    event.preventDefault();
});

$(".btn-show-all").click(function(){
    $(".bs-sidenav.hide, h4.hide").removeClass("hide");
});

$(".btn-show-all-posts").click(function(){
    $("body").addClass("show-all-posts");
});