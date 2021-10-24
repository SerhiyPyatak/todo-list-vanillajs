// This source code was taken from Blaize Stewart's article
// "How to Implement the Observer Pattern with Objects and Arrays in Pure JavaScript"
// https://www.wintellect.com/how-to-implement-the-observer-pattern-with-objects-and-arrays-in-pure-javascript/

/* ================= Observing Object ============================ */
// see example on https://jsfiddle.net/70taq5bh/
function Observer(o, property){
    var _this = this;
    var value = o[property];
    this.observers = [];
    
    this.Observe = function (notifyCallback){
        _this.observers.push(notifyCallback);
    }

    Object.defineProperty(o, property, {
        set: function(val){
            _this.value = val;
            for(var i = 0; i < _this.observers.length; i++) _this.observers[i](val);
        },
        get: function(){
            return _this.value;
        }
    });
}


/* ================= Observing Array ================================ */
// see example on https://jsfiddle.net/605k7bfL/
function ArrayObserver(a){
    var _this = this;
    this.array = a;   
    this.observers = [];

    this.Observe = function (notifyCallback){
        _this.observers.push(notifyCallback);
    }    

    a.push = function(obj){
        var push = Array.prototype.push.apply(a, arguments);        
        for(var i = 0; i < _this.observers.length; i++) _this.observers[i](obj, "push");
        return push;
    }

    a.pop = function(){
        var popped = Array.prototype.pop.apply(a, arguments);        
        for(var i = 0; i < _this.observers.length; i++) _this.observers[i](popped, "pop");
        return popped;
    }

    a.reverse = function() {
        var result = Array.prototype.reverse.apply(a, arguments);
        for(var i = 0; i < _this.observers.length; i++) _this.observers[i](result, "reverse");
        return result;
    };

    a.shift = function() {
        var deleted_item = Array.prototype.shift.apply(a, arguments);
        for(var i = 0; i < _this.observers.length; i++) _this.observers[i](deleted_item, "shift");
        return deleted_item;                        
    };

    a.sort = function() {
        var result = Array.prototype.sort.apply(a, arguments);
        for(var i = 0; i < _this.observers.length; i++) _this.observers[i](result, "sort");
        return result;
    };

    a.splice = function(i, length, itemsToInsert) {
        var returnObj
        if(itemsToInsert){
            Array.prototype.slice.call(arguments, 2);
            returnObj = itemsToInsert;
        }
        else{
            returnObj = Array.prototype.splice.apply(a, arguments);
        }
        for(var i = 0; i < _this.observers.length; i++) _this.observers[i](returnObj, "splice");
        return returnObj;
    };

    a.unshift = function() {
        var new_length = Array.prototype.unshift.apply(a, arguments);
        for(var i = 0; i < _this.observers.length; i++) _this.observers[i](new_length, "unshift");
        return arguments;
    };
                
};
