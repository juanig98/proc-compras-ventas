import { join } from "path";
import { rimrafSync } from "rimraf";
import * as fs from 'fs';

const sleep = async function (ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const clearOutputFolder = () => {
    rimrafSync(paths.outputs)
    fs.mkdirSync(paths.outputs)
}


const paths = {
    root: __dirname.substring(0, __dirname.search('dist')),
    assets: join(__dirname.substring(0, __dirname.search('dist')), 'assets'),
    templates: join(__dirname.substring(0, __dirname.search('dist')), 'assets', 'templates'),
    inputs: join(__dirname.substring(0, __dirname.search('dist')), 'tmp', 'inputs'),
    outputs: join(__dirname.substring(0, __dirname.search('dist')), 'tmp', 'outputs')
}


export { paths, sleep }