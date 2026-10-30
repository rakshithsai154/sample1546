import logo from './logo.svg';
import React from 'react';
import './App.css';
class LifeCycle extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state={ count : 0};
    console.log("constructor called");
  }
  componentDidMount()
  {
    console.log("Mounted");
  }
  componentDidUpdate()
  {
    console.log("updated");
  }
  componentWillUnmount()
  {
    console.log("unmounted");
  }
  render()
  {
    console.log("render called!")
    return (
      <div>
      <h2>Count:{this.state.count}</h2>
      <button onClick={() =>
                    this.setState({ count: this.state.count + 1 })
                }>Increment</button>
                </div>
    );
  }
}

function App() {
   return(
    <LifeCycle />
   );
  
}

export default App;
