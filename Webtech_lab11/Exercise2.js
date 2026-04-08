// Import file system module
const fs = require('fs');

// 1. Create / Write file
fs.writeFile('sample.txt', 'Hello, this is Node.js file handling!', (err) => {
    if (err) {
        console.log('Error creating file:', err);
        return;
    }
    console.log('File created successfully');

    // 2. Read file
    fs.readFile('sample.txt', 'utf8', (err, data) => {
        if (err) {
            console.log('Error reading file:', err);
            return;
        }
        console.log('File content:', data);

        // 3. Append data
        fs.appendFile('sample.txt', '\nAppending new data...', (err) => {
            if (err) {
                console.log('Error appending file:', err);
                return;
            }
            console.log('Data appended successfully');

            // 4. Delete file
            fs.unlink('sample.txt', (err) => {
                if (err) {
                    console.log('Error deleting file:', err);
                    return;
                }
                console.log('File deleted successfully');
            });
        });
    });
});