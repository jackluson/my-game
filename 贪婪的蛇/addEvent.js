//    事件源.addEventListener();       IE9以下不支持
//    事件源.attachEvent();      Chrome和firefox不支持
function myEventListener(element, type, callback) {
    if (element.addEventListener) {
        element.addEventListener(type, callback);
    } else if (element.attachEvent) {
        element.attachEvent("on" + type, callback);
    }else {
        element["on" + type] = callback
    }
    
}


