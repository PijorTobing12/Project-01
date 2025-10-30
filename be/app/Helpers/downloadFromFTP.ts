const fs = require('fs');
const https = require('https');
const path = require('path');
const os = require('os');

export const downloadFromFTP = 
    async function downloadFile(file, response, tempImage) {
        const filename = file;
        // return file;
        // const filename = `https://fileserp.dbc.co.id/eReg/bupot/${file}`;
        // const tempImage = path.join(os.tmpdir(), filename);
        // const tempImage = path.join('C:','Users', '2000216', filename);
        // return tempImage;
    
        return new Promise((resolve, reject) => {
            https.get(`https://fileserp.dbc.co.id/eReg/${file}`, (response) => {
                // return 'response';
                response.pipe(fs.createWriteStream(tempImage));
                response.on('end', (tempImage) => {
                    resolve(tempImage);
                });
            });
        });
    }