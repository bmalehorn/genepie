var chief = null;
var root = null;

/*
 {"type":"@P1@",
  "rest":"INDI",
  "children":
  [
  {"type":"NAME","rest":"Donald Moody /Malehorn/","children":[]},
  {"type":"BIRT","rest":"","children":[{"type":"DATE","rest":"18 Nov 1930","children":[]}]},
  {"type":"SEX","rest":"M","children":[]},
  {"type":"FAMC","rest":"@F2@","children":[]},
  {"type":"FAMS","rest":"@F1@","children":[]}
  ]}

  gedded["@P1@"][0] = chief
  gedded["@P1@"][0].value == "INDI"
  gedded["@P1@"][0]["NAME"][0].value == "Donald Moody /Malehorn/"
  */


var openFile = function openFile(event) {
    var input = event.target;

    var reader = new FileReader();
    reader.onload = function() {
        var s = reader.result;
        root = parseGed(s);
        chief = root["@P1@"][0];
        console.log(parents("@P1@"));
        console.log(origin("@P1@"));
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
    function f() {
        var obj = objs[i];
        i++;
        var children = [];
        while (i < objs.length && obj.n < objs[i].n) {
            children.push(f());
        }
        return {
            type: obj.type,
            rest: obj.rest,
            children: children
        };
    }
    var gedded = [];
    while (i < objs.length) {
        gedded.push(f());
    }

    gedRoot = {
        type: "ROOT",
        rest: "",
        children: gedded
    };
    var root = toLookup(gedRoot);

    return root;



};

function toLookup(obj) {
    var lookup = {};
    lookup.value = obj.rest;
    lookup.type = obj.type;
    obj.children.map(toLookup).forEach(function(child) {
        if (child.type == "value" || child.type == "type") {
            throw "reserved key: \"" + child.type + "\" in "
            + JSON.stringify(obj);
        }
        if (!(child.type in lookup)) {
            lookup[child.type] = [];
        }
        lookup[child.type].push(child);
        delete child.type;
    });
    return lookup;
}

function parents(indi) {
    for (id in root) {
        if (_.startsWith(id, "@F")) {
            if (_.includes(_.pluck(root[id][0].CHIL, "value"), indi)) {
                return {
                    father: (root[id][0].HUSB || {
                            0: {}
                        })[0].value || null,
                    mother: (root[id][0].WIFE || {
                            0: {}
                        })[0].value || null
                };
            }
        }
    }
    return {
        father: null,
        mother: null
    };
}

/*
  country("Dover, York, Pennsylvania, United States") => "American"
  country("Neckargemünd, Rhein-Neckar-Kreis, Baden-Wuerttemberg, Germany")
    => "German"
  */

var countries = {
    "Netherlands": "Dutch",
    "Germany": "German",
    "England": "British",
    "Whales": "British",
    "United States": "American",
    "USA": "American",
    "Switzerland": "Swiss"
};

var states = {
    "AL": "Alabama",
    "Alabama": "Alabama",
    "AK": "Alaska",
    "Alaska": "Alaska",
    "AZ": "Arizona",
    "Arizona": "Arizona",
    "AR": "Arkansas",
    "Arkansas": "Arkansas",
    "CA": "California",
    "California": "California",
    "CO": "Colorado",
    "Colorado": "Colorado",
    "CT": "Connecticut",
    "Connecticut": "Connecticut",
    "DE": "Delaware",
    "Delaware": "Delaware",
    "DC": "District of Columbia",
    "District of Columbia": "District of Columbia",
    "FL": "Florida",
    "Florida": "Florida",
    "GA": "Georgia",
    "Georgia": "Georgia",
    "HI": "Hawaii",
    "Hawaii": "Hawaii",
    "ID": "Idaho",
    "Idaho": "Idaho",
    "IL": "Illinois",
    "Illinois": "Illinois",
    "IN": "Indiana",
    "Indiana": "Indiana",
    "IA": "Iowa",
    "Iowa": "Iowa",
    "KS": "Kansas",
    "Kansas": "Kansas",
    "KY": "Kentucky",
    "Kentucky": "Kentucky",
    "LA": "Louisiana",
    "Louisiana": "Louisiana",
    "ME": "Maine",
    "Maine": "Maine",
    "MD": "Maryland",
    "Maryland": "Maryland",
    "MA": "Massachusetts",
    "Massachusetts": "Massachusetts",
    "MI": "Michigan",
    "Michigan": "Michigan",
    "MN": "Minnesota",
    "Minnesota": "Minnesota",
    "MS": "Mississippi",
    "Mississippi": "Mississippi",
    "MO": "Missouri",
    "Missouri": "Missouri",
    "MT": "Montana",
    "Montana": "Montana",
    "NE": "Nebraska",
    "Nebraska": "Nebraska",
    "NV": "Nevada",
    "Nevada": "Nevada",
    "NH": "New Hampshire",
    "New Hampshire": "New Hampshire",
    "NJ": "New Jersey",
    "New Jersey": "New Jersey",
    "NM": "New Mexico",
    "New Mexico": "New Mexico",
    "NY": "New York",
    "New York": "New York",
    "NC": "North Carolina",
    "North Carolina": "North Carolina",
    "ND": "North Dakota",
    "North Dakota": "North Dakota",
    "OH": "Ohio",
    "Ohio": "Ohio",
    "OK": "Oklahoma",
    "Oklahoma": "Oklahoma",
    "OR": "Oregon",
    "Oregon": "Oregon",
    "PA": "Pennsylvania",
    "Pa.": "Pennsylvania",
    "Penna": "Pennsylvania",
    "Pennsylvania": "Pennsylvania",
    "RI": "Rhode Island",
    "Rhode Island": "Rhode Island",
    "SC": "South Carolina",
    "South Carolina": "South Carolina",
    "SD": "South Dakota",
    "South Dakota": "South Dakota",
    "TN": "Tennessee",
    "Tennessee": "Tennessee",
    "TX": "Texas",
    "Texas": "Texas",
    "UT": "Utah",
    "Utah": "Utah",
    "VT": "Vermont",
    "Vermont": "Vermont",
    "VG": "Virginia",
    "Virginia": "Virginia",
    "WA": "Washington",
    "Washington": "Washington",
    "WV": "West Virginia",
    "West Virginia": "West Virginia",
    "WI": "Wisconsin",
    "Wisconsin": "Wisconsin",
    "WY": "Wyoming",
    "Wyoming": "Wyoming"
};

function originStr(place) {
    for (k in states) {
        if (_.includes(place, k)) {
            return states[k];
        }
    }
    for (k in countries) {
        if (_.includes(place, k)) {
            return countries[k];
        }
    }
    return "unknown";
}

function indiOrigin(indi) {
    console.log(root[indi][0].NAME[0].value);
    obj = {};
    if (root[indi][0].BIRT && root[indi][0].BIRT[0].PLAC) {
        obj[originStr(root[indi][0].BIRT[0].PLAC[0].value)] = 1.0;
    } else if (root[indi][0].DEAT && root[indi][0].DEAT[0].PLAC) {
        obj[originStr(root[indi][0].DEAT[0].PLAC[0].value)] = 1.0;
    } else {
        obj["unknown"] = 1.0;
    }
    return obj;
}

function origin(indi) {
    var p = parents(indi);
    var fatherOrigin;
    var motherOrigin;
    if (p.father !== null) {
        fatherOrigin = origin(p.father);
    }
    if (p.father === null || fatherOrigin["unknown"] === 1) {
        // found father, but don't know where he's from?
        // replace with your origin.
        fatherOrigin = indiOrigin(indi);
    }
    if (p.mother !== null) {
        motherOrigin = origin(p.mother);
    }
    if (p.mother === null || motherOrigin["unknown"] === 1) {
        motherOrigin = indiOrigin(indi);
    }
    var or = {};
    for (k in fatherOrigin) {
        if (!(k in or)) {
            or[k] = 0.0;
        }
        or[k] += fatherOrigin[k] / 2.0;
    }
    for (k in motherOrigin) {
        if (!(k in or)) {
            or[k] = 0.0;
        }
        or[k] += motherOrigin[k] / 2.0;
    }
    return or;
}
