import decompress from 'decompress';
import * as fs from 'fs';
import { join } from 'path';
import { rimrafSync } from 'rimraf'
import { paths, sleep } from './helpers';
import { FileToDescompress } from './types';


export const decompressFiles = async () => {
    const files = fs.readdirSync(paths.inputs);
    const filesToDescompress: FileToDescompress[] = []
 
    await sleep(2500);
    files.forEach(f => {
        if ((f.startsWith("emitidos") ||
            f.startsWith("recibidos"))
            && f.endsWith(".zip")) {
            filesToDescompress.push({
                pathZip: join(paths.inputs, f),
                folderOutput: join(paths.outputs, f.replace(".zip", ""))
            })
        }
    })

    filesToDescompress.forEach(ftd => {
        decompress(ftd.pathZip, ftd.folderOutput)
    });
}
