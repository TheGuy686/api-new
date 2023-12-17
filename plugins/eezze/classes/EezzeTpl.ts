import { PRETTYIFIER_MODE } from '../interfaces/RenderTemplateI';
import {
    camelCase,
    kebabCase,
    underscoreCase,
    pascalCase,
    randColor,
    randDarkColor,
    convertStrToKey,
    ucFirst,
    lcFirst,
    singularize,
    pluralize,
    generateRandomString,
    convertToStrToCode,
    convertToCapitalCase,
} from '../libs/StringMethods';
import { evaluateStringTemplate } from 'string-template-parser';

const he = require('he');

type tplType = 'render-templates' | 'email-templates';

// https://www.npmjs.com/package/twing
const {
    TwingEnvironment,
    TwingLoaderFilesystem,
    TwingFilter,
    TwingLoaderArray,
    TwingFunction,
    TwingMarkup,
} = require('twing');

interface ArgsI {
    template?: string;
    templateVars?: any;
    templateType?: tplType;
    prettify?: boolean;
    prettifyMode?: PRETTYIFIER_MODE;
    linter?: string;
    cache?: boolean;
    templates?: {[key: string]: [content: string]}
}

// var log = console.log;

// console.log = function() {
//     log.apply(console, arguments);
// };

const tplMethods: {[key: string]: Function} = {
    isArray(value: any) {
        return typeof value == 'object' && Array.isArray(value);
    },
    isObj(value: any) {
        return typeof value == 'object' && value != null;
    },
    isBool(value: any) {
        return typeof value == 'boolean' && value != null;
    },
    escapeString(str: string, leading: string = '`') {
        if (leading == '`') {
            return str.replace(/\${/g, '\\${').replace(/\`/g, '\`');
        }
        else if (leading == '"') return str.replace(/"/g, '\"');

        return str.replace(/'/g, "\'");
    },
    html(input: string) { return he.decode(input) },
    dlog() {
        console.log.apply(console, arguments);
    },
    camelCase(str: string) { return camelCase(str) },
    underscoreCase(str: string) { return underscoreCase(str) },
    kebabCase(str: string) { return kebabCase(str) },
    pascalCase(str: string) { return pascalCase(str) },
    randColor() { return randColor() },
    randDarkColor() { return randDarkColor() },
    convertStrToKey(str: string) { return convertStrToKey(str) },
    ucFirst(str: string) { return ucFirst(str) },
    lcFirst(str: string) { return lcFirst(str) },
    singularize(str: string) { return singularize(str) },
    pluralize(str: string) { return pluralize(str) },
    generateRandomString(length: number = 10) { return generateRandomString(length) },
    convertToStrToCode(str: string) { return convertToStrToCode(str) },
    capitalCase(str: string) { return convertToCapitalCase(str) },
    matches(pattern: any, value: string) {
        return new RegExp(pattern).test(value);
    }
};

const camelCaseFilter = new TwingFilter('camelCase', (str: string) => Promise.resolve(camelCase(str)));
const capitalCase = new TwingFilter('capitalCase', (str: string) => Promise.resolve(convertToCapitalCase(str)));
const underscoreCaseFilter = new TwingFilter('underscoreCase', (str: string) => Promise.resolve(underscoreCase(str)));
const kebabCaseFilter = new TwingFilter('kebabCase', (str: string) => Promise.resolve(kebabCase(str)));
const pascalCaseFilter = new TwingFilter('pascalCase', (str: string) => Promise.resolve(pascalCase(str)));
const ucFirstFilter = new TwingFilter('ucFirst', (str: string) => Promise.resolve(ucFirst(str)));
const lcFirstFilter = new TwingFilter('lcFirst', (str: string) => Promise.resolve(lcFirst(str)));
const singularizeFilter = new TwingFilter('singularize', (str: string) => Promise.resolve(singularize(str)));
const pluralizeFilter = new TwingFilter('pluralize', (str: string) => Promise.resolve(pluralize(str)));
const htmlFilter = new TwingFilter('html', (str: string) => Promise.resolve(tplMethods.html(str)));
const htmlNewLns = new TwingFilter('htmlNewLns', (str: string) => {
    Promise.resolve(str.replace(/\\n/g, '<br>'));
});
const objectKeysFilter = new TwingFilter('keys', (str: string) => Promise.resolve((obj: object) => {
    try {
        return Object.keys(obj);
    }
    catch (err) { [] };
}));
const dlog = new TwingFunction('dlog', function() {
    const args: any = arguments;

    Promise.resolve(() => {
        console.log.apply(console, args);
        return '';
    });
});

export default class EezzeTpl {
    static parseString(tplString: string, vars: any = {}) {
        return evaluateStringTemplate(tplString, vars, {
            pj(obj: any) {
                return JSON.stringify(obj, null, 4);
            },
            camelCase(str: string) { return camelCase(str) },
            kebabCase(str: string) { return kebabCase(str) },
            pascalCase(str: string) { return pascalCase(str) },
            underscoreCase(str: string) { return underscoreCase(str) },
            randColor() { return randColor() },
            randDarkColor() { return randDarkColor() },
            convertStrToKey(str: string) { return convertStrToKey(str) },
            ucFirst(str: string) { return ucFirst(str) },
            lcFirst(str: string) { return lcFirst(str) },
            singularize(str: string) { return singularize(str) },
            pluralize(str: string) { return pluralize(str) },
            generateRandomString(length: number = 10) { return generateRandomString(length) },
            convertToStrToCode(str: string) { return convertToStrToCode(str) },
        });
    }

    static async render(args: ArgsI) {
        // try {
            let path = `${__dirname}/../../../src/service-configurables/`;

            if (args?.templateType === 'email-templates') path += 'email-templates/';
            else path += 'render-templates/';

            if (!args?.linter) args.linter = 'babel';

            const props: { debug: boolean, cache?: string } = { debug: true };

            // if (args?.cache ?? false) props.cache = `${__dirname}/../../../src/service-configurables/cache`;

            let loader;

            if (args.templates) {
                loader = new TwingLoaderArray(args.templates);
            }
            else loader = new TwingLoaderFilesystem(path);

            const twing = new TwingEnvironment(loader, props);

            // twing.addGlobal('text', new Text());

            twing.addFilter(camelCaseFilter);
            twing.addFilter(capitalCase);
            twing.addFilter(kebabCaseFilter);
            twing.addFilter(pascalCaseFilter);
            twing.addFilter(ucFirstFilter);
            twing.addFilter(lcFirstFilter);
            twing.addFilter(singularizeFilter);
            twing.addFilter(pluralizeFilter);
            twing.addFilter(underscoreCaseFilter);
            twing.addFilter(htmlFilter);
            twing.addFilter(htmlNewLns);

            // twing.addFilter(objectKeysFilter);
            twing.addFunction(dlog);

            tplMethods.pjVar = function (obj: any) {
                try {
                    if (typeof obj == 'function') return 'CUSTOM [FUNC]';

                    if (typeof obj != 'object') return obj;

                    let keys: any[] = []; 

                    try {
                        keys = Array.from(obj.keys());
                    }
                    catch (err) {}

                    let isArray = false;

                    // if there is a key and it is an integer then its most likely an array
                    if (keys.length > 0 && typeof keys[0] == 'number') isArray = true;

                    if (isArray) {
                        return new TwingMarkup(JSON.stringify(Array.from(obj.values())), 'utf-8', true);
                    }

                    // this is because the twing template system converts the arrays over
                    // to objects so we need to get this from the "this" context instead
                    if (typeof obj === 'string' && typeof this[obj] !== 'undefined') {
                        return new TwingMarkup(JSON.stringify(this[obj]), 'utf-8', true);
                    }

                    return new TwingMarkup(JSON.stringify(obj), 'utf-8', true);
                }
                catch (err) {
                    console.log('There was an error process your var: ', err);
                    console.log('VAR: ', obj);
                    process.exit();
                }
            }.bind(args.templateVars);

            tplMethods.pj = function (obj: any, isArray: boolean = false) {
                if (isArray) {
                    return new TwingMarkup(JSON.stringify(Array.from(obj.values()), null, 4), 'utf-8', true);
                }

                // this is because the twing template system converts the arrays over
                // to objects so we need to get this from the "this" context instead
                if (typeof obj === 'string' && typeof this[obj] !== 'undefined') {
                    return new TwingMarkup(JSON.stringify(this[obj], null, 4), 'utf-8', true);
                }

                return new TwingMarkup(JSON.stringify(obj, null, 4), 'utf-8', true);
            }.bind(args.templateVars);

            let renderedCont: string = await new Promise((resolve, reject) => {
                twing.render(`${args?.template}.ezt`, {
                    ez: tplMethods,
                    ...args.templateVars,
                })
                    .then((output: string) => {
                        resolve(output)
                    })
                    .catch((e: any) => {
                        console.log('Error: ', e.message);
                        reject(e);
                    });
            });

            if (args?.prettify ?? true) {
                let cachedProps;

                if (!args?.prettifyMode)  {
                    args.prettifyMode = 'loose';
                }

                renderedCont = renderedCont.replace(/\,\,/g, ',');

                // here we need to process each prettier block that we need to ignore
                const matches = renderedCont.match(/\/\/prettier-ignore-start([\s\S]*?)\/\/prettier-ignore-end/gm);

                if (matches && args.prettifyMode == 'loose') {
                    for (const i in matches) {
                        renderedCont = renderedCont.replace(matches[i], '// PRETTY_IGNORE_' + i);
                    }
                }

                if (args?.linter == 'babel' || args?.linter == 'babel-ts') {
                    cachedProps = renderedCont.match(/([a-zA-Z0-9-_'\[\]"]+)\?: (.*?);/g);

                    if (cachedProps) {
                        renderedCont = renderedCont.replace(
                            /([a-zA-Z0-9-_'"]+)\?: (.*?);/g,
                            '$1: $2;'
                        );
                    }
                }
                else if (args?.linter == 'yaml') {
                    const yaml = await import('yaml');

                    try {
                        const pc = yaml.parse(renderedCont);

                        renderedCont = yaml.stringify(pc);
                    }
                    catch (err) {
                        throw new Error(`Given yaml was invalid. Please check the content of the YAML and try again`);
                    }
                }

                renderedCont = require('prettier').format(renderedCont, {
                    useTabs: true,
                    printWidth: 100,
                    singleQuote: true,
                    parser: args?.linter,
                    // semi: false,
                    ignore: ['(new DefaultMysqlDB() as any).run();'],
                });

                renderedCont = renderedCont.substr(0, renderedCont.length - 1);
                renderedCont = renderedCont.replace(/,\n\s*?\n\s*?/g, ',\n');
                renderedCont = renderedCont.replace(/([a-zA-Z0-9])\n\s*?\n(\s?)@/g, '$1\n$2@');
                renderedCont = renderedCont.replace(/\}\)\n\s*?\n(\s*?)\/\//g, '})\n$1//');
                renderedCont = renderedCont.replace(/\/\/(.*)\n(\s*?)\/\//g, '//$1$2//');

                // here we need to reinsert the "prop?: type;" syntax as its not supported
                if (cachedProps) {
                    cachedProps.forEach(
                        (prop: string) => {
                            renderedCont = renderedCont.replace(prop.replace('?', ''), prop);
                        });
                }

                // if there were any caeched blocks then we need to reinsert them back into the DOM
                if (matches && args.prettifyMode == 'loose') {
                    for (const i in matches) {
                        renderedCont = renderedCont.replace('// PRETTY_IGNORE_' + i, matches[i]);
                    }
                }
            }

            renderedCont = renderedCont.replace(/\\#/g, '#');

            return renderedCont;
        // }
        // catch (e) {
        //     console.log('ERROR PARSING EEZZE TEMPLATE: ', e);
        //     throw new Error(`There was an error rendering eezze template`)
        // }
    }
}