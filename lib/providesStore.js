'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

exports['default'] = providesStore;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function providesStore(store, Component) {
  var selectors = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

  if (arguments.length < 2) return providesStore.bind(null, store);

  var propTypes = Component.propTypes || {};
  var matchedPropName = Object.keys(propTypes).find(function (key) {
    return propTypes[key] && propTypes[key]._refluxStore === store;
  });

  if (selectors === null) {
    selectors = _defineProperty({}, store.name || matchedPropName || 'store', function (store) {
      return store;
    });
  }

  return (function (_React$Component) {
    _inherits(StoreProvider, _React$Component);

    function StoreProvider() {
      _classCallCheck(this, StoreProvider);

      _get(Object.getPrototypeOf(StoreProvider.prototype), 'constructor', this).call(this);
      this.state = {
        storeState: store.getState ? store.getState() : undefined
      };
    }

    _createClass(StoreProvider, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        var _this = this;

        this.unsubscribe = store.listen(function (storeState) {
          _this.setState({ storeState: storeState });
        });
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        this.unsubscribe();
      }
    }, {
      key: 'render',
      value: function render() {
        var _this2 = this;

        var selectedProps = Object.keys(selectors).reduce(function (props, propName) {
          return Object.assign(props, _defineProperty({}, propName, selectors[propName](_this2.state.storeState)));
        }, {});

        return _react2['default'].createElement(Component, _extends({}, this.props, selectedProps));
      }
    }]);

    return StoreProvider;
  })(_react2['default'].Component);
}

providesStore.getPropType = function (store) {
  var type = function type() {
    return _react.PropTypes.any.apply(_react.PropTypes, arguments);
  };
  type._refluxStore = store;
  return type;
};
module.exports = exports['default'];