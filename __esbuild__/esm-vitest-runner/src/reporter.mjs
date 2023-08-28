import { Transform } from 'node:stream';
import chalk from 'chalk';

const error = chalk.red;

export class Reporter extends Transform {


    eventMap = new Map();

    constructor( options = {} ) {
        options.objectMode = true;
        super(options);
        this.mapEventHandlers();
    }

    mapEventHandlers() {
        this.eventMap.set('test:start', this.onTestStart.bind(this));
        this.eventMap.set('test:plan', this.onTestPlan.bind(this));
        this.eventMap.set('test:pass', this.onTestPass.bind(this));
        this.eventMap.set('test:fail', this.onTestFail.bind(this));
        this.eventMap.set('test:enqueue', this.onTestQueue.bind(this));
        this.eventMap.set('test:dequeue', this.onTestDequeue.bind(this));
        this.eventMap.set('test:diagnostic', this.onTestDiag.bind(this));
        this.eventMap.set('test:stdout', this.onTestStdOut.bind(this));
        this.eventMap.set('test:stderr', this.onTestStdErr.bind(this));
    }


    _transform(event, encoding, callback) {
        const handler = this.eventMap.get(event.type);
        if(handler) handler(event.data, event);
        else console.log('UNHANDLED', event.type);
        callback(null);
    }

    _indents( num ) {
        return Array.from(Array(num+2)).map(_ => '  ').join('');
    }

    onTestStart( props ) {
        const { nesting, name } = props;
        const _in = this._indents(nesting);
        if( nesting === 0 ) {
            const _wr = chalk.rgb(255, 136, 0).bold.underline;
            console.log([ '\n', _in, _wr(name) ].join('')); //, chalk.grey.underline(` >> ${file}`) ].join(''));
            return;
        }
        const _wr = chalk.yellow.bold;
        console.log([ _in, _wr(name) ].join(''));
    }

    onTestPass( props ) {
        const { nesting, file, name, details: { duration_ms, type } } = props;
        const _in = this._indents(nesting);
        if( type !== "suite" ) {
            const message = [_in, '| ', chalk.green.bold('PASS!'), chalk.grey(`[${duration_ms}ms]`)];
            console.log(message.join(''));
        }
    }

    onTestFail( props ) {
        const { nesting, file, name } = props;
        console.log(props);
        const _in = this._indents(nesting);
        console.log( [ _in, '| ', chalk.red.bold('FAIL!')].join(''));
    }

    onTestQueue( { ...props } ) {

    }

    onTestDequeue( { ...props } ) {

    }

    onTestPlan( { ...props } ) {
        
    }

    onTestDiag( props ) {

    }

    onTestStdOut( { ...props } ) {

    }

    onTestStdErr( props ) {
        const bg = chalk.bgRgb(100,0,0);
        const fg = chalk.rgb(255,255,255);
        console.error(bg(fg(([
            ``,
            `Error Occured during execution:`,
            `message: ${props.message}`,
            `file: ${props.file}`,
            ``
        ].join('\n')))));
        process.exit();
    }
}


export const reporter = new Reporter();

