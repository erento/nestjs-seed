# x---service-name---x Service

## Basic commands

- build `npm run build` will generate JS files to `/dist`. Run production build with `npm run start:prod`
- run in dev mode: `npm start`
- tests: `npm t`

## Tests

Tests are written in Jest.

## Usage

### Authorization

```typescript
class MyClass {
    @Get()
    @Auth() // you can provide also a key to authorize to e.g.: @Auth(AuthorizationType.service)
    getUser () { ... }
}
```
