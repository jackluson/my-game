/*
 * @Author: Jack Lu 
 * @Date: 2018-01-26 19:52:36 
 * @Last Modified by: Jack Lu
 * @Last Modified time: 2018-01-26 20:28:59
 */
;
(function (window) {
    var util = {
        getRandom: function (min, max) {
            return Math.floor(min + Math.random() * (max - min));

        },
        getColor: function (min, max) {
            return "rgb(" + this.getRandom(min, max) + ","+ this.getRandom(min, max) + "," + this.getRandom(min, max) +")";
        }
    }
    window.Util = util;

})(window);
// console.log(Util.getColor(0, 255));

