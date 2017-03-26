import React from 'react';

class DropdownItem extends React.Component{
  render(){
    return(<ul className="ui-list__content">
        {this.props.optionList.map((option,index) => {
            return (
                    <li  key={index}  className="ui-list__item ui-list__item--selected">
                        <a className="ui-list__item-option" href="#" data-string={option.title} data-step-value={option.value} onClick={this.props.updateValues.bind(this,option)}>
                            {option.title}
                        </a>
                    </li>
 
            );
        })}
        </ul>
        
    );
  }
}
export default DropdownItem;