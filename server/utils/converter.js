const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

function convertFile(inputPath, outputFormat) {
    return new Promise((resolve, reject) => {
        const outputDir = path.dirname(inputPath);
        const sofficePath = '"C:\\Program Files\\LibreOffice\\program\\soffice.exe"';

        // Construct command
        // --headless: no GUI
        // --convert-to <format>: target format
        // --outdir <dir>: output directory

        let inFilter = '';
        const ext = path.extname(inputPath).toLowerCase();

        if (ext === '.pdf') {
            if (outputFormat === 'docx') {
                inFilter = ' --infilter="writer_pdf_import"';
            } else if (outputFormat === 'pptx') {
                inFilter = ' --infilter="impress_pdf_import"';
            }
        }

        const command = `${sofficePath} --headless${inFilter} --convert-to ${outputFormat} --outdir "${outputDir}" "${inputPath}"`;

        console.log('Executing conversion:', command);

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error('Conversion error:', error);
                return reject(error);
            }

            // LibreOffice might output warnings to stderr, so we don't reject on stderr presence alone.
            // We check if the output file exists.

            const ext = path.extname(inputPath);
            const basename = path.basename(inputPath, ext);
            const outputPath = path.join(outputDir, `${basename}.${outputFormat}`);

            if (fs.existsSync(outputPath)) {
                resolve(outputPath);
            } else {
                reject(new Error('Output file not found after conversion'));
            }
        });
    });
}

module.exports = { convertFile };
