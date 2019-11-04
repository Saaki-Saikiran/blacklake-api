var mu = require('mu2');
mu.root = './app/templates/'
console.log(mu.root)

module.exports = {
    apply: function(templName, templData, next) {
        var htmlData = '';
        mu.compileAndRender(templName, templData)
            .on('data', function(data) {
                //console.log(data.toString());
                htmlData += data.toString();
            })
            .on('error', function(err) {
                console.log(err);
                next('Failed to generate template.');
            })
            .on('end', function() {
                //console.log('At the end of stream------')
                //console.log(htmlData);
                next(null, htmlData);
            });
    }
    // ,
    // create: function(data, next) {
    //     Templates.create(data).exec(function(err, item) {
    //         if (err) {
    //             return next(err)
    //         } else {
    //             next(null, item.id)
    //         };
    //     })
    // }

}
