(function($){
    browserCheck = {
        isIE : document.all && document.compatMode,
        isIE8: document.all && !document.addEventListener,
        isIE9: document.all && !window.atob,
        isIE10: /*@cc_on!@*/false,

        isFF : 'MozAppearance' in document.documentElement.style
    } 
})(jQuery);