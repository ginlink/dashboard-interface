import {Suspense} from "react"
import {HashRouter as Router } from "react-router-dom"

import Index from "./layout/main"

function App() {
  
  return (
    <div className="App">
      <Suspense fallback={<div>加载中</div>}>
        <Router>
          <Index />
        </Router>
      </Suspense>
    </div>
  );
}

export default App;
