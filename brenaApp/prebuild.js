const fs = require('fs');
const path = require('path');


// // Call the function to remove files from the folder
// removeFilesInFolder(folderPath);

// Function to recursively copy a folder and its contents
function copyFolderSync(source, target) {
    if (!fs.existsSync(target)) {
        fs.mkdirSync(target);
    }

    const files = fs.readdirSync(source);

    files.forEach(file => {
        const sourcePath = path.join(source, file);
        const targetPath = path.join(target, file);

        if (fs.lstatSync(sourcePath).isDirectory()) {
            copyFolderSync(sourcePath, targetPath);
        } else {
            fs.copyFileSync(sourcePath, targetPath);
        }
    });
}

const sourceFolder = 'public/iqsketchlite';
const buildFolder = 'build/iqsketchlite';

// Copy the folder
copyFolderSync(sourceFolder, buildFolder);

console.log('iqsketchlite folder copied successfully!');
