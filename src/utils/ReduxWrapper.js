import React from 'react';
import {connect} from 'react-redux';
import { loginUser, logoutUser } from '../redux/authAction';
import { setPages, setSettings } from '../redux/storeData';

export const mapStateToProps = (state) => ({
  products: state.products ,
  auth: state.auth,
  pages: state.pages,
  settings: state.settings
});

export const mapDispatchToProps = {
  loginUser$:loginUser,
  logoutUser$: logoutUser,
  setPages$: setPages,
  setSettings$:setSettings
};

export const hocComponentName = (WrappedComponent) => {
  const hocComponent = ({...props}) => <WrappedComponent {...props} />;

  hocComponent.propTypes = {};

  return hocComponent;
};

export default (ReduxWrapper) =>
  connect(mapStateToProps, mapDispatchToProps)(hocComponentName(ReduxWrapper));
