import React, {PropTypes} from 'react';

export default function providesStore(store, Component, selectors=null){
  if (arguments.length < 2) return providesStore.bind(null, store);

  var propTypes = Component.propTypes || {};
  var matchedPropName = Object.keys(propTypes).find((key) => {
    return propTypes[key] && propTypes[key]._refluxStore === store;
  });

  if (selectors === null) {
    selectors = { [store.name || matchedPropName || 'store']: store => store };
  }

  return class StoreProvider extends React.Component {
    constructor(){
      super();
      this.state = {
        storeState: store.getState ? store.getState() : undefined,
      };
    }
    componentDidMount(){
      this.unsubscribe = store.listen((storeState) => {
        this.setState({storeState});
      });
    }
    componentWillUnmount(){
      this.unsubscribe();
    }
    render(){
      let selectedProps = Object.keys(selectors).reduce((props, propName) => {
        return Object.assign(props, {[propName]: selectors[propName](this.state.storeState)});
      }, {});

      return (
        <Component
          {...this.props}
          {...selectedProps}
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

