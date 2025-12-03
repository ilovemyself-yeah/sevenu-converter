const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const sofficePath = '"C:\\Program Files\\LibreOffice\\program\\soffice.exe"';
const outputDir = __dirname;

// Create a dummy PDF file for testing if it doesn't exist
// actually, creating a valid PDF from scratch is hard without a lib.
// I'll try to convert the test.txt to test.pdf first, then test.pdf to docx/pptx.

function runCommand(cmd) {
    return new Promise((resolve, reject) => {
        console.log('Running:', cmd);
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                console.error('Error:', error);
                // resolve anyway to continue testing other formats
                resolve({ success: false, error });
            } else {
                console.log('Success.');
                resolve({ success: true });
            }
        });
    });
}

async function test() {
    // 1. Create test.pdf from test.txt
    const txtPath = path.join(__dirname, 'test.txt');
    if (!fs.existsSync(txtPath)) fs.writeFileSync(txtPath, 'Hello World');

    console.log('--- Creating test.pdf ---');
    await runCommand(`${sofficePath} --headless --convert-to pdf --outdir "${outputDir}" "${txtPath}"`);

    const pdfPath = path.join(__dirname, 'test.pdf');
    if (!fs.existsSync(pdfPath)) {
        console.error('Failed to create test.pdf, aborting.');
        return;
    }

    // 2. Test PDF -> DOCX
    console.log('\n--- Testing PDF -> DOCX ---');
    // LibreOffice usually uses "docx" or "microsoft_word_xml" filter
    await runCommand(`${sofficePath} --headless --infilter="writer_pdf_import" --convert-to docx --outdir "${outputDir}" "${pdfPath}"`);

    // 3. Test PDF -> PPTX
    console.log('\n--- Testing PDF -> PPTX ---');
    // This is likely where it fails. PDF is usually imported into Draw, not Impress.
    // Converting PDF to PPTX might not be directly supported via simple --convert-to without specific filters or it might just fail.
    await runCommand(`${sofficePath} --headless --infilter="impress_pdf_import" --convert-to pptx --outdir "${outputDir}" "${pdfPath}"`);
}

test();
