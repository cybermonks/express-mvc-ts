/// <reference path="index.ts" />
import { Express, Router, Request, Response } from 'express';
import { RouteMetadata } from './annotations';

/**
 * Base class for MVC-like controllers
 */
export class Controller {

    protected router: Router;
    protected name: string;

    public constructor() {
        let proto: any = (<Object>this).constructor;
        this.name = (<string>proto.name).replace('Controller', '').toLowerCase();
        this.router = Router();
        let routes: RouteMetadata[] = Reflect.getMetadata("controller:routes", this);
        if (routes) {
            routes.forEach(route => {
                let method: Function = (<any>this.router)[route.method];
                method.call(this.router, '/' + route.route, (req: Request, res: Response) => {
                    return route.handler.apply(this, [req, res])
                    .catch((err : Error) => {
                        res.status(500).end(err.toString())
                    })
                });
            });
        }
    }

    public get Router() {
        return this.router;
    }

    public get Name() {
        return this.name;
    }
}
