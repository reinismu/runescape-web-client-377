class Executed {
    func: () => Promise<boolean> = null;
    instance: any = null;

    funcBound: () => Promise<boolean> = null;
    timeout: NodeJS.Timeout = null;
    executeFunc: () => Promise<void> = null;
    stopped = true;

    constructor(func: () => Promise<boolean>, instance: any) {
        this.func = func;
        this.instance = instance;

        this.initExecuteFunc();
    }

    public execute() {
        this.stopped = false;
        this.executeFunc();
    }
    public stop() {
        this.stopped = true;
        if (this.timeout != null) {
            clearTimeout(this.timeout);
        }
    }

    public restart() {
        this.stop();
        this.initExecuteFunc();
        this.execute();
    }

    initExecuteFunc() {
        this.funcBound = this.func.bind(this.instance);
        this.executeFunc = (async () => {
            const run = await this.funcBound();
            if (run && !this.stopped) {
                this.timeout = setTimeout(this.executeFunc, 1);
            } else {
                this.timeout = null;
            }
        }).bind(this);
    }
}

export async function sleep(milliseconds: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

export interface Runnable {
    run(): Promise<boolean>;
}

export class ParallelExecutor {
    executeds: Executed[] = [];

    public start(runnable: Runnable) {
        this.startRaw(runnable.run, runnable);
    }

    public startRaw(func: () => Promise<boolean>, instance: any) {
        const executed = new Executed(func, instance);
        executed.execute();
        this.executeds.push(executed);
    }

    public restartAll() {
        this.executeds.forEach(ex => {
            ex.restart();
        });
    }

    public stopAll() {
        this.executeds.forEach(ex => {
            ex.stop();
        });
    }
}
