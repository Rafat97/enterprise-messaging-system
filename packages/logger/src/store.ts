import { AsyncLocalStorage } from 'async_hooks';

export class Store {
  constructor(public request: Request) {}
}

export const storage = new AsyncLocalStorage<Store>();
