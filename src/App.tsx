import React from 'react';
import './App.css';
import { useClicksApi } from './hooks/useClicksApi';
import CountItem from './CountItem';

function App() {
	const [loaded, updateCount, countData] = useClicksApi();
	const dataToList = Object.values(countData);

	return (
		<div className="App">
			<div className="interaction">
				<button onClick={updateCount}>
					<h2>Click Me</h2>
				</button>
			</div>
			<div className="items-wrapper">
				<ol className="items">
					{dataToList.length === 0 ? (
						loaded ? (
							<h3 style={{ textAlign: 'center' }}>
								No data yet. Why not click that button?
							</h3>
						) : (
							<h3 style={{ textAlign: 'center' }}>
								Fetching Clicks From Server
							</h3>
						)
					) : (
						dataToList
							.sort((a, b) => b.clicks - a.clicks)
							.map((a) => <CountItem id={a.id} clicks={a.clicks} key={a.id} />)
					)}
				</ol>
			</div>
		</div>
	);
}

export default App;
