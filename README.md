A high order component for binding to reflux stores.

## Install

  npm install --save reflux-provides-store

## Usage

`providesStore` is a function that takes a store and returns a function that takes a component. 
This works well with decorators, but can be used like `Component = providesStore(Store)(Component)` for any component.

You specify the prop name by using propTypes as shown below.

## Example

```js
import React, {PropTypes} from 'react';
import {Users} from '../utils/actions';
import providesStore from '../utils/decorators/providesStore';
import UserStore from '../stores/UserStore';
import UserDetails from '../molecules/UserDetails';

export default
@providesStore(UserStore)
class UserDetailsWrapper extends React.Component {
  static propTypes = {
    users: providesStore.getPropType(UserStore),
    userId: PropTypes.string.isRequired,
  };

  componentWillReceiveProps(nextProps){
    if (!this.props.users[nextProps.userId]) {
      Users.get(nextProps.userId);
    }
  }

  componentDidMount(){
    if (!this.props.users[this.props.userId]) {
      Users.get(this.props.userId);
    }
  }

  render(){
    var user = this.props.users[this.props.userId];
    if (!user) {
      return null;
    }

    return (
      <UserDetails user={user} />
    );
  }
}
```

