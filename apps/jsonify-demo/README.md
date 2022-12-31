# @cgdangelo/talent-jsonify-demo

Parse a demo and print the result to console.

:warning: Disk usage warning. Demo JSON output can be very large! :warning:

## Usage

### As a command-line tool

```
npm install -g @cgdangelo/talent-jsonify-demo
talent-jsonify-demo <path to demo.dem> > demo.json
```
```
npx @cgdangelo/talent-jsonify-demo <path to demo.dem> > demo.json
```

### As a library in your application

* Add as a dependency.
    ```
    npm install @cgdangelo/talent-jsonify-demo
    ```

* Import and use your desired API.
    * TaskEither instance for fp-ts users:
        ```ts
        import { pipe } from 'fp-ts/lib/function';
        import * as TE from 'fp-ts/lib/TaskEither';
        import { jsonifyDemoTaskEither } from '@cgdangelo/talent-jsonify-demo';

        const main = pipe(
          jsonifyDemoTaskEither('<path to demo.dem>'),
          TE.map((demoString) => {
            /* ... */
          })
        );
        ```

    * Promise instance:
        ```ts
        import { jsonifyDemo } from '@cgdangelo/talent-jsonify-demo';

        async function main() {
          const demoString = await jsonifyDemo('<path to demo.dem>');

          /* ... */
        }
        ```
