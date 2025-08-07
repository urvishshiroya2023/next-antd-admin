const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, '../src/app/settings/master-data/components');
const targetDir = path.join(__dirname, '../src/components');

// Create components directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Create symbolic links for all components
const components = ['MasterItemForm', 'MasterItemList', 'MasterTypeList'];

components.forEach(component => {
  const source = path.join(componentsDir, `${component}.tsx`);
  const target = path.join(targetDir, `${component}.tsx`);
  
  try {
    fs.symlinkSync(source, target, 'file');
    console.log(`Created symlink: ${target} -> ${source}`);
  } catch (error) {
    if (error.code === 'EEXIST') {
      console.log(`Symlink already exists: ${target}`);
    } else {
      console.error(`Error creating symlink for ${component}:`, error);
    }
  }
});
