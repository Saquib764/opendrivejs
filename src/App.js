import './App.scss';
import { Route, Router } from "react-router-dom";
import history from './util/history'

import Dashboard from './page/Dashboard'
import Scenario from './page/Scenario'
import Three from './page/Three'


function App() {
  return (
    <div className="App">
       <Router history={history}>
          <Route exact path={'/'} component={Dashboard} />
          <Route exact path={'/scenario/'} component={Scenario} />
          <Route exact path={'/three/'} component={Three} />
       </Router>
    </div>
  );
}

export default App;
