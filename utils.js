var utils={
	addListener:null,
	removeListener:null
};
if (typeof window.addEventListener === 'function') {
	utils.addListener = function  (el, type, fn) {
		el.addEventListener (type, fn ,false);
	};
	utils.removeListener =function (el, type, fn) {
		el.removeEventListener(type, fn, false);
	};
}else if (typeof document.attachEvent === 'function'){
	utils.addListener = function  (el, type, fn) {
		el.attachEvent (type, fn ,false);
	};
	utils.removeListener =function (el, type, fn) {
		el.detachEvent(type, fn, false);
	};
}else {
	utils.addListener = function  (el, type, fn) {
		el['on' + type]=fn;
	};
	utils.removeListener =function (el, type, fn) {
		el['on' + type]=null;
	};
}

/**
 * implement suger method (js pattern p.116)
 */
if(typeof Function.prototype.method !== 'function'){
	Function.prototype.method = function (name, implementation){
		this.prototype[name] = implementation;
		return this;
	};
}
/**
 * inherit

var inherit = function (C, P) {
	var F = function ();
	return {
		F.prototype = P.prototype;
		C.prototype = new F();
		C.uber = P.prototype;
		C.prototype.constructor = C;
	};	
}());
 */
/**
 * extends
 */
function extend(P, C) {
	var i,
		toStr = Object.prototype.toString;
		astr = '[object Array]';

	C= C || {};
	for (i in P) {
		if (P.hasOwnProperty(i)) {
			if (typeof P[i] === 'object') {
				C[i] = (toStr.call(P[i]) === astr) ? [] : {};
				extend(P[i], C[i]);
			} else {
				C[i] = P[i];
			}
		}
	}
	return C;
}
/**
 * [bytesToSize description] bytes transfer
 * @param  {[type]} bytes [description]
 * @param  {[type]} data  [description]
 * @return {[type]}       [description]
 */
function bytesToSize(bytes,data) {

   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
   var i = sizes.indexOf(data);
   //console.log(bytes);
   if (bytes == 0) return '0 Bytes';
   //var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
   return Math.round(bytes / Math.pow(1024, i), 2) ;
};
/**
 * [isRealNaN description] is real NaN(not a number)
 * @param  {[type]}  value [description]
 * @return {Boolean}       [description]
 */
function isRealNaN(value) {
    return value !== value;
}
/**
 * [isRealFiniteNumber description] check is a number
 * @param  {[type]}  value [description]
 * @return {Boolean}       [description]
 */
function isRealFiniteNumber(value) {
    return typeof value === 'number' && isFinite(value);
}