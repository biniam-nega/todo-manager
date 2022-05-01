/**
 * Author: Biniam Nega aka BEN
 */

var my_lib = new Object();
my_lib.inherit = new Object;

// A method to watch the DOM until it's ready
my_lib.domReady = function (f) {
    my_lib.domReady.func = f;
    if (!my_lib.domReady.interval) {
        my_lib.domReady.interval = setInterval(my_lib.domReady.isDomReady, 13);
    }
}

my_lib.domReady.isDomReady = function () {
    if (document && document.body && document.getElementsByTagName && document.getElementById) {
        my_lib.domReady.func();
        clearInterval(my_lib.domReady.interval);
        my_lib.domReady.interval = null;
    }
}


my_lib.checkType = function (types, args) {
    if (types.length != args.length) {
        throw 'Invalid number of arguments. Expected ' + types.length + ', recieved ' + args.length + ' instead.';
    }
    for (var i = 0; i < types.length; i++) {
        if (args[i].constructor != types[i]) {
            throw 'Invalid argument type. Expected ' + types[i].name + ', received ' + args[i].constructor.name + ' instead.';
        }
    }
}

my_lib.numGenerator = function (start, end, step) {
    var start = start;
    var end = end;
    var step = step;
    return function () {
        if (start >= end) {
            throw 'The value of start exeeded the value of end';
        }
        var holder = start;
        start += step;
        return holder;
    }
}

my_lib.augmentArray = function () {
    // This adds deletion of one element by index capability
    Array.prototype.remove = function (index) {
        return this.slice(0, index).concat(this.slice((index + 1), this.length));
    }
    
    // This helps find a needle in a haystack
    if (Array.prototype.inArray !== 'function') {
        Array.prototype.inArray = function (needle) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] == needle) {
                    return true;
                }
            }
            return false;
        }
    }

        
    // This method randomly shuffles the elements of an array
    if (Array.prototype.shuffle !== 'function') {
        Array.prototype.shuffle = function () {
            var arr = this;
            var to_return = [];
            while (arr.length != 0) {
                var rand = parseInt(Math.random() * (arr.length - 1));
                to_return.push(arr[rand]);
                arr = arr.remove(rand);
            }
            return to_return;
        }
    }

    // This method returns true if an object is an array, otherwise false
    if (Array.prototype.isArray !== 'function') {
        Array.prototype.isArray = function (candidate) {
            return Object.prototype.toString.call(candidate) === '[object Array]';
        }
    }
}

// This method adds some functionalities to String objects
my_lib.augmentString = function () {
    if (String.prototype.reverse !== 'function') {
        String.prototype.reverse = function () {
            return Array.prototype.reverse.apply(this.split('')).join('');
        }
    }
}


my_lib.inherit = {
    /**
     * Pseudo classical inheritance pattern
     */
    // This method makes child's prototype inherit all the properties of the parent's prototype
    extend: function (child, parent) {
        var F = function () { };
        F.prototype = parent.prototype;
        child.prototype = new F();
        child.prototype.constructor = child;
        child.uber = parent;
    },
    // This method copies all the properties of the parent's prototype into the child's prototype
    extend2: function (child, parent) {
        var c = child.prototype;
        var p = parent.prototype;
        for (var prop in p) {
            c[prop] = p[prop];
        }
        c.uber = p;
    },

    // This method copies all the properties of the parent object into a variable and returns that variable
    extendCopy: function (parent, own) {
        var c = {};
        for (var prop in parent) {
            c[prop] = parent[prop];
        }
        for (var ownProp in own) {
            c[ownProp] = own[ownProp];
        }
        c.uber = parent;
        return c;
    },

    // This method copies all the properties of the parent object into a variable and returns that variable but unlike
    // extendCopy, when the property to be copied is an object, it calls deepCopy recursively until a primitive type is encoutered
    deepCopy: function (parent, child) {
        child = child || {};
        for (var prop in parent) {
            if (parent.hasOwnProperty(prop)) {
                if (typeof parent[prop] == 'object') {
                    child[prop] = Array.isArray(parent[prop]) ? [] : {};
                    this.deepCopy(parent[prop], child[prop]);
                }
                else {
                    child[prop] = parent[prop];
                }
            }
        }
        return child;
    },

    object: function (o) {
        function F() { }
        F.prototype = o;
        n = new F();
        n.uber = o;
        return n;
    },

    // This method accepts multiple parent objects or constructor functions as well as an object's own properties and 
    //returns an object with all the parents' prototype properties and it's own properties
    objectMulti: function () {
        var child = new Object();
        for (var i = 0; i < arguments.length - 1; i++) {
            for (var prop in arguments[i].prototype) {
                child.prototype[prop] = arguments[i].prototype[prop];
            }
        }
        for (prop in arguments[arguments.length - 1]) {
            child[prop] = arguments[arguments.length - 1][prop];
        }
        return child;
    }
}

/*
Attaching a set of helper functions to every HTML element that hepls in manipulation of the DOM
*/
my_lib.dom = {
    cleanWhiteSpace: function (element) {
        var element = element || document;
        var cur = element.firstChild;

        while (cur != null) {
            if (cur.nodeType == 3 && ! /\S/.test(cur.nodeValue)) {
                element.removeChild(cur);
            }
            else if (cur.nodeType == 1) {
                my_lib.cleanWhiteSpace(cur);
            }
            cur = cur.nextSibling;
        }
    },

    // This method reduces the verbose way of accessing an element by ID
    id: function (name) {
        return document.getElementById(name);
    },

    // This method reduces the verbose way of accessing an element by tagname
    tag: function (name, elem) {
        return (elem || document).getElementsByTagName(name);
    },

    // Returns all elements of type that have a particular class name
    hasClass: function (name, type) {
        var r = [];
        var re = new RegExp('(^|\\s)' + name + '(\\s|$)');
        var e = document.getElementsByTagName(type || '*');
        for (var i = 0; i < e.length; i++) {
            if (re.test(e[i].className)) {
                r.push(e[i]);
            }
        }
        return r;
    },

    hasAttribute: function (elem, attr) {
        return elem.getAttribute(attr) != null;
    },

    // Sets the attribute or just returns the value of the attribute depending on the number of arguments
    attr: function (elem, name, value) {
        if (!name || name.constructor != String) {
            return '';
        }
        name = { 'for': 'htmlFor', 'name': 'className' }[name] || name;
        if (typeof value != 'undefined') {
            elem[name] = value;
        }
        return elem[name];
    },

    create: function (elem, attr) {
        var e = document.createElement(elem);
        for (a in attr) {
            e[a] = attr[a];
        }
        return e;
    },

    before: function (before, elem) {
        var parent = HTMLElement.prototype.parent.apply(before);
        parent.insertBefore(my_lib.dom.helper.checkElem(elem), before);
    },

    append: function (parent, elem) {
        parent.appendChild(my_lib.dom.helper.checkElem(elem));
    },

    remove: function (elem) {
        elem.parentNode.removeChild(elem);
    },

    empty: function (elem) {
        while (elem.firstChild) {
            my_lib.dom.remove(elem.firstChild);
        }
    },

    insertHTML: function (elem, html, append, before) {
        console.log('here')
        if (append) {
            if (before) {
                elem.innerHTML = html + elem.innerHTML;
            }
            else {
                elem.innerHTML += html;
            }
        }
        else {
            elem.innerHTML = html;
        }
    },

    querySelector: function (query) {
        // id selector
        if (/^#[\w]+$/.test(query)) {
            var result = /^#([\w]+)/.exec(query);
            return document.getElementById(result[1]);
        }
        // class selector
        else if (/^.[\w]+$/.test(query)) {
            var result = /^.([\w]+)/.exec(query);
            return my_lib.dom.hasClass(result[1]);
        }
        // Attribute selector
        else if (/^[\w]*\[[\w]+=(["'])[\w]+\1\]$/.test(query)) {
            var ret = [];
            var result = /([\w]*)\[([\w]+)=["']([\w]+)["']\]/.exec(query);
            var elems = document.getElementsByTagName(result[1] ? result[1] : '*');
            for (elem in elems) {
                if (elems[elem].nodeType && elems[elem].nodeType == 1) {
                    if (elems[elem].getAttribute(result[2]) == result[3]) {
                        ret.push(elems[elem]);
                    }
                }
            }
            return ret;
        }
        // Attribute selector with regex
        else if (/^[\w]*\[[\w]+[\^$*]=(["'])[\w]+\1\]$/.test(query)) {
            var ret = [];
            var result = /([\w]*)\[([\w]+)([\^$*])=["']([\w]+)["']\]/.exec(query);
            var elems = document.getElementsByTagName(result[1] ? result[1] : '*');
            switch (result[3]) {
                case '$':
                    exp = RegExp(result[4] + result[3]);
                    break;
                case '^':
                    exp = RegExp(result[3] + result[4]);
                    break;
                default:
                    exp = RegExp(result[4]);
            }
            for (elem in elems) {
                if (elems[elem].nodeType && elems[elem].nodeType == 1) {
                    if (exp.test(elems[elem].getAttribute(result[2]))) {
                        ret.push(elems[elem]);
                    }
                }

            }
            return ret;
        }
    },

    bind: function () {
        // Returns the next sibling element of an element
        HTMLElement.prototype.next = function () {
            elem = this.nextSibling;
            while (elem && elem.nodeType != 1) {
                elem = elem.nextSibling;
            }
            return elem;
        };
        // Returns the previous sibling element of an element
        HTMLElement.prototype.previous = function () {
            elem = this.previousSibling;
            while (elem && elem.nodeType != 1) {
                elem = elem.previousSibling;
            }
            return elem;
        };

        // Returns the first child element of an element
        HTMLElement.prototype.first = function () {
            elem = this.firstChild;
            while (elem && elem.nodeType != 1) {
                elem = HTMLElement.prototype.next.apply(elem);
            }
            return elem;
        };

        // Returns the last child element of an element
        HTMLElement.prototype.last = function () {
            elem = this.lastChild;
            while (elem && elem.nodeType != 1) {
                elem = HTMLElement.prototype.previous.apply(elem);
            }
            return elem;
        };

        // Returns the parent element of an element upto num times up the heirarchy
        HTMLElement.prototype.parent = function (num) {
            num = num || 1;
            elem = this;
            for (var i = 0; i < num; i++) {
                if (elem == null) {
                    break;
                }
                elem = elem.parentNode;
            }
            return elem;
        }

        // Returns the text node of an element
        HTMLElement.prototype.text = function () {
            var e = this.childNodes;
            var t = '';
            if (e) {
                for (var i = 0; i < e.length; i++) {
                    if (e[i].nodeType === 3) {
                        t += e[i].nodeValue;
                    }
                }
            }
            return t;
        }
    },

    helper: {
        checkElem: function (elem) {
            return elem && elem.constructor == String ? document.createTextNode(elem) : elem;
        }
    }
}

my_lib.events = {
    // This method stops event bubbling
    stopBubble: function (e) {
        if (e) {
            e.stopPropagation();
        }
        else {
            document.event.cancelBubble = true;
        }
    },
    // This method stops the default action of certain elements assigned by the browser
    stopDefault: function (e) {
        if (e) {
            e.preventDefault();
            console.log(e);
        }
        else {
            document.event.returnValue = false;
        }
    },

    addEvent: function (element, type, handler) {
        element.addEventListener(type, handler);
    },

    removeEvent: function (element, type, handler) {
        element.removeEventListener(type, handler);
    }
}

my_lib.css = {
    getStyle: function (elem, name) {
        if (elem.style[name]) {
            return elem.style[name];
        }

        else {
            name = name.replace(/([A-Z])/g, "-$1");
            name = name.toLowerCase();
            var s = document.defaultView.getComputedStyle(elem, '');
            return s.getPropertyValue(name);
        }
    },
}
