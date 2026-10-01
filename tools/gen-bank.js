const fs = require('fs');
['./gen-bank-r.js', './gen-bank-r2.js', './gen-bank-t.js', './gen-bank-t2.js', './gen-bank-pz.js', './gen-bank-vgw.js'].forEach(f => { if (fs.existsSync(__dirname + '/' + f.slice(2))) require(f); });
