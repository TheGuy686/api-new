import BaseAction from '@eezze/base/action/BaseAction';
import { ActionDataManager as ADM, LogicChain } from '@eezze/classes';
import { EAction, Command } from '@eezze/decorators';

@EAction()
export default class ExecUnitTestAction extends BaseAction {
    @Command({
        command: (adm: ADM, lc: LogicChain) => {
            const uts = (adm.input?.unitTests ?? '').split(',');

            let cmdIns = `host=${adm.input.host} port=${adm.input.port} prId=${adm.input.projectId} `;

            if (uts.length > 0) cmdIns += `uts=${uts.join(',')}`;

            return `node ./plugins/eezze/unit-test/index.js ${cmdIns} > out.txt`;
        },
    })
    _exec() {}
}