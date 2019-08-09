const Table = require('cli-table');
module.exports = function displayMessage(message) {
    var table = new Table({
        chars: {
            top: '═',
            'top-left': '╔',
            'top-right': '╗',
            bottom: '═',
            'bottom-left': '╚',
            'bottom-right': '╝',
            left: '║',
            right: '║'
        },
        head: [message],
        colWidths: [ 72 ],
        colAligns: [ 'middle' ]
    });
    console.log(table.toString());
    
}