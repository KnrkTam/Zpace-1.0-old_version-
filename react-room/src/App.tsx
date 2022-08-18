import React from "react";
import store, { history } from "./redux/store";
import "./css/App.css";
import { ConnectedRouter } from "connected-react-router";
import { Provider } from "react-redux";
import Nav from "./components/Nav";
import Routes from "./routes";
import { Notifications } from 'react-push-notification';



// test
// import { Route } from "react-router-dom";
// import Join from './components/Join';


function App() {
	return (
		<Provider store={store}>
			<ConnectedRouter history={history}>
				<div className="App">
				<Notifications />
					<Nav />
					<Routes />
				</div>
			</ConnectedRouter>
		</Provider>
	);
}

export default App;
