require('module-alias/register');
require('dotenv-json')({ path: '.env.json' });
require('source-map-support').install();

import { deleteFile, fileExists, isDir, mkdir, readFile, rmdir, writeFile } from '../libs/FileMethods';
import PDC from '../classes/DocPdc';
import Logger from '../classes/Logger';
import EezzeTpl from '../classes/EezzeTpl';
import shelljs from 'shelljs';
import logo from '../templates/docs/logo';
import DateMethods from '../libs/Date';
import { convertToCapitalCase, kebabCase } from '../libs/StringMethods';
import { filterNullValues } from '../libs/ObjectMethods';

const fs = require('fs');
const HTMLtoDOCX = require('html-to-docx');

const dssRoot = `${__dirname}/../../../docs-api/datasources/`;
const sgsRoot = `${__dirname}/../../../docs-api/service-groups/`;

const tmp = '/var/www/html/test/';
//os.tmpdir()

console.clear();

const projectInfo = {
    name: 'Eezze',
    logo: logo.logo,
    dataOfLastEdit: DateMethods.formatDate(new Date(), 'MMMM yyyy'),
    companyName: 'Eezze Co., Ltd.',
    address: `Panjit Tower, 11th Floor\nThonglor Rd, 117 Soi Sukhumvit 55\nKhlong Tan Nua, Wattana\nBangkok 10110 Thailand\nTax ID : 0105559053651\nTel: +66 (0)2-3921156`.split('\n'),
}

const theme = {
    primary: '#012840',
    secondary: '#284f8d',
}

const templates = {
    'macros.ezt': readFile({
        path: `${__dirname}/../templates/docs`,
        file: 'macros.ezt',
    }),
    'ds.ezt': readFile({
        path: `${__dirname}/../templates/docs`,
        file: 'ds-tpl.html',
    }),
    'all-dss-overview.ezt': readFile({
        path: `${__dirname}/../templates/docs`,
        file: 'all-dss-overview-tpl.html',
    }),
    'sg-overview-tpl.ezt': readFile({
        path: `${__dirname}/../templates/docs`,
        file: 'sg-overview-tpl.html',
    }),
    'service.ezt': readFile({
        path: `${__dirname}/../templates/docs`,
        file: 'service-tpl.html',
    }),
};

const TOC = `
<w:sdt>
<w:sdtPr>
    <w:docPartObj>
        <w:docPartGallery w:val="Table of Contents"/>
        <w:docPartUnique/>
    </w:docPartObj>
</w:sdtPr>
<w:sdtContent>
    <w:p>
        <w:pPr>
            <w:pStyle w:val="TOCHeading"/>
        </w:pPr>
        <w:r>
            <w:fldChar w:fldCharType="begin"/>
        </w:r>
        <w:r>
            <w:instrText xml:space="preserve">TOC \\o "1-3" \\h \z \\u</w:instrText>
        </w:r>
        <w:r>
            <w:fldChar w:fldCharType="end"/>
        </w:r>
    </w:p>
    <!-- Entries for the table of contents go here -->
</w:sdtContent>
</w:sdt>
`;

async function generateDsDocument(dsKey: string, ds: any) {
    await shelljs.ls(`rm ${dssRoot}*`);

    const dsIns = new (ds.ds)();

    const htmlContent = await EezzeTpl.render({
        templateVars: { 
            theme,
            projectInfo,
            ds: {
                name: convertToCapitalCase(ds.ds.props.name),
                type: dsIns.ds.type,
                connection: convertToCapitalCase((ds?.ds?.props?.connection ?? '').replace(/Connection$/, '')),
                dbName: ds?.ds?.props?.databaseName,
            },
            models: ds.models,
        },
        templates,
        template: 'ds',
        prettify: false,
    });

    const outputFile = `${dsKey}.docx`;

    writeFile({
        createPathIfNotExists: false,
        path: tmp,
        file: `${dsKey}.html`,
        data: htmlContent,
    });

    // delete out the old file if it exists
    if (fileExists(`${dssRoot}${outputFile}`)) deleteFile(`${dssRoot}${outputFile}`);

    const fileBuffer = await HTMLtoDOCX(htmlContent, null, {
        table: { row: { cantSplit: false } },
        header: false,
        footer: true,
        pageNumber: true,
    });
    
    fs.writeFileSync(`${dssRoot}${outputFile}`, fileBuffer);

    await new Promise((res: any) => setTimeout(() => res(), 220));

    // const docxContent = readFile({
    //     path: dssRoot,
    //     file: outputFile,
    // });

    // deleteFile(`${dssRoot}${outputFile}`);

    // fs.writeFile(`${dssRoot}${outputFile}`, docxContent.replace('{INSERT-TOC-HERE}', TOC), (error: any) => {
    //     if (error) {
    //         console.log('Docx file creation failed');
    //         return;
    //     }
    //     console.log('Docx file created successfully');
    // });

    console.log('Should have saved the TOC content');

    // deleteFile(tmpFile);
}

async function generateDsOverviewDocument(datasources: any  ) {
    const dss: any = []

    for (const dsKey in datasources) {
        const ds = datasources[dsKey];
        const dsIns = new (ds)();

        let dsIn: any;

        switch (dsIns.ds.type) {
            case 'rest': {
                dsIn = {
                    name: convertToCapitalCase(ds.props.name),
                    type: dsIns.ds.type,
                    connection: convertToCapitalCase((ds?.props?.connection ?? '').replace(/Connection$/, '')),
                    props: {
                        host: dsIns.ds.props?.host,
                        alias: dsIns.ds.props?.alias,
                        port: Number(dsIns.ds.props?.port),
                        secure: dsIns.ds.props?.secure,
                    }
                };
                break;
            }
            case 'ws-integration': {
                dsIn = {
                    name: convertToCapitalCase(ds.props.name),
                    type: dsIns.ds.type,
                    connection: convertToCapitalCase((ds?.props?.connection ?? '').replace(/Connection$/, '')),
                    props: {
                        dbName: ds?.props?.databaseName,
                        host: dsIns.ds.props?.host,
                        alias: dsIns.ds.props?.alias,
                        port: Number(dsIns.ds.props?.port),
                        secure: dsIns.ds.props?.secure,
                    }
                };
                break;
            }
            case 'FileStorage': {
                dsIn = {
                    name: convertToCapitalCase(ds.props.name),
                    type: dsIns.ds.type,
                    connection: convertToCapitalCase((ds?.props?.connection ?? '').replace(/Connection$/, '')),
                    props: {
                        host: dsIns.ds.props?.host,
                        alias: dsIns.ds.props?.alias,
                        port: Number(dsIns.ds.props?.port),
                        rootFolder: typeof ds?.props?.rootFolder == 'function' ? 'DYNAMIC' : ds?.props?.rootFolder,
                        secure: dsIns.ds.props?.secure,
                    },
                };
                break;
            }
            case 'Mysql': {
                dsIn = {
                    name: convertToCapitalCase(ds.props.name),
                    type: dsIns.ds.type,
                    connection: convertToCapitalCase((ds?.props?.connection ?? '').replace(/Connection$/, '')),
                    props: {
                        dbName: ds?.props?.databaseName,
                        host: dsIns.ds.props?.host,
                        alias: dsIns.ds.props?.alias,
                        port: Number(dsIns.ds.props?.port),
                        secure: dsIns.ds.props?.secure,
                    }
                };
                break;
            }
            case 'SmtpMailService': {
                dsIn = {
                    name: convertToCapitalCase(ds.props.name),
                    type: dsIns.ds.type,
                    connection: convertToCapitalCase((ds?.props?.connection ?? '').replace(/Connection$/, '')),
                    props: {
                        host: dsIns.ds.props?.host,
                        alias: dsIns.ds.props?.alias,
                        port: Number(dsIns.ds.props?.port),
                        isThridParty: dsIns.ds.props?.isThridParty,
                        secure: dsIns.ds.props?.secure,
                    },
                };
                break;
            }
        }

        if (!dsIn.props?.port || dsIn.props?.port == null) delete dsIn.props['port']

        dss.push(JSON.parse(JSON.stringify(dsIn)));
    }

    const htmlContent = await EezzeTpl.render({
        templateVars: { 
            theme,
            projectInfo,
            dss,
        },
        templates,
        template: 'all-dss-overview',
        prettify: false,
    });

    const outputFile = `all-datasources-overview.docx`;

    writeFile({
        createPathIfNotExists: false,
        // path: os.tmpdir(),
        path: tmp,
        file: `all-datasources-overview.html`,
        data: htmlContent,
    });

    // delete out the old file if it exists
    if (fileExists(`${dssRoot}${outputFile}`)) deleteFile(`${dssRoot}${outputFile}`);

    // console.log('\n\nREs: ', res.stdout);

    const fileBuffer = await HTMLtoDOCX(htmlContent, null, {
        table: { row: { cantSplit: false } },
        header: false,
        footer: true,
        pageNumber: true,
    });

    fs.writeFileSync(`${dssRoot}${outputFile}`, fileBuffer);

    // deleteFile(tmpFile);
}

async function generateServiceDocument(sgRoot: string, service: any) {
    const htmlContent = await EezzeTpl.render({
        templateVars: { 
            theme,
            projectInfo,
            ser: {
                ...service,
                config: service.config?.services?.[service.keyCc] ?? {}, 
            },
        },
        templates,
        template: 'service',
        prettify: false,
    });

    const outputFile = `${service.keyCc}.docx`;

    writeFile({
        createPathIfNotExists: false,
        path: tmp,
        file: `service.html`,
        data: htmlContent,
    });

    // delete out the old file if it exists
    if (fileExists(`${sgRoot}${outputFile}`)) deleteFile(`${dssRoot}${outputFile}`);

    // console.log('\n\nREs: ', res.stdout);

    const fileBuffer = await HTMLtoDOCX(htmlContent, null, {
        table: { row: { cantSplit: false } },
        header: false,
        footer: true,
        pageNumber: true,
    });

    fs.writeFileSync(`${sgRoot}${outputFile}`, fileBuffer);

    // console.log('Service file generated');

    // deleteFile(tmpFile);
}

async function generateSgOverviewDocument(sgKey: string, sg: any) {
    await shelljs.ls(`rm ${sgsRoot}*`);

    sg.key = sgKey;
    sg.name = convertToCapitalCase(sgKey);

    const sgRoot = `${sgsRoot}/`;

    if (!fileExists(sgRoot)) mkdir(sgRoot);

    const rest = Object.values(sg?.rest?.services ?? {});
    const ws = Object.values(sg?.ws?.services ?? {});
    const cron = Object.values(sg?.cron?.services ?? {});

    const htmlContent = await EezzeTpl.render({
        templateVars: { 
            theme,
            projectInfo,
            sg: filterNullValues({
                type: sg?.type,
                name: sg?.name,
                auth: sg?.auth,
                serviceTypes: [
                    {
                        type: 'rest',
                        services: rest
                    },
                    {
                        type: 'ws',
                        services: ws,
                    },
                    {
                        type: 'cron',
                        services: cron,
                    }
                ]
            }),
        },
        templates,
        template: 'sg-overview-tpl',
        prettify: false,
    });

    const outputFile = `${sgKey}-overview.docx`;

    writeFile({
        createPathIfNotExists: false,
        path: tmp,
        file: `${sgKey}.html`,
        data: htmlContent,
    });

    // // delete out the old file if it exists
    if (fileExists(`${sgRoot}${outputFile}`)) deleteFile(`${sgRoot}${outputFile}`);

    const fileBuffer = await HTMLtoDOCX(htmlContent, null, {
        table: { row: { cantSplit: false } },
        header: false,
        footer: true,
        pageNumber: true,
    });

    fs.writeFileSync(`${sgRoot}${outputFile}`, fileBuffer);

    return;

    // then process each of the service documents and generate each service documention
    // first process the rest services for the given service group
    if (rest.length > 0) {
        for (const serv of rest) {
            await generateServiceDocument(sgRoot, serv);
        }
    }

    // then process the ws services for the given service group
    if (ws.length > 0) {
        for (const serv of ws) {
            await generateServiceDocument(sgRoot, serv);
        }
    }

    // lastly process the cron services for the given service group
    if (cron.length > 0) {
        for (const serv of cron) {
            await generateServiceDocument(sgRoot, serv);
        }
    }

    // deleteFile(tmpFile);
}

(async () => {
    const output: any = await PDC.initDependancyCache(new Logger('doc_parser'));

    if (!isDir(dssRoot)) mkdir(dssRoot);
    if (!isDir(sgsRoot)) mkdir(sgsRoot);

    // first we need to output datasources overviews
    if (typeof output?.datasources) {
        //await generateDsOverviewDocument(output.datasources);
    }

    // then we need to generate all the entity files for each datasource
    if (typeof output?.models) {
        // first loop over the grouped models and dss
        // for (const dsKey in output.models) {
        //     await generateDsDocument(dsKey, output.models[dsKey]);
        // }
    }

    if (typeof output?.serviceGroups) {
        // first loop over the grouped models and dss
        for (const sgKey in output.serviceGroups) {
            // if (sgKey != 'WsGenConnections') continue;
            await generateSgOverviewDocument(sgKey, output.serviceGroups[sgKey]);
        }
    }

    // console.log('output: ', output.serviceGroups.ExpressAuthentication.rest.services.forgotPassword.service);
    // console.log('output: ', output.serviceGroups);

})();