const fs = require('fs');
const content = fs.readFileSync('scratch/step_189_full.txt', 'utf8');
const match = content.match(/"TargetContent":"(.*?)"(?=,"TargetFile")/);
if (match) {
    let target = match[1];
    // Unescape the string
    target = JSON.parse('"' + target + '"');
    fs.writeFileSync('scratch/original_ambulance_jsx.txt', target);
    console.log("Extracted original JSX");
} else {
    console.log("Could not find TargetContent");
}
