var pdf = require('html-pdf');

module.exports = {
    Pdf: function(htmlData, config, res) {
        pdf.create(htmlData, config).toStream((err, pdfStream) => {
            if (err) {
                // handle error and return a error response code
                console.log(err)
                return res.sendStatus(500)
            } else {
                // send a status code of 200 OK
                res.statusCode = 200

                // once we are done reading end the response
                pdfStream.on('end', () => {
                    // done reading
                    return res.end()
                })

                // pipe the contents of the PDF directly to the response
                pdfStream.pipe(res)
            }
        })
    }
}
