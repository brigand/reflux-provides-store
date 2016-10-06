import React, {PropTypes} from 'react';

export default function providesStore(store, Component, selector=null){
  if (arguments.length < 2) return providesStore.bind(null, store);

  var propTypes = Component.propTypes || {};
  var matchedPropName = Object.keys(propTypes).find((key) => {
    return propTypes[key] && propTypes[key]._refluxStore === store;
  });

  const storeName = store.name || matchedPropName || 'store';
  const componentName = Component.displayName || Component.name || 'Component'

  if (selector === null) {
    selector = (state) => {[storeName]: state};
  }

  return class StoreProvider extends React.Component {
    constructor(){
      super();
      this.state = { storeState: store.getState ? store.getState() : undefined };
    }

    static displayName() { return `Provides(${storeName})(${componentName})`};

    componentDidMount(){
      this.unsubscribe = store.listen((storeState) => {
        this.setState({storeState});
      });
    }

    componentWillUnmount(){
      this.unsubscribe();
    }

    render(){
      return (
        <Component
          {...this.props}
          {...selector(this.state.storeState)}
        />
      );
    }
  };
}

providesStore.getPropType = (store) => {
  var type = (...args) => PropTypes.any(...args);
  type._refluxStore = store;
  return type;
}

