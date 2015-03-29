var Transform = require('stream').Transform,
    util = require('util'),
    moment = require('moment');


function CSOBTxtParser() {
    if (!(this instanceof CSOBTxtParser))
        return new CSOBTxtParser();

    Transform.call(this, {objectMode: true});

}
util.inherits(CSOBTxtParser, Transform);


CSOBTxtParser.prototype._transform = function(chunk, encoding, callback) {

    var lines = chunk.toString().split('\n');

    var all = {header:'',data:[]};
    var count = 0;
    var current = {};
    var lastKeyNote = false;
    lines.forEach(function(item) {
        if (item == '\r' ) {
            if (count==1) {
                all.header = lines[0].trim();
            }
            else {
                all.data.push(current);
            }
            current = {};
        }
        else {

            var key = item.substring(19,0).trim();
            var value = item.substring(19).trim();

            if (key == 'datum zaúčtování:') {
                current['date'] = moment(value,'D.M.YYYY').format('YYYY-MM-DD');
            }
            else if (key == 'částka:') {
                current['amount'] = parseFloat(value);
            }
            else if (key == 'měna:') {
                current['currency'] = value;
            }
            else if (key == 'zůstatek:') {
                current['balance'] = parseFloat(value);
            }
            else if (key == 'konstantní symbol:') {
                current['ks'] = parseInt(value);
            }
            else if (key == 'variabilní symbol') {
                current['vs'] = value;
            }
            else if (key == 'specifický symbol:') {
                current['ss'] = value;
            }
            else if (key == 'označení operace:') {
                current['operation'] = value;
            }
            else if (key == 'název protiúčtu:') {
                current['accoutName'] = value;
            }
            else if (key == 'protiúčet:') {
                current['account'] = value;
            }
            else if (key == 'poznámka:') {
                current['note'] = value;
                lastKeyNote = true;
            }
            else if (key == '' && lastKeyNote) {
                current['note'] += ' ' + value;
            }
        }
        count++;
    });
    all.data.push(current);

    this.push(all);

    callback();
};

exports.parser = CSOBTxtParser();