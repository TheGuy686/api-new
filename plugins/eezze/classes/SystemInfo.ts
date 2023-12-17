import System from '../libs/System';

const si = require('systeminformation');

// nodemon  --exec 'ts-node plugins/eezze/services/get-system-info.ts'

const system = {
    general: {
        version: {},
        time: {},
    },
    os: {
        uuid: {},
        info: {},
        users: {},
        shell: {},
        versions: {},
    },
    system: {
        info: {
            disk: {},
            usage: {
                current: {},
                max: {},
            }
        },
        processes: {},
        bios: {},
        baseboard: {},
        chassis: {},
    },
    cpu: {},
    wifiNetworks: {},
    network: {},
    docker: {},
};

export default class SystemInfo {
    static byteCount(s: any) {
        return encodeURI(s).split(/%..|./).length - 1;
    }

    static formatBytes(bytes: any, decimals: any = 2) {
        if (!+bytes) return '0 Bytes'

        const k = 1024
        const dm = decimals < 0 ? 0 : decimals
        const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
    }

    static ip() { return System.ip(); }

    static async netStats() {
        return await si.networkStats();
    }

    static async defaultNetworkInterface() {
        return await si.networkInterfaceDefault();
    }

    static async defaultNetwork() {
        const stats: any = await this.netStats(),
              dni        = await this.defaultNetworkInterface();

        const max = 1000;

        for (const s of stats) {
            if (s.iface != dni) continue;

            const uspeed = Number(Math.abs((s.tx_sec ?? 0) / 1024).toFixed(2));
            const dspeed = Number(Math.abs(s.rx_sec / 1024).toFixed(2));

            const upSpeed   = uspeed > 0 ? uspeed : 0;
            const downSpeed = dspeed > 0 ? dspeed : 0;

            s.kilPerSec = (s.rx_sec / 125) + '';

            s.upload = {
                speed: upSpeed,
                max: max < upSpeed ? upSpeed : max,
                percent: upSpeed / max < 1 ? upSpeed / max : 1,
            };

            s.download = {
                speed: upSpeed,
                max: max < downSpeed ? downSpeed : max,
                percent: downSpeed / max < 1 ? downSpeed / max : 1,
            };
        }
    }

    static async  netInterfaces() {
        return await si.networkInterfaces();
    }

    static async serialize() {
        const load = await si.currentLoad();
        const mem = await si.mem();
        const temperature = await si.cpuTemperature();
        const interDefault = await this.defaultNetworkInterface();

        const size = await si.fsSize();

        let totalSize = 0, totalUsed = 0, totalFree = 0;

        for (const d of size) {
            totalSize += d.size;
            totalUsed += d.used;
            totalFree += d.available;
        }

        const sysInfo = {
            ip: this.ip(),
            cpu: load.currentLoad.toFixed(2) + ' %',
            mem: ((mem.active / mem.total) * 100).toFixed(2) + ' %',
            temp: temperature.main.toPrecision(3).toString() + ' °C',
            network: {},
            storage: {
                totalUsed: this.formatBytes(totalUsed),
                totalFree: this.formatBytes(totalFree),
                totalSize: this.formatBytes(totalSize),
            }
        };

        const stats = await this.netStats();

        const max = 1000;

        for (const s of stats) {
            const uspeed = Number(Math.abs((s.tx_sec ?? 0) / 1024).toFixed(2));
            const dspeed = Number(Math.abs(s.rx_sec / 1024).toFixed(2));

            const upSpeed   = uspeed > 0 ? uspeed : 0;
            const downSpeed = dspeed > 0 ? dspeed : 0;

            s.kilPerSec = (s.rx_sec / 125) + '';

            s.upload = {
                speed: upSpeed,
                max: max < upSpeed ? upSpeed : max,
                percent: upSpeed / max < 1 ? upSpeed / max : 1,
            };

            s.download = {
                speed: upSpeed,
                max: max < downSpeed ? downSpeed : max,
                percent: downSpeed / max < 1 ? downSpeed / max : 1,
            };

            if (s.iface == interDefault) sysInfo.network  = s;
        }

        return {
            general: {
                version: await si.version(),
                time: await si.time(),
                stats: await si.getStaticData(),
                summary: sysInfo,
            },
            os: {
                uuid: await si.uuid(),
                versions: await si.versions(),
                info: await si.osInfo(),
                shell: await si.shell(),
                users: await si.users(),
            },
            system: {
                info: await si.system(),
                bios: await si.bios(),
                chassis: await si.chassis(),
                baseboard: await si.baseboard(),
                processes: await si.processes(),
                disk: {
                    disk: {
                        general: await si.diskLayout(),
                        devices: await si.blockDevices(),
                        io: await si.disksIO(),
                        size,
                    },
                    usage: {
                        current: load,
                        max: await si.fullLoad(),
                    }
                },
                load: {
                    average: load.avgload,
                    current: load.currentload,
                },
            },
            memory: {
                mem,
                layout: await si.memLayout(),
            },
            cpu: {
                general: await si.cpu(),
                speed: await si.cpuCurrentSpeed(),
                temperature,
            },
            wifi: {
                networks: await si.wifiNetworks(),
                interfaces: await si.wifiInterfaces(),
                connections: await si.wifiConnections(),
            },
            network: {
                stats,
                interfaces: await this.netInterfaces(),
                interfaceDefault: interDefault,
                gatewayDefault: await si.networkGatewayDefault(),
                connections: await si.networkConnections(),
            },
            docker: {
                info: await si.dockerInfo(),
                images: await si.dockerImages(),
                // containers: {
                //     all: await si.dockerContainers(),
                //     stats: await si.dockerContainerStats(),
                //     volumes: await si.dockerVolumes(),
                // },
                containersA: await si.dockerAll(),
            },
        };
    }
}