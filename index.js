var openFile = function openFile(event) {
    var input = event.target;

    var reader = new FileReader();
    reader.onload = function(){
        var s = reader.result;
        console.log(s);
    };
    reader.readAsText(input.files[0]);
};


var parseGed = function ParseGed(s) {
    var lines = s.trim().split("\n");
    var objs = _.map(lines, function(line) {
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
            children: children
        };
    };
    var topLevelChildren = [];
    while (i < objs.length) {
        topLevelChildren.push(f());
    }
    debugger;
};

parseGed(ged);
