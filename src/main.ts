import { loadTemplate } from "./load-template"
import { clearOutputFolder } from "./helpers";
import { readData } from "./process-data"



(async () => {
    // await decompressFiles();
    await clearOutputFolder();
    await loadTemplate();

})()