// const GET = (url) => {
//     return new Promise((resolve, reject) => {
//       const xhr = new XMLHttpRequest();
//       xhr.open('GET', url);
//       xhr.onload = () => xhr.status === 200 ? resolve(xhr.responseText) : reject(Error(xhr.status));
//       xhr.onerror = (e) => reject(Error("Network error:" + e));
//       xhr.send();
//     });
//   }

//   GET("foo.txt")
//     .then((data) => {
//         //do stuff with data, if foo.txt was successfully loaded.
//     })
//     .then((error) => {
//         //do stuff on error
//     });

//Stateless version
class XMLContainer {
    constructor(x) {
        if (typeof x === "string") {
            this.$value = new DOMParser().parseFromString(x, 'text/xml');
        }
        else {
            this.$value = x;
        }
    }

    static with(val) {
        return new XMLContainer(val);
    }

    map(f) {
        return XMLContainer.with(f(this.$value));
    }

    traverse(fn) {
        this.map(fn);
        let node = this.map((m) => m.firstChild);
        while (node.$value) {
            node.traverse(fn);
            node = node.map((m) => m.nextSibling);
        }
    };
}

const traverseDOM = (node, fn) => {
    fn(node);
    node = node.firstChild;
    while(node) {
        traverseDOM(node, fn);
        node = node.nextSibling;
    }
};

const XmlStrategy = {
    processFile: (path) => {
        //if(window.fetch) { }
        //else { do something with XMLHttpRequest?; GET(path); }
        fetch(path)
            .then((response) => {
                if(response.ok) {
                    return response.text();
                }
                throw new Error('Network response was not ok.');
            })
            .then((xmlText) => {
                let xmlDoc = new DOMParser().parseFromString(xmlText,'text/xml');

                // XMLContainer.with(xmlDoc).traverse((currentNode) => {
                //     awesome code involving currentNode
                // });

                traverseDOM(xmlDoc, (currentNode) => {
                    //awesome code involving currentNode
                });
            })
            .catch((error) => {
                console.log("Network error:" + error.message);
            });
    }
};

const JsonStrategy = {
    processFile: (path) => {
        //insert super-awesome JSON-processing implementation here
    }
}

const DefaultStrategy = {
    processFile: (path) => {
        //download(path);
        //or insert super-awesome default strategy implementation
    }
};

let Row = () => {
    this.setStrategy = (data) => {
        if (data.toLowerCase().lastIndexOf(".xml") > -1) {
            this.strategy = new XmlStrategy();
        }
        else if (data.toLowerCase().lastIndexOf(".json") > -1) {
            this.strategy = new JsonStrategy();
        }
        //else if (etc) {}
        else {
            this.strategy = new DefaultStrategy();
        }
    };

    this.prototype = {
        processFile: (path, filename) => {
            if(!this.strategy) {
                this.setStrategy(filename);
            }
            return this.strategy.processFile(path + filename);
        }
    };
};
