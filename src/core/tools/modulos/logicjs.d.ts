declare module 'logicjs' {
  export function lvar(name?: string): any;
  export function eq(a: any, b: any): any;
  export function and(...goals: any[]): any;
  export function or(...goals: any[]): any;
  export function run(n: number | '*', ...args: any[]): any;
}
