const fs = require('fs');
const path = require('path');

module.exports = (app) => {
  app.locals.assetPath = (filePath) => {
    if (process.env.APP_MODE === 'development') {
      return '/' + filePath;
    } else if (process.env.APP_MODE === 'production') {
      return (
        '/' +
        JSON.parse(
          fs.readFileSync(
            path.join(__dirname, '..', 'public', 'assets', 'rev-manifest.json')
          )
        )[filePath]
      );
    }
  };
};
