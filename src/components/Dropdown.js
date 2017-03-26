import React from 'react';
import DropdownItem from './DropdownItem';


class Dropdown extends React.Component{
  render(){
      return <div className="ui-dropdown">
    <a href="#" className="ui-dropdown__link" data-js={this.props.type}>
        Elige...
        <span className="ui-dropdown__indicator">
            <svg width="28" height="17" viewBox="0 0 28 17" xmlns="http://www.w3.org/2000/svg" className="ui-icon ui-icon--chevron">
                <path d="M26.086 2L13.543 14.513 1 2" strokeWidth="3" stroke="#CBCBCB" fill="none" fillRule="evenodd"/>
            </svg>
        </span>
    </a>
    <div className={"ui-dropdown__content " + this.props.type} >
        <div className="ui-list">
           <DropdownItem optionList={this.props.optionList} updateValues={this.props.updateValues} />
        </div>
    </div>
</div>

  }
}
export default Dropdown;

 