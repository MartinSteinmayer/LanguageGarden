const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'definitely_endangered.json');
const outputPath = path.join(__dirname, 'definitely_endangered_1.json');

const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

const removeStatus = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(removeStatus);
  } else if (obj && typeof obj === 'object') {
    const { status, ...rest } = obj;
    Object.keys(rest).forEach(key => {
      rest[key] = removeStatus(rest[key]);
    });
    return rest;
  }
  return obj;
};

const cleaned = removeStatus(data);

fs.writeFileSync(outputPath, JSON.stringify(cleaned, null, 2), 'utf-8');
console.log('Status keys removed. Output written to', outputPath);