/// <reference path="index.ts" />
import { Express, Router, Request, Response } from 'express'
import { RouteMetadata } from './annotations'

/**
 * Base class for MVC-like controllers
 */
export class Controller {

  protected router: Router
  protected name: string

  public constructor() {
    let proto: any = (<Object>this).constructor
    this.name = (<string>proto.name).replace('Controller', '').toLowerCase()
    this.router = Router()
    let routes: RouteMetadata[] = Reflect.getMetadata("controller:routes", this)
    if (!routes) {
      return
    }
    routes.forEach(route => {
      // get suitable express.Router method, like router.get() or router.post()
      let method: Function = (<any>this.router)[route.method]
      // register route handler with it, applying route path
      let path = '/' + route.route
      method.call(this.router, path, (req: Request, res: Response, next: Function) => {
        return route.handler.apply(this, [req, res])
        .catch((err: Error) => {
          next(err)
        })
      })
    })
  }

  public get Router() {
    return this.router
  }

  public get Name() {
    return this.name
  }
}
