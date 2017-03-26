'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Dependencies
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _child_process = require('child_process');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Swift = function () {

    /**
     * Creates an instance of Swift.
     *
     * @constructor
     * @this {Swift}
     * @param {Object {}} options
     * @param {string} options.department Architecture department to which the project belongs, for example "ui"
     * @param {string} options.user
     * @param {string} options.password
     * @param {string} [options.keystonePort = 35357] HTTP port to connect with Keystone. For Melicloud use 35357, for Fury use 5000
     * @param {string} [options.container = statics] Swift container
     * @param {string} [options.friendlyUrl] Name to be displayed on the route of public assets. If friendlyUrl = swift -> ui.mlstatic.com/swift/[VERSION]/[FILE_NAME]
     * @param {string} options.folder Folder with the files you want to upload to swift. Generally would dist folder
     * @param {string} [options.version] Number for versioning file url.  Generally the same version that the module
     * @param {string} [options.verbose = false] Log all executed curls
     */
    function Swift() {
        var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        var department = _ref.department;
        var user = _ref.user;
        var password = _ref.password;
        var _ref$keystonePort = _ref.keystonePort;
        var keystonePort = _ref$keystonePort === undefined ? '35357' : _ref$keystonePort;
        var _ref$container = _ref.container;
        var container = _ref$container === undefined ? 'statics' : _ref$container;
        var friendlyUrl = _ref.friendlyUrl;
        var folder = _ref.folder;
        var version = _ref.version;
        var _ref$verbose = _ref.verbose;
        var verbose = _ref$verbose === undefined ? false : _ref$verbose;

        _classCallCheck(this, Swift);

        this.department = department;
        this.user = user;
        this.password = password;
        this.keystonePort = keystonePort;

        this.container = container;
        this.friendlyUrl = friendlyUrl;

        this.folder = folder;
        this.version = version;

        this.verbose = verbose;

        // Store token and hash after authenticating
        this.authenticationData = {};
    }

    /**
     * Authenticate the user and get a token
     * @method
     * @return {Promise}
     */


    _createClass(Swift, [{
        key: 'auth',
        value: function auth() {
            var _this = this;

            return new Promise(function (resolve, reject) {

                var data = {
                    'auth': {
                        'tenantName': _this.department,
                        'passwordCredentials': {
                            'username': _this.user,
                            'password': _this.password
                        }
                    }
                };

                var request = 'curl -s -d \'' + JSON.stringify(data) + '\' -H "Content-type: application/json" "http://essexkeystone.melicloud.com:' + _this.keystonePort + '/v2.0/tokens"';

                console.log('\nAuthenticating...');
                _this.log(request);

                (0, _child_process.exec)(request, function (err, stdout, stderr) {
                    if (err) {
                        return reject(new Error(err));
                    }

                    var response = JSON.parse(stdout.toString());

                    _this.authenticationData = {
                        hash: response.access.token.tenant.id,
                        token: response.access.token.id
                    };

                    resolve(!!(_this.authenticationData.hash && _this.authenticationData.token));
                });
            });
        }

        /**
         * Check if the container exists
         * @method
         * @return {Promise}
         */

    }, {
        key: 'checkContainer',
        value: function checkContainer() {
            var _this2 = this;

            return new Promise(function (resolve, reject) {
                var request = 'curl -X GET -H "X-Auth-Token: ' + _this2.authenticationData.token + '" "http://files.melicloud.com:8080/v1/AUTH_' + _this2.authenticationData.hash + '/' + _this2.container + '" -w %{http_code} -s --output /dev/null';

                console.log('\nChecking if the container exists...');
                _this2.log(request);

                (0, _child_process.exec)(request, function (err, stdout, stderr) {
                    if (err) {
                        return reject(new Error(err));
                    }

                    var response = JSON.parse(stdout.toString());

                    if (response === 200 || response === 204) {
                        console.log('The container already exists.');
                        resolve(true);
                    } else if (response === 404) {
                        console.log('The container not exists.');
                        reject(false);
                    } else {
                        reject(new Error('Could not check if the container ' + _this2.container + ' exists. Response code ' + response));
                    }
                });
            });
        }

        /**
         * Create a new container
         * @method
         * @return {Promise}
         */

    }, {
        key: 'createContainer',
        value: function createContainer() {
            var _this3 = this;

            return new Promise(function (resolve, reject) {
                var request = 'curl -X PUT -H "X-Auth-Token: ' + _this3.authenticationData.token + '" "http://files.melicloud.com:8080/v1/AUTH_' + _this3.authenticationData.hash + '/' + _this3.container + '" -w %{http_code} -s --output /dev/null -H "X-Container-Read: .r:*,.rlistings"';

                console.log('\nCreating the container...');
                _this3.log(request);

                (0, _child_process.exec)(request, function (err, stdout, stderr) {
                    if (err) {
                        return reject(new Error(err));
                    }

                    var response = JSON.parse(stdout.toString());

                    if (response != 201) {
                        reject(new Error('Could not create the container ' + _this3.container + '. Response code ' + response));
                    }

                    console.log('Container created');
                    resolve(true);
                });
            });
        }

        /**
         * Upload a file
         * @method
         * @return {Promise}
         */

    }, {
        key: 'uploadFile',
        value: function uploadFile(filePath, fileName) {
            var _this4 = this;

            return new Promise(function (resolve, reject) {

                var encodingHeader = fileName.indexOf('.gz') > -1 ? '-H "Content-Encoding:gzip" ' : '';
                var request = 'curl -X PUT -H "X-Auth-Token: ' + _this4.authenticationData.token + '" ' + encodingHeader + ' -T ' + filePath + ' "http://files.melicloud.com:8080/v1/AUTH_' + _this4.authenticationData.hash + '/' + _this4.container + '/' + (_this4.friendlyUrl ? _this4.friendlyUrl + '/' : '') + (_this4.version ? _this4.version + '/' : '') + fileName + '" -w %{http_code} -s --output /dev/null';

                console.log('Uploading ' + fileName);
                _this4.log(request);

                (0, _child_process.exec)(request, function (err, stdout, stderr) {
                    if (err) {
                        return reject(err);
                    }

                    var response = JSON.parse(stdout.toString());

                    if (response != 201) {
                        return reject(new Error('Could not upload the file ' + fileName + '. Response code ' + response));
                    }

                    resolve(true);
                });
            });
        }

        /**
         * Displays the message if the user selects verbose mode
         * @method
         *
         */

    }, {
        key: 'log',
        value: function log(message) {
            if (this.verbose) {
                console.log(message);
            }
        }
    }]);

    return Swift;
}();

exports.default = Swift;
module.exports = exports['default'];