import EFileI from '../interfaces/EFIleI';

interface FILE_INFO_IMAGE_TYPE {
    content: string;
    ext: E_BASE64_IMAGE_TYPES
}

const bt = require('buffer-type');

export default class FileConversion {
    static isValidBase64ImgType(ext: string): ext is E_BASE64_IMAGE_TYPES {
        return [
            'jpeg',
            'jpg',
            'gif',
            'png',
            'bmp',
            'tiff',
            'webp',
            'svg',
            'ico',
            'jfif',
            'pjpeg',
            'pjp',
            'avif',
            'apng',
            'heif',
            'bat',
            'bpg',
            'cr2',
            'cur',
            'ecw',
            'dds',
            'dng',
            'exr',
            'f4a',
            'f4b',
            'f4p',
            'f4v',
            'flif',
            'webp'
        ].includes(ext);
    }

    static async base64Decode(base64str: string): Promise<EFileI> {
        let matches: any = base64str.match(/data\:(.*?\/.*?);base64,/);

        const info: any = {
            type: '',
            extension: '',
            width: 0,
            height: 0,
            bit: 0,
            color: 0,
            compression: 0,
            filter: 0,
            interlace: 0
        };

        if (matches) {
            matches = matches[1].split('/');

            if (matches.length > 0) {
                if (matches[1] == 'jpeg') info.extension = 'jpg';
                else {
                    info.extension = matches[1];
                }

                info.type = matches[0];
            }
        }

        const buf = Buffer.from(base64str.replace(/data\:.*?\/.*?;base64,/, ''), 'base64');

        return {
            buffer: buf,
            info: bt(buf) ?? info,
        };
    }
}