## 修改说明

- 原版本用了 async 为了兼容低版本 node，需要 `babel-runtime/regenerator` 等，此修改版去掉了这些需求，但是 node > 7.6
- 增加了新选项 `styleClass: 'inject'`

## Install

```bash
npm install @ywzhaiqi/rollup-plugin-less

# 或
yarn add @ywzhaiqi/rollup-plugin-less
```

## usage

```js
import './test.less';
//generate css will be auto insert to the head tag if you set insert be true
```

```js
import { rollup } from 'rollup';
import less from 'rollup-plugin-less';

rollup({
    entry: 'main.js',
    plugins: [
        less()
    ]
});
```


## Options

### insert

+ Default: `false`
+ Type: `Boolean`

If you specify `true`, the plugin will insert compiled CSS into `<head/>` tag.

### styleClass

+ Default: `inject`
+ Type: `String`

### output

+ Default: `rollup.build.css`

+ Type: `String|Function`

If you specify a string, it will be the path to write the generated CSS.
If you specify a function, call it passing the generated CSS as an argument.

### include

+ Default: `[ '**/*.less', '**/*.css' ]`

+ Type: `String|Array`

Minimatch pattern or array of minimatch patterns to determine which files are transpiled by the plugin.

### exclude

+ Default: `node_modules/**`

+ Type: `String|Array`

Minimatch pattern or array of minimatch patterns to determine which files are explicitly not transpiled by the plugin, overrules the `include` option.

### option

+ Type: `Object`

Options for [less](http://lesscss.org/usage/#programmatic-usage).
