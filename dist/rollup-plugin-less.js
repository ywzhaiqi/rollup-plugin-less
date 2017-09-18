'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fs = _interopDefault(require('fs-extra'));
require('path');
var less = _interopDefault(require('less'));
var rollupPluginutils = require('rollup-pluginutils');

/*
 * create a style tag and append to head tag
 * @params {String} css style
 */

function insertStyle ( css ) {
    if(!css) return ;

    if(typeof(window) == 'undefined') return ;
    let style = document.createElement('style');
    style.setAttribute('media', 'screen');
    style.setAttribute('class', '{class}');

    style.innerHTML = css;
    document.head.appendChild(style);
    return css;
}

let renderSync = (code, option) => {
    return less.render(code, option)
        .then(function(output){
            return output.css;
        }, function(error){
            throw error;
        })
};

let fileCount = 0;

function plugin (options = {}) {
    options.insert = options.insert || false;
    options.styleClass = options.styleClass || 'inject';
    const filter = rollupPluginutils.createFilter(options.include || [ '**/*.less', '**/*.css' ], options.exclude || 'node_modules/**');

    const injectFnName = '__$styleInject';
    return {
        name: 'less',
        intro() {
            return options.insert ? 
                insertStyle.toString()
                    .replace(/insertStyle/, injectFnName)
                    .replace(/{class}/, options.styleClass) :
                '';
        },
        async transform(code, id) {
            if (!filter(id)) {
                return null;
            }
            fileCount++;

            try {
                options.option = options.option || {};
                options.option['filename'] = id;
                options.output = options.output || 'rollup.build.css';
                if (options.plugins) {
                  options.option['plugins'] = options.plugins;
                }

                let css = await renderSync(code, options.option);

                if(options.output&&isFunc(options.output)){
                    css = await options.output(css, id);
                }

                if (options.output&&isString(options.output)) {
                    if(fileCount == 1){
                        //clean the output file
                        fs.removeSync(options.output);
                    }
                    fs.appendFileSync(options.output, css);
                }

                let exportCode = '';

                if(options.insert!=false){
                    exportCode = `export default ${injectFnName}(${JSON.stringify(css.toString())});`;
                }else{
                    exportCode = `export default ${JSON.stringify(css.toString())};`;
                }
                return {
                    code: exportCode,
                    map: { mappings: '' }
                };
            } catch (error) {
                throw error;
            }
        }
    };
}

function isString (str) {
    if(typeof str == 'string'){
        return true;
    }else{
        return false;
    }
}

function isFunc (fn){
    if ( typeof fn == 'function' ){
        return true;
    }else{
        return false;
    }
}

module.exports = plugin;
