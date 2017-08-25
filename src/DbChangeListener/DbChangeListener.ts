import { RequestData } from './RequestData';
import BaseModule from "../common/BaseModule";
import koa = require('koa');
import bodyParser = require('koa-bodyparser')
import http = require('http');

export default class DbChangeListener extends BaseModule {

    private _koa: koa | undefined;
    private _http: http.Server | undefined;

    start(): Promise<void> {
        return new Promise<void>((resolve) => {
            if (this._http === undefined) {
                this._koa = new koa();
                this._koa.use(bodyParser())
                this._koa.use(async ctx => {
                    //只允许post
                    if (ctx.method === 'POST') {
                        this.dispatch(new RequestData(ctx.request.body));
                    } else {
                        ctx.status = 403;
                    }
                });

                this._http = http.createServer(this._koa.callback());
                this._http.listen(3000);
                this._koa.on('error', this.emit.bind(this, 'error'));
                this._http.on('listening', resolve);
            } else {
                resolve();
            }
        });
    }

    destroy(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this._http !== undefined) {
                this._http.close((err: Error) => {
                    this._http = undefined;
                    this._koa = undefined;
                    if (err) reject(err);
                    resolve();
                })
            } else {
                resolve();
            }
        });
    }

    //负责分发接收到的数据
    dispatch(data: RequestData): void {
        console.log(data);
    }
}