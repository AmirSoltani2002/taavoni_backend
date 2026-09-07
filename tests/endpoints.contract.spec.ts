import { RequestMethod } from '@nestjs/common';
import { METHOD_METADATA, PATH_METADATA } from '@nestjs/common/constants';
import { AppController } from '../src/app.controller';
import { AuthController } from '../src/auth/auth.controller';
import { BlocksController } from '../src/blocks/blocks.controller';
import { FinalTransactionController } from '../src/final-transaction/final-transaction.controller';
import { InvoiceController } from '../src/invoice/invoice.controller';
import { NegativeFloorsController } from '../src/negative-floors/negative-floors.controller';
import { OtherChatsController } from '../src/other-chats/other-chats.controller';
import { OtherTicketsController } from '../src/other-tickets/other-tickets.controller';
import { PostsController } from '../src/posts/posts.controller';
import { PreSellingController } from '../src/pre-selling/pre-selling.controller';
import { ProjectDocsController } from '../src/project-docs/project-docs.controller';
import { ProjectsController } from '../src/projects/projects.controller';
import { SubProjectDocsController } from '../src/sub-project-docs/sub-project-docs.controller';
import { SubProjectTicketsController } from '../src/sub-project-tickets/sub-project-tickets.controller';
import { SubprojectChatsController } from '../src/subproject-chats/subproject-chats.controller';
import { SubprojectsController } from '../src/subprojects/subprojects.controller';
import { TransactionHistoryController } from '../src/transaction-history/transaction-history.controller';
import { TransactionController } from '../src/transaction/transaction.controller';
import { UserDocController } from '../src/user-doc/user-doc.controller';
import { UsersController } from '../src/users/users.controller';

type ControllerClass = {
  name: string;
  prototype: object;
};

type Endpoint = {
  controller: string;
  handler: string;
  method: string;
  path: string;
};

const controllers: ControllerClass[] = [
  AppController,
  AuthController,
  BlocksController,
  FinalTransactionController,
  InvoiceController,
  NegativeFloorsController,
  OtherChatsController,
  OtherTicketsController,
  PostsController,
  PreSellingController,
  ProjectDocsController,
  ProjectsController,
  SubProjectDocsController,
  SubProjectTicketsController,
  SubprojectChatsController,
  SubprojectsController,
  TransactionHistoryController,
  TransactionController,
  UserDocController,
  UsersController,
];

function joinPath(controllerPath: string, routePath: string): string {
  return (
    '/' +
    [controllerPath, routePath]
      .filter(Boolean)
      .join('/')
      .replace(/^\/+|\/+$/g, '')
  );
}

function getEndpoints(controller: ControllerClass): Endpoint[] {
  const controllerPath =
    (Reflect.getMetadata(PATH_METADATA, controller) as string | undefined) ??
    '';

  return Object.getOwnPropertyNames(controller.prototype).flatMap((handler) => {
    if (handler === 'constructor') {
      return [];
    }

    const callback = Reflect.get(controller.prototype, handler) as
      | object
      | undefined;
    if (!callback) {
      return [];
    }

    const method = Reflect.getMetadata(METHOD_METADATA, callback) as
      | RequestMethod
      | undefined;
    const routePath = Reflect.getMetadata(PATH_METADATA, callback) as
      | string
      | undefined;
    if (method === undefined || routePath === undefined) {
      return [];
    }

    return [
      {
        controller: controller.name,
        handler,
        method: RequestMethod[method],
        path: joinPath(controllerPath, routePath),
      },
    ];
  });
}

const endpoints = controllers.flatMap(getEndpoints);

describe('Backend endpoint contracts', () => {
  it.each(endpoints)(
    '$method $path ($controller.$handler)',
    ({ method, path, controller, handler }) => {
      expect(method).toMatch(/^(GET|POST|PUT|PATCH|DELETE)$/);
      expect(path).toMatch(/^\/[A-Za-z0-9:/-]*$/);
      expect(controller).toMatch(/Controller$/);
      expect(handler).not.toBe('constructor');
    },
  );

  it('registers every method/path combination only once', () => {
    const routeKeys = endpoints.map(({ method, path }) => method + ' ' + path);
    expect(new Set(routeKeys).size).toBe(routeKeys.length);
  });

  it('keeps project and subproject post routes distinct', () => {
    const routeKeys = endpoints.map(({ method, path }) => method + ' ' + path);
    expect(routeKeys).toContain('GET /posts/project/:id');
    expect(routeKeys).toContain('GET /posts/subproject/:id');
  });
});
