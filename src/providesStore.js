import React from 'react';

export default function providesStore(store, Component, selector = null) {
  if (arguments.length < 2) return providesStore.bind(null, store);

  const storeName = store.name || 'store';
  const componentName = Component.displayName || Component.name || 'Component';

  if (selector === null) {
    selector = state => ({ [storeName]: state });
  }

  class StoreProvider extends React.Component {
    displayName = `Provides(${storeName})(${componentName})`;

    constructor() {
      super();
      this.state = { storeState: store.getInitialState ? store.getInitialState() : undefined };
    }

    componentDidMount() {
      this.unsubscribe = store.listen(storeState => {
        this.setState({ storeState });
      });
    }

    componentWillUnmount() {
      this.unsubscribe();
    }

    render() {
      return <Component {...this.props} {...selector(this.state.storeState)} />;
    }
  }
  return StoreProvider;
}

providesStore.getPropType = store => {
  var type = (...args) => PropTypes.any(...args);
  type._refluxStore = store;
  return type;
};
