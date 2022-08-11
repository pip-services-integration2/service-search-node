let SearchProcess = require('../obj/src/container/SearchProcess').SearchProcess;

try {
    let proc = new SearchProcess();
    proc._configPath = "./config/config.yml";
    proc.run(process.argv);
} catch (ex) {
    console.error(ex);
}
