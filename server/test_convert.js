const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const inputPath = path.join(__dirname, 'test.txt');
const outputDir = __dirname;
const sofficePath = '"C:\\Program Files\\LibreOffice\\program\\soffice.exe"';

// Ensure input file exists
if (!fs.existsSync(inputPath)) {
    fs.writeFileSync(inputPath, 'Hello World');
}

const command = `${sofficePath} --headless --convert-to pdf --outdir "${outputDir}" "${inputPath}"`;

console.log('Running command:', command);

exec(command, (error, stdout, stderr) => {
    if (error) {
        console.error('Error:', error);
        return;
    }
    if (stderr) {
        console.error('Stderr:', stderr);
    }
    console.log('Stdout:', stdout);
    console.log('Done.');
});
