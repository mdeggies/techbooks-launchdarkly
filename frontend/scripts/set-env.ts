// Courtesey of Sara Lara: https://medium.com/@natchiketa/angular-cli-and-os-environment-variables-4cfa3b849659

const fs = require('fs');
const yargs = require('yargs');

require('dotenv').config();

const environment = yargs.argv.environment;
const isProd = environment === 'prod';
var targetPath = "";

if (isProd) {
    targetPath = `./src/environments/environment.prod.ts`;
} else {
    targetPath = `./src/environments/environment.ts`;
}

const envConfigFile = `
export const environment = {
  production: ${isProd},
  LAUNCH_DARKLY_API_KEY: "${process.env.LAUNCH_DARKLY_API_KEY}",
};
`
fs.writeFile(targetPath, envConfigFile, function (err) {
    if (err) {
        console.log(err);
    }

    console.log(`Output generated at ${targetPath}`);
});