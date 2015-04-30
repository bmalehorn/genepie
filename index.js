var chief = null;
var gedd = null;

var openFile = function openFile(event) {
    var input = event.target;

    var reader = new FileReader();
    reader.onload = function(){
        var s = reader.result;
        gedded = parseGed(s);
        chief = gedded[1];
        // console.log(s);
    };
    reader.readAsText(input.files[0]);
};


var parseGed = function ParseGed(s) {
    var lines = s.trim().split("\n");
    var objs = lines.map(function(line) {
        var words = line.trim().split(/\s/);
        var n = +words[0];
        var type = words[1];
        var rest = _.slice(words, 2).join(" ");
        return {
            n: n,
            type: type,
            rest: rest
        };
    });

    var i = 0;
    var f = function f() {
        var obj = objs[i];
        i++;
        var children = [];
        while (i < objs.length && obj.n < objs[i].n) {
            children.push(f());
        };
        return {
            type: obj.type,
            rest: obj.rest,
            sub: children
        };
    };
    var gedded = [];
    while (i < objs.length) {
        gedded.push(f());
    }

    return gedded;


    // these are the two functions I want to get out of this.

    var parents = function parents(indi) {
        return {
            father: null,
            mother: null
        };
    };

    var origin = function origin(indi) {
        // base case: Europe.
        // inductive case: USA.
        return {
            Germany: 0.1,
            Britain: 0.3,
            Irish: 0.2,
        };
        // the rest of the sum in unknown.
    };

};
