import React from 'react';
import Dropzone from 'react-dropzone';
import util from 'gulp-util';
import './swift';
import objectAssign from 'object-assign';
import './dropdown';
import Dropdown from './components/Dropdown';

let departments = [
    {title:'prueba', value:'prueba1',type:'department'},
    {title:'prueba2', value:'prueba2',type:'department'},
    {title:'prueba3',value:'prueba3',type:'department'}
],
projects = [
  {title:'Prueba' ,value:'prueba', container:'asdasd',password:'asdasd',type:'project'},
  {title: 'Prueba2', value:'prueba2',container:'asdaddada',password:'sfasfsaffaf',type:'project'}
]

class App extends React.Component{
  constructor (){
    super();
    this.state = {
     files: null,
     swift : null,
     department : null
    };
    this.onDrop = this.onDrop.bind(this);
    this.sendImage = this.sendImage.bind(this);
    this.updateValues = this.updateValues.bind(this);

  }
  onDrop (files) {
      this.setState({files}); 
  }

  sendImage (){
    console.log(this.state);
    var swiftObject = {
      department : this.state.department.title,
      user : this.state.swift.value,
      password : this.state.swift.password,
      container :  this.state.swift.container,
      verbose : true
    }
    var defaultConfig = {
            'version': util.env.release,
            'folder': 'pepe'
        };

        console.log(util);
  }

  updateValues (value){
    if(value.type == 'department'){
      this.setState({department:value});
    }else{
        this.setState({swift:value});
    }
    
  }

  setUpdates (){
    if(this.state.files){
      return <div className="dropzone--imageBox">
              <h2>Subiendo {this.state.files.length} {this.state.files.length > 1 ? 'archivos' : 'archivo' } ...</h2>
              <div>{this.state.files.map((file,index) => <img role="presentation" height="auto" width="300" key={index} src={file.preview}/>)}</div>
            </div>
    }
  }
  render(){
    return <div className="main-content">
              <Dropzone ref="dropzone" onDrop={this.onDrop} >
              <div className="dropzone--title">Arrastra las imagenes que quieras subir o haz click aqui.</div>
              </Dropzone>
              {this.setUpdates()}
              <div className="dropdown-form">
                <div>
                  <span>Seleciona el departamento : </span>
                    <Dropdown optionList={departments} updateValues={this.updateValues} type="department" /> 
                </div>
             </div>  
                <div className="dropdown-form">
                  <div>
                      <span>Seleciona el proyecto: </span>
                      <Dropdown optionList={projects} updateValues={this.updateValues} type="project" /> 
                </div>        
              </div>
              <div className="button__use">
                  <button className="ui-button ui-button--primary" onClick={this.sendImage}>Subir</button>
              </div>
          </div>

  }
}
export default App;
