import React, { Component } from 'react';
import classes from './Layout.module.css';
import MenuToggle from '../../components/Nav/MenuToggle/MenuToggle';
import MenuMain from '../../components/Nav/MenuMain/MenuMain';


class Layout extends Component {
  state = {
    menu: false,
  }

  toggleMenuHandler = () => {
    this.setState({
      menu: !this.state.menu,
    })
  }

  backdropClickHandler = () => {
    this.setState({
      menu: false,
    })        
  }

  render() {
    return (
      <div className={classes.Layout}>

        <MenuMain
          isOpen={this.state.menu}
          backdropClick={this.backdropClickHandler}
        />

        <MenuToggle
          onToggle={this.toggleMenuHandler}
          isOpen={this.state.menu}
        />

        <main>
            {this.props.children}
        </main>
      </div>
    );
  }
}

export default Layout;
